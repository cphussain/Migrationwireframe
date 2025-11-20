import { useState, useEffect } from 'react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface MigrationProgressProps {
  phaseName: string;
  vmCount: number;
  vmNames?: string[];
  isOpen: boolean;
  onClose: () => void;
}

interface VMStatus {
  name: string;
  status: 'pending' | 'migrating' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
}

const migrationSteps = [
  { id: 1, name: 'Pre-Migration Validation', description: 'Validating VM configurations and compatibility' },
  { id: 2, name: 'Source VM Preparation', description: 'Installing migration tools on source VMs' },
  { id: 3, name: 'Network Configuration', description: 'Setting up network mappings and security' },
  { id: 4, name: 'Storage Migration', description: 'Transferring VM disks to OpenShift' },
  { id: 5, name: 'VM Conversion', description: 'Converting VMware VMs to containerized workloads' },
  { id: 6, name: 'Post-Migration Testing', description: 'Validating migrated VMs functionality' },
  { id: 7, name: 'Cutover & Verification', description: 'Final cutover and connectivity checks' }
];

export function MigrationProgress({ phaseName, vmCount, vmNames, isOpen, onClose }: MigrationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [vmStatuses, setVMStatuses] = useState<VMStatus[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [completionTime, setCompletionTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setOverallProgress(0);
      setIsCompleted(false);
      setVMStatuses([]);
      setStartTime(null);
      setCompletionTime(null);
      return;
    }

    // Set start time when migration begins
    setStartTime(new Date());

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < migrationSteps.length) {
          return prev + 1;
        } else {
          setIsCompleted(true);
          if (!completionTime) {
            setCompletionTime(new Date());
          }
          clearInterval(interval);
          return prev;
        }
      });

      setOverallProgress(prev => {
        const newProgress = Math.min(prev + (100 / migrationSteps.length), 100);
        if (newProgress >= 100) {
          setIsCompleted(true);
          if (!completionTime) {
            setCompletionTime(new Date());
          }
        }
        return newProgress;
      });
    }, 3000); // Each step takes 3 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'in-progress';
    return 'pending';
  };

  // Count completed VMs
  const completedVMs = vmStatuses.filter(vm => vm.status === 'completed').length;
  const migratingVMs = vmStatuses.filter(vm => vm.status === 'migrating').length;
  const pendingVMs = vmStatuses.filter(vm => vm.status === 'pending').length;

  // Initialize VM statuses when dialog opens
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (vmNames && vmNames.length > 0) {
      setVMStatuses(vmNames.map(name => ({
        name,
        status: 'pending' as const,
        progress: 0,
        currentStep: 'Waiting to start...'
      })));
    } else {
      // Generate mock VM names if not provided
      const mockVMNames = Array.from({ length: vmCount }, (_, i) => `GB${String(i + 1).padStart(5, '0')}`);
      setVMStatuses(mockVMNames.map(name => ({
        name,
        status: 'pending' as const,
        progress: 0,
        currentStep: 'Waiting to start...'
      })));
    }
  }, [isOpen, vmNames, vmCount]);

  // Update VM statuses based on overall progress
  useEffect(() => {
    if (!isOpen || vmStatuses.length === 0) return;

    const interval = setInterval(() => {
      setVMStatuses(prevStatuses => {
        return prevStatuses.map((vm, index) => {
          // If overall migration is complete, mark all VMs as complete
          if (isCompleted || overallProgress >= 100) {
            return {
              ...vm,
              status: 'completed' as const,
              progress: 100,
              currentStep: 'Migration Complete'
            };
          }

          // Stagger VM migrations - start each VM at different times
          const vmStartDelay = index * 2; // Each VM starts 2 seconds after the previous one
          const elapsedTime = (currentStep * 3); // Use currentStep directly for more accurate timing
          
          if (elapsedTime < vmStartDelay) {
            return vm; // VM hasn't started yet
          }

          // Calculate VM progress based on elapsed time
          const vmElapsedTime = elapsedTime - vmStartDelay;
          const totalDuration = 21; // 7 steps * 3 seconds
          const vmProgress = Math.min((vmElapsedTime / totalDuration) * 100, 100);

          // Determine VM status
          let status: 'pending' | 'migrating' | 'completed' | 'failed' = 'migrating';
          if (vmProgress >= 100) {
            status = 'completed';
          } else if (vmProgress === 0) {
            status = 'pending';
          }

          // Determine current step based on progress
          const stepIndex = Math.min(Math.floor(vmProgress / (100 / migrationSteps.length)), migrationSteps.length - 1);
          const currentStepName = status === 'completed' ? 'Migration Complete' : migrationSteps[stepIndex]?.name || 'Preparing...';

          return {
            ...vm,
            status,
            progress: vmProgress,
            currentStep: currentStepName
          };
        });
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isOpen, currentStep, overallProgress, isCompleted, vmStatuses.length]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-[#DB0011] text-2xl">
            MTV Migration in Progress
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-base">
            Phase: {phaseName} • {vmCount} VMs being migrated using Migration Toolkit for Virtualization
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 w-full">{/* Overall Progress */}
          <div className="space-y-3 mb-6 p-4 bg-slate-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <span className="text-slate-900 text-lg">Overall Migration Progress - Step {currentStep}/{migrationSteps.length}</span>
              <span className="text-slate-600 text-lg">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-4" />
            {isCompleted && (
              <div className="flex items-center gap-2 text-green-600 mt-3">
                <CheckCircle2 className="size-6" />
                <span className="text-base">Migration completed successfully! All {migrationSteps.length} steps completed.</span>
              </div>
            )}
          </div>

          {/* VM Status Details - Full Width */}
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 text-xl">VM Migration Status ({completedVMs}/{vmStatuses.length} Completed)</h3>
              {startTime && (
                <div className="text-sm text-slate-600">
                  <span>Started: {startTime.toLocaleTimeString()}</span>
                  {completionTime && (
                    <span className="ml-4">Completed: {completionTime.toLocaleTimeString()}</span>
                  )}
                </div>
              )}
            </div>

            {/* VM Details Table */}
            {vmStatuses.length > 0 && (
              <div className="border rounded-lg overflow-hidden w-full">
                <div className="max-h-[calc(90vh-320px)] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        <TableHead className="w-[120px]">VM Name</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="w-[240px]">Progress</TableHead>
                        <TableHead>Current Step</TableHead>
                        <TableHead className="w-[100px]">Logs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vmStatuses.map(vm => (
                        <TableRow key={vm.name}>
                          <TableCell>{vm.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                vm.status === 'completed'
                                  ? 'bg-green-100 text-green-800 text-xs px-2 py-0.5'
                                  : vm.status === 'migrating'
                                  ? 'bg-blue-100 text-blue-800 text-xs px-2 py-0.5'
                                  : vm.status === 'failed'
                                  ? 'bg-red-100 text-red-800 text-xs px-2 py-0.5'
                                  : 'bg-slate-100 text-slate-600 text-xs px-2 py-0.5'
                              }
                            >
                              {vm.status === 'completed' ? 'Completed' : vm.status === 'migrating' ? 'Migrating' : vm.status === 'failed' ? 'Failed' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={vm.progress} className="h-2 flex-1" />
                              <span className="text-xs text-slate-600 w-10 text-right">{Math.round(vm.progress)}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">{vm.currentStep}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 text-[#DB0011] hover:text-[#DB0011] hover:bg-red-50 h-8 px-2"
                              onClick={() => window.open(`https://splunk.hsbc.com/app/search/mioa_vm_logs?vm=${vm.name}`, '_blank')}
                            >
                              <ExternalLink className="size-3" />
                              <span className="text-xs">Logs</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          {/* VM Logs and Metrics - Only show after migration completes */}
          {isCompleted && (
            <div className="mt-6 space-y-4">
              <h3 className="text-slate-900 text-xl">VM Logs and Metrics</h3>
              <div className="grid grid-cols-1 gap-4">
                {/* Migration Summary */}
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h4 className="text-slate-900 text-base mb-3">Migration Summary</h4>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Total VMs Migrated:</span>
                      <span className="text-slate-900 ml-2">{completedVMs}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Migration Tool:</span>
                      <span className="text-slate-900 ml-2">MTV</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Migration Type:</span>
                      <span className="text-slate-900 ml-2">Cold Migration</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Target Platform:</span>
                      <span className="text-slate-900 ml-2">OpenShift Virtualization</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Logs Access */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-slate-900 text-base mb-2">Access Detailed Logs & Metrics</h4>
                      <p className="text-sm text-slate-600 mb-3">
                        View comprehensive migration logs, performance metrics, and troubleshooting information in Splunk.
                      </p>
                      <ul className="text-sm text-slate-600 space-y-1 mb-3">
                        <li>• Real-time migration logs for all VMs</li>
                        <li>• Performance metrics and resource utilization</li>
                        <li>• Error logs and troubleshooting data</li>
                        <li>• Migration duration and network transfer statistics</li>
                      </ul>
                    </div>
                    <Button
                      className="gap-2 bg-[#DB0011] hover:bg-[#B00010] text-white"
                      onClick={() => window.open('https://splunk.hsbc.com/app/search/mioa_migration_dashboard', '_blank')}
                    >
                      <ExternalLink className="size-4" />
                      Open Splunk Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}