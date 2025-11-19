import { VM } from '../data/mockApi';

export interface RecommendedPhase {
  id: string;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  vms: VM[];
  region: string;
  category: string;
  estimatedDuration: string;
  complexity: 'Simple' | 'Moderate' | 'Complex';
  recommendations: string[];
}

// Scoring system for VM migration priority
function calculateVMScore(vm: VM): number {
  let score = 100;

  // Category scoring (C1 is simplest, should go first)
  const categoryScores: { [key: string]: number } = {
    'C1': 50, // Direct migration - highest priority
    'C2': 40, // Storage offloading - high priority
    'C3': 30, // Optimization - medium priority
    'C4': 20, // Optimization with large VMs - lower priority
    'C5': 10  // Direct with compressed - lowest priority (has RDM)
  };
  score += categoryScores[vm.category] || 0;

  // VM size scoring (smaller VMs first)
  if (vm.memory <= 8) {
    score += 30; // Small VMs
  } else if (vm.memory <= 16) {
    score += 20; // Medium VMs
  } else if (vm.memory <= 32) {
    score += 10; // Large VMs
  }

  // Storage scoring (less storage = easier migration)
  if (vm.storage <= 500) {
    score += 20;
  } else if (vm.storage <= 1000) {
    score += 10;
  }

  return score;
}

export function generateRecommendedPhases(vms: VM[]): RecommendedPhase[] {
  const recommendedPhases: RecommendedPhase[] = [];
  
  // Group VMs by region
  const vmsByRegion = vms.reduce((acc, vm) => {
    if (!acc[vm.region]) {
      acc[vm.region] = [];
    }
    acc[vm.region].push(vm);
    return acc;
  }, {} as { [region: string]: VM[] });

  let phaseCounter = 1;

  // For each region, create recommended phases
  Object.entries(vmsByRegion).forEach(([region, regionVMs]) => {
    // Calculate scores for all VMs in the region
    const scoredVMs = regionVMs.map(vm => ({
      vm,
      score: calculateVMScore(vm)
    })).sort((a, b) => b.score - a.score);

    // Group by category for better organization
    const vmsByCategory = scoredVMs.reduce((acc, { vm }) => {
      if (!acc[vm.category]) {
        acc[vm.category] = [];
      }
      acc[vm.category].push(vm);
      return acc;
    }, {} as { [category: string]: VM[] });

    // Create phases for each category (prioritize C1, then C2, etc.)
    const categoryOrder = ['C1', 'C2', 'C3', 'C4', 'C5'];
    
    categoryOrder.forEach(category => {
      const categoryVMs = vmsByCategory[category];
      if (!categoryVMs || categoryVMs.length === 0) return;

      // Determine complexity and priority based on category
      let complexity: 'Simple' | 'Moderate' | 'Complex' = 'Simple';
      let priority: 'High' | 'Medium' | 'Low' = 'High';
      let reason = '';
      let phaseRecommendations: string[] = [];

      switch (category) {
        case 'C1':
          complexity = 'Simple';
          priority = 'High';
          reason = 'Direct migration with minimal complexity. No clusters, RDM, or appliances. Ideal for initial migration phase.';
          phaseRecommendations = [
            'Start with smallest VMs to build confidence',
            'Use this phase to validate migration process',
            'Low risk, quick wins for stakeholder confidence'
          ];
          break;
        case 'C2':
          complexity = 'Moderate';
          priority = 'High';
          reason = 'Storage offloading required for large VMs. Good candidate after C1 success.';
          phaseRecommendations = [
            'Ensure adequate storage capacity in target',
            'Plan for storage optimization post-migration',
            'Monitor storage performance during migration'
          ];
          break;
        case 'C3':
          complexity = 'Moderate';
          priority = 'Medium';
          reason = 'Appliance VMs require optimization. Should be tackled after simpler migrations.';
          phaseRecommendations = [
            'Review appliance configurations before migration',
            'Plan for appliance reconfiguration in OpenShift',
            'Allocate additional time for testing'
          ];
          break;
        case 'C4':
          complexity = 'Complex';
          priority = 'Medium';
          reason = 'Large appliance VMs require both storage offloading and optimization.';
          phaseRecommendations = [
            'Conduct thorough pre-migration assessment',
            'Ensure sufficient resources in target environment',
            'Plan for extended cutover window'
          ];
          break;
        case 'C5':
          complexity = 'Complex';
          priority = 'Low';
          reason = 'RDM (Raw Device Mapping) requires special handling and compressed migration.';
          phaseRecommendations = [
            'RDM requires careful planning and conversion',
            'Consider this phase only after team has migration experience',
            'Allocate buffer time for troubleshooting'
          ];
          break;
      }

      // Calculate estimated duration based on number of VMs and complexity
      const baseHoursPerVM = complexity === 'Simple' ? 2 : complexity === 'Moderate' ? 4 : 8;
      const totalHours = categoryVMs.length * baseHoursPerVM;
      const days = Math.ceil(totalHours / 8);
      const estimatedDuration = `${days} day${days > 1 ? 's' : ''}`;

      phaseRecommendations.push(`Total VMs: ${categoryVMs.length}`);
      phaseRecommendations.push(`Estimated effort: ${totalHours} hours`);

      const phase: RecommendedPhase = {
        id: `rec-phase-${phaseCounter}`,
        name: `${region} - Category ${category} Migration`,
        priority,
        reason,
        vms: categoryVMs,
        region,
        category,
        estimatedDuration,
        complexity,
        recommendations: phaseRecommendations
      };

      recommendedPhases.push(phase);
      phaseCounter++;
    });
  });

  // Sort recommendations by priority and complexity
  const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
  const complexityOrder = { 'Simple': 3, 'Moderate': 2, 'Complex': 1 };
  
  return recommendedPhases.sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return complexityOrder[b.complexity] - complexityOrder[a.complexity];
  });
}

export function getPhaseRecommendationSummary(vms: VM[]): {
  totalPhases: number;
  recommendedOrder: string[];
  keyInsights: string[];
} {
  const phases = generateRecommendedPhases(vms);
  
  return {
    totalPhases: phases.length,
    recommendedOrder: phases.map((p, i) => `${i + 1}. ${p.name} (${p.priority} Priority)`),
    keyInsights: [
      `Total VMs to migrate: ${vms.length}`,
      `Recommended to start with ${phases.filter(p => p.category === 'C1').length} C1 phases (Direct Migration)`,
      `${phases.filter(p => p.complexity === 'Complex').length} complex phases identified - schedule these last`,
      `Estimated total duration: ${phases.reduce((sum, p) => {
        const days = parseInt(p.estimatedDuration);
        return sum + (isNaN(days) ? 0 : days);
      }, 0)} days if executed sequentially`
    ]
  };
}