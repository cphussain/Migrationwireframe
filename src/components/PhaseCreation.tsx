import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Calendar, Plus, ChevronRight, X, Filter, Search, Play, Sparkles, ArrowRight, ArrowLeft, FileCheck, Clock, CalendarCheck, Settings, CheckCircle2 } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MigrationProgress } from './MigrationProgress';
import { SmartRecommendations } from './SmartRecommendations';
import { PhaseCapacityIndicator } from './PhaseCapacityIndicator';
import { ReadinessCheckDialog } from './ReadinessCheckDialog';
import { type RecommendedPhase } from '../services/migrationRecommendations';

interface UserSession {
  username: string;
  role: string;
  region?: string;
}

interface PhaseCreationProps {
  userSession: UserSession;
}

interface Phase {
  id: string;
  name: string;
  region: string;
  category: string;
  changeRequest: string;
  crStatus: 'Access' | 'Scheduled' | 'Implementation' | 'Closed';
  vmCount: number;
  createdDate: string;
  assignedTo: string;
  status: 'planned' | 'migrating' | 'completed';
}

interface VM {
  name: string;
  serviceName: string;
  region: string;
  country?: string;
  datacenter?: string;
  category: string;
  tier?: 'Tier-1' | 'Tier-2' | 'Tier-3';
  cpu?: number;
  memory?: number;
  storage?: number;
  os?: 'Windows' | 'Linux';
}

const ItemType = 'VM';

// Drop Zone Component
function DropZone({ children, onDrop }: { children: React.ReactNode; onDrop: (vm: VM) => void }) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item: { vm: VM }) => {
      onDrop(item.vm);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`border-2 border-dashed rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto ${
        isOver ? 'border-[#DB0011] bg-[#FEF0F1]' : 'border-slate-300 bg-slate-50'
      }`}
    >
      {children}
    </div>
  );
}

// Generate VM data with country, datacenter, tier, and capacity
const generateAvailableVMs = () => {
  const vms: VM[] = [];
  const regionsData = [
    { region: 'US-East', country: 'United States', datacenters: ['US-EAST-DC01', 'US-EAST-DC02'] },
    { region: 'US-West', country: 'United States', datacenters: ['US-WEST-DC01', 'US-WEST-DC02'] },
    { region: 'EU-Central', country: 'Germany', datacenters: ['FRANKFURT-DC01', 'FRANKFURT-DC02'] },
    { region: 'APAC', country: 'Hong Kong', datacenters: ['HK-CENTRAL-DC01', 'SINGAPORE-DC01'] },
  ];
  const categories = ['C1', 'C2'];
  const tiers: ('Tier-1' | 'Tier-2' | 'Tier-3')[] = ['Tier-1', 'Tier-2', 'Tier-3'];
  const services = [
    'Payment Gateway', 'Customer Portal', 'Trading Platform', 'Mobile Banking',
    'Core Banking', 'Analytics Service', 'Risk Management', 'Loan Processing',
    'ATM Network', 'Card Services', 'Wealth Management', 'Treasury System',
  ];

  for (let i = 1; i <= 150; i++) {
    const regionData = regionsData[Math.floor(Math.random() * regionsData.length)];
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    
    // Assign CPU, Memory, Storage based on tier
    let cpu, memory, storage;
    if (tier === 'Tier-1') {
      cpu = Math.floor(Math.random() * 4) + 8; // 8-12 cores
      memory = Math.floor(Math.random() * 32) + 32; // 32-64 GB
      storage = Math.floor(Math.random() * 500) + 500; // 500-1000 GB
    } else if (tier === 'Tier-2') {
      cpu = Math.floor(Math.random() * 2) + 4; // 4-6 cores
      memory = Math.floor(Math.random() * 16) + 16; // 16-32 GB
      storage = Math.floor(Math.random() * 250) + 250; // 250-500 GB
    } else {
      cpu = Math.floor(Math.random() * 2) + 2; // 2-4 cores
      memory = Math.floor(Math.random() * 8) + 8; // 8-16 GB
      storage = Math.floor(Math.random() * 150) + 100; // 100-250 GB
    }

    vms.push({
      name: `VM-${String(i).padStart(6, '0')}`,
      serviceName: services[Math.floor(Math.random() * services.length)],
      region: regionData.region,
      country: regionData.country,
      datacenter: regionData.datacenters[Math.floor(Math.random() * regionData.datacenters.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      tier: tier,
      cpu: cpu,
      memory: memory,
      storage: storage,
      os: Math.random() < 0.5 ? 'Windows' : 'Linux'
    });
  }
  return vms;
};

export function PhaseCreation({ userSession }: PhaseCreationProps) {
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: 'P001',
      name: 'Phase 1 - US East C1 VMs',
      region: 'US-East',
      category: 'C1',
      changeRequest: 'CHG0001234',
      crStatus: 'Access',
      vmCount: 5,
      createdDate: '2025-11-10',
      assignedTo: 'John Doe',
      status: 'planned'
    },
    {
      id: 'P002',
      name: 'Phase 2 - EU Central C2 VMs',
      region: 'EU-Central',
      category: 'C2',
      changeRequest: 'CHG0001235',
      crStatus: 'Scheduled',
      vmCount: 8,
      createdDate: '2025-11-12',
      assignedTo: 'Jane Smith',
      status: 'migrating'
    }
  ]);

  const [allVMs] = useState<VM[]>(generateAvailableVMs());
  const [showForm, setShowForm] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [phaseName, setPhaseName] = useState('');
  const [changeRequest, setChangeRequest] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [selectedVMs, setSelectedVMs] = useState<VM[]>([]);
  const [searchAvailable, setSearchAvailable] = useState('');

  // Multiselect state
  const [checkedAvailable, setCheckedAvailable] = useState<Set<string>>(new Set());
  const [checkedSelected, setCheckedSelected] = useState<Set<string>>(new Set());

  // Filters for existing phases
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterAssignedTo, setFilterAssignedTo] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [phaseSearchTerm, setPhaseSearchTerm] = useState('');

  // Migration and readiness state
  const [migrationPhase, setMigrationPhase] = useState<Phase | null>(null);
  const [showMigrationProgress, setShowMigrationProgress] = useState(false);
  const [readinessPhase, setReadinessPhase] = useState<Phase | null>(null);
  const [showReadinessCheck, setShowReadinessCheck] = useState(false);

  // Filter available VMs
  const availableVMs = useMemo(() => {
    return allVMs.filter(vm => {
      const matchesRegion = !selectedRegion || vm.region === selectedRegion;
      const matchesCategory = !selectedCategory || vm.category === selectedCategory;
      const notSelected = !selectedVMs.find(selected => selected.name === vm.name);
      const matchesSearch = !searchAvailable || 
        vm.name.toLowerCase().includes(searchAvailable.toLowerCase()) ||
        vm.serviceName.toLowerCase().includes(searchAvailable.toLowerCase());
      
      return matchesRegion && matchesCategory && notSelected && matchesSearch;
    });
  }, [allVMs, selectedRegion, selectedCategory, selectedVMs, searchAvailable]);

  const handleAddVM = (vm: VM) => {
    if (!selectedVMs.find(selected => selected.name === vm.name)) {
      setSelectedVMs([...selectedVMs, vm]);
      setCheckedAvailable(prev => {
        const newSet = new Set(prev);
        newSet.delete(vm.name);
        return newSet;
      });
    }
  };

  const handleRemoveVM = (vmName: string) => {
    setSelectedVMs(selectedVMs.filter(vm => vm.name !== vmName));
    setCheckedSelected(prev => {
      const newSet = new Set(prev);
      newSet.delete(vmName);
      return newSet;
    });
  };

  const handleAddChecked = () => {
    const vmsToAdd = availableVMs.filter(vm => checkedAvailable.has(vm.name));
    const newSelected = [...selectedVMs];
    vmsToAdd.forEach(vm => {
      if (!newSelected.find(selected => selected.name === vm.name)) {
        newSelected.push(vm);
      }
    });
    setSelectedVMs(newSelected);
    setCheckedAvailable(new Set());
  };

  const handleRemoveChecked = () => {
    const vmNamesToRemove = Array.from(checkedSelected);
    setSelectedVMs(selectedVMs.filter(vm => !vmNamesToRemove.includes(vm.name)));
    setCheckedSelected(new Set());
  };

  const toggleAvailableCheck = (vmName: string, checked: boolean) => {
    setCheckedAvailable(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(vmName);
      } else {
        newSet.delete(vmName);
      }
      return newSet;
    });
  };

  const toggleSelectedCheck = (vmName: string, checked: boolean) => {
    setCheckedSelected(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(vmName);
      } else {
        newSet.delete(vmName);
      }
      return newSet;
    });
  };

  const handleSelectAllAvailable = () => {
    const visibleVMs = availableVMs.slice(0, 20);
    setCheckedAvailable(new Set(visibleVMs.map(vm => vm.name)));
  };

  const handleDeselectAllAvailable = () => {
    setCheckedAvailable(new Set());
  };

  const handleSelectAllSelected = () => {
    setCheckedSelected(new Set(selectedVMs.map(vm => vm.name)));
  };

  const handleDeselectAllSelected = () => {
    setCheckedSelected(new Set());
  };

  const handleCreatePhase = () => {
    if (!phaseName || !changeRequest || !assignedTo || selectedVMs.length === 0) {
      alert('Please fill all fields and select at least one VM');
      return;
    }

    const newPhase: Phase = {
      id: `P${String(phases.length + 1).padStart(3, '0')}`,
      name: phaseName,
      region: selectedRegion,
      category: selectedCategory,
      changeRequest,
      crStatus: 'Access',
      vmCount: selectedVMs.length,
      createdDate: new Date().toISOString().split('T')[0],
      assignedTo,
      status: 'planned'
    };

    setPhases([...phases, newPhase]);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setPhaseName('');
    setSelectedRegion('');
    setSelectedCategory('');
    setChangeRequest('');
    setAssignedTo('');
    setSelectedVMs([]);
    setSearchAvailable('');
  };

  // Get unique values for phase filters
  const uniqueAssignees = useMemo(() => {
    const assignees = new Set(phases.map(p => p.assignedTo));
    return Array.from(assignees).sort();
  }, [phases]);

  const uniquePhaseRegions = useMemo(() => {
    const regions = new Set(phases.map(p => p.region));
    return Array.from(regions).sort();
  }, [phases]);

  // Filter existing phases
  const filteredPhases = useMemo(() => {
    return phases.filter(phase => {
      const matchesRegion = filterRegion === 'all' || phase.region === filterRegion;
      const matchesAssignedTo = filterAssignedTo === 'all' || phase.assignedTo === filterAssignedTo;
      const matchesSearch = phaseSearchTerm === '' || 
        phase.name.toLowerCase().includes(phaseSearchTerm.toLowerCase()) ||
        phase.id.toLowerCase().includes(phaseSearchTerm.toLowerCase());
      
      let matchesDate = true;
      if (filterDateFrom && filterDateTo) {
        const phaseDate = new Date(phase.createdDate);
        const fromDate = new Date(filterDateFrom);
        const toDate = new Date(filterDateTo);
        matchesDate = phaseDate >= fromDate && phaseDate <= toDate;
      } else if (filterDateFrom) {
        const phaseDate = new Date(phase.createdDate);
        const fromDate = new Date(filterDateFrom);
        matchesDate = phaseDate >= fromDate;
      } else if (filterDateTo) {
        const phaseDate = new Date(phase.createdDate);
        const toDate = new Date(filterDateTo);
        matchesDate = phaseDate <= toDate;
      }

      return matchesRegion && matchesAssignedTo && matchesSearch && matchesDate;
    });
  }, [phases, filterRegion, filterAssignedTo, phaseSearchTerm, filterDateFrom, filterDateTo]);

  const clearPhaseFilters = () => {
    setFilterRegion('all');
    setFilterAssignedTo('all');
    setFilterDateFrom('');
    setFilterDateTo('');
    setPhaseSearchTerm('');
  };

  const hasActivePhaseFilters = filterRegion !== 'all' || filterAssignedTo !== 'all' || 
                                 phaseSearchTerm !== '' || filterDateFrom !== '' || filterDateTo !== '';

  const handleStartMigration = (phase: Phase) => {
    setMigrationPhase(phase);
    setShowMigrationProgress(true);
    setPhases(phases.map(p => 
      p.id === phase.id ? { ...p, status: 'migrating' as const } : p
    ));
  };

  const handleCheckReadiness = (phase: Phase) => {
    setReadinessPhase(phase);
    setShowReadinessCheck(true);
  };

  const handleMigrationComplete = () => {
    if (migrationPhase) {
      setPhases(phases.map(p => 
        p.id === migrationPhase.id ? { ...p, status: 'completed' as const } : p
      ));
    }
    setShowMigrationProgress(false);
    setMigrationPhase(null);
  };

  const canStartMigration = userSession.role === 'Administrator' || userSession.role === 'Migration Engineer';

  const handleUseRecommendation = (recPhase: RecommendedPhase) => {
    setPhaseName(recPhase.name);
    setSelectedRegion(recPhase.region);
    setSelectedCategory(recPhase.category);
    setChangeRequest(`CHG${String(Math.floor(Math.random() * 1000000)).padStart(7, '0')}`);
    setAssignedTo(userSession.username);
    setSelectedVMs(recPhase.vms);
    setShowForm(true);
  };

  const getCRStatusBadge = (crStatus: string) => {
    switch (crStatus) {
      case 'Access':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 w-fit">
            <Clock className="size-3" />
            Access
          </Badge>
        );
      case 'Scheduled':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1 w-fit">
            <CalendarCheck className="size-3" />
            Scheduled
          </Badge>
        );
      case 'Implementation':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1 w-fit">
            <Settings className="size-3" />
            Implementation
          </Badge>
        );
      case 'Closed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 w-fit">
            <CheckCircle2 className="size-3" />
            Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">{crStatus}</Badge>;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Tabs defaultValue="phases" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="phases">Manual Phase Creation</TabsTrigger>
          <TabsTrigger value="smart" className="flex items-center gap-2">
            <Sparkles className="size-4" />
            Smart Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#DB0011]">Create Migration Phase</CardTitle>
                  <CardDescription className="text-slate-600">
                    Select region and category to shortlist VMs and create a migration phase
                  </CardDescription>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="bg-[#DB0011] hover:bg-[#A50010]">
                  <Plus className="size-4 mr-2" />
                  New Phase
                </Button>
              </div>
            </CardHeader>
            {showForm && (
              <CardContent className="space-y-6 border-t pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phase-name">Phase Name</Label>
                    <Input
                      id="phase-name"
                      placeholder="e.g., Phase 3 - APAC Migration"
                      value={phaseName}
                      onChange={(e) => setPhaseName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="change-request">Change Request ID</Label>
                    <Input
                      id="change-request"
                      placeholder="e.g., CHG0001236"
                      value={changeRequest}
                      onChange={(e) => setChangeRequest(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger id="region">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US-East">US-East</SelectItem>
                        <SelectItem value="US-West">US-West</SelectItem>
                        <SelectItem value="EU-Central">EU-Central</SelectItem>
                        <SelectItem value="APAC">APAC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="C1">C1 - Low Complexity</SelectItem>
                        <SelectItem value="C2">C2 - Medium Complexity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assigned-to">Assigned To</Label>
                    <Input
                      id="assigned-to"
                      placeholder="e.g., John Doe"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    />
                  </div>
                </div>

                {selectedRegion && selectedCategory && (
                  <div className="space-y-4">
                    <Label>Select VMs for Migration Phase</Label>

                    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
                      {/* Available VMs */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Label>Available VMs ({availableVMs.length})</Label>
                            {checkedAvailable.size > 0 && (
                              <Badge variant="outline" className="bg-[#DB0011] text-white border-[#DB0011]">
                                {checkedAvailable.size} selected
                              </Badge>
                            )}
                          </div>
                          <Input
                            placeholder="Search..."
                            value={searchAvailable}
                            onChange={(e) => setSearchAvailable(e.target.value)}
                            className="w-48 h-8"
                          />
                        </div>
                        {availableVMs.length > 0 && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleSelectAllAvailable}
                              className="text-xs text-[#DB0011] hover:bg-[#FEF0F1] h-7"
                            >
                              Select All
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleDeselectAllAvailable}
                              className="text-xs text-slate-600 hover:bg-slate-100 h-7"
                              disabled={checkedAvailable.size === 0}
                            >
                              Deselect All
                            </Button>
                          </div>
                        )}
                        <DropZone onDrop={handleRemoveVM}>
                          <div className="space-y-2">
                            {availableVMs.length === 0 ? (
                              <p className="text-center text-slate-500 py-8">
                                No VMs available with selected filters
                              </p>
                            ) : (
                              availableVMs.slice(0, 20).map((vm) => (
                                <div key={vm.name} className={`border rounded p-3 bg-white hover:shadow-md transition-shadow ${checkedAvailable.has(vm.name) ? 'ring-2 ring-[#DB0011]' : ''}`}>
                                  <div className="flex items-center gap-3">
                                    <Checkbox
                                      checked={checkedAvailable.has(vm.name)}
                                      onCheckedChange={(checked) => toggleAvailableCheck(vm.name, checked as boolean)}
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        {vm.os === 'Windows' ? (
                                          <svg className="size-4 flex-shrink-0" viewBox="0 0 88 88" fill="#00ADEF">
                                            <path d="M0 12.402l35.687-4.8602.0156 34.423-35.67.20313zm35.67 33.529.0277 34.453-35.67-4.9041-.002-29.78zm4.3261-39.025l47.318-6.906v41.527l-47.318.37565zm47.329 39.349-.0111 41.34-47.318-6.6784-.0663-34.739z"/>
                                          </svg>
                                        ) : (
                                          <svg className="size-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" fill="#FCC624"/>
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#000"/>
                                            <circle cx="9" cy="10" r="1" fill="#000"/>
                                            <circle cx="15" cy="10" r="1" fill="#000"/>
                                            <path d="M12 17c-2.21 0-4-1.79-4-4h8c0 2.21-1.79 4-4 4z" fill="#000"/>
                                          </svg>
                                        )}
                                        <span className="text-slate-900 text-sm">{vm.name}</span>
                                        {vm.tier && (
                                          <Badge variant="outline" className={`text-xs ${
                                            vm.tier === 'Tier-1' ? 'bg-red-50 text-red-700 border-red-200' :
                                            vm.tier === 'Tier-2' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                            'bg-green-50 text-green-700 border-green-200'
                                          }`}>
                                            {vm.tier}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-600 mt-1">{vm.serviceName}</p>
                                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                        <span>{vm.country}</span>
                                        <span>•</span>
                                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs py-0">
                                          {vm.datacenter}
                                        </Badge>
                                      </div>
                                      {vm.cpu && vm.memory && vm.storage && (
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                          <span>{vm.cpu} vCPU</span>
                                          <span>•</span>
                                          <span>{vm.memory} GB RAM</span>
                                          <span>•</span>
                                          <span>{vm.storage} GB</span>
                                        </div>
                                      )}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleAddVM(vm)}
                                      className="text-[#DB0011] hover:bg-[#FEF0F1] h-7 w-7 p-0"
                                    >
                                      <ChevronRight className="size-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            )}
                            {availableVMs.length > 20 && (
                              <p className="text-sm text-slate-500 text-center py-2">
                                Showing 20 of {availableVMs.length} VMs
                              </p>
                            )}
                          </div>
                        </DropZone>
                      </div>

                      {/* Arrow Buttons */}
                      <div className="flex flex-col gap-2 justify-center pt-12">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddChecked}
                          disabled={checkedAvailable.size === 0}
                          className="bg-[#DB0011] hover:bg-[#A50010] text-white border-[#DB0011] h-10 w-10 p-0"
                          title="Add selected VMs"
                        >
                          <ArrowRight className="size-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveChecked}
                          disabled={checkedSelected.size === 0}
                          className="border-slate-300 hover:bg-slate-100 h-10 w-10 p-0"
                          title="Remove selected VMs"
                        >
                          <ArrowLeft className="size-5" />
                        </Button>
                      </div>

                      {/* Selected VMs */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label>Selected VMs ({selectedVMs.length})</Label>
                          {checkedSelected.size > 0 && (
                            <Badge variant="outline" className="bg-red-600 text-white border-red-600">
                              {checkedSelected.size} selected
                            </Badge>
                          )}
                        </div>
                        {selectedVMs.length > 0 && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleSelectAllSelected}
                              className="text-xs text-[#DB0011] hover:bg-[#FEF0F1] h-7"
                            >
                              Select All
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleDeselectAllSelected}
                              className="text-xs text-slate-600 hover:bg-slate-100 h-7"
                              disabled={checkedSelected.size === 0}
                            >
                              Deselect All
                            </Button>
                          </div>
                        )}
                        <DropZone onDrop={handleAddVM}>
                          <div className="space-y-2">
                            {selectedVMs.length === 0 ? (
                              <p className="text-center text-slate-500 py-8">
                                Select VMs from available list
                              </p>
                            ) : (
                              selectedVMs.map((vm) => (
                                <div key={vm.name} className={`border rounded p-3 bg-green-50 ${checkedSelected.has(vm.name) ? 'ring-2 ring-red-600' : ''}`}>
                                  <div className="flex items-center gap-3">
                                    <Checkbox
                                      checked={checkedSelected.has(vm.name)}
                                      onCheckedChange={(checked) => toggleSelectedCheck(vm.name, checked as boolean)}
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        {vm.os === 'Windows' ? (
                                          <svg className="size-4 flex-shrink-0" viewBox="0 0 88 88" fill="#00ADEF">
                                            <path d="M0 12.402l35.687-4.8602.0156 34.423-35.67.20313zm35.67 33.529.0277 34.453-35.67-4.9041-.002-29.78zm4.3261-39.025l47.318-6.906v41.527l-47.318.37565zm47.329 39.349-.0111 41.34-47.318-6.6784-.0663-34.739z"/>
                                          </svg>
                                        ) : (
                                          <svg className="size-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" fill="#FCC624"/>
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#000"/>
                                            <circle cx="9" cy="10" r="1" fill="#000"/>
                                            <circle cx="15" cy="10" r="1" fill="#000"/>
                                            <path d="M12 17c-2.21 0-4-1.79-4-4h8c0 2.21-1.79 4-4 4z" fill="#000"/>
                                          </svg>
                                        )}
                                        <span className="text-slate-900 text-sm">{vm.name}</span>
                                        {vm.tier && (
                                          <Badge variant="outline" className={`text-xs ${
                                            vm.tier === 'Tier-1' ? 'bg-red-50 text-red-700 border-red-200' :
                                            vm.tier === 'Tier-2' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                            'bg-green-50 text-green-700 border-green-200'
                                          }`}>
                                            {vm.tier}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-600 mt-1">{vm.serviceName}</p>
                                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                        <span>{vm.country}</span>
                                        <span>•</span>
                                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs py-0">
                                          {vm.datacenter}
                                        </Badge>
                                      </div>
                                      {vm.cpu && vm.memory && vm.storage && (
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                          <span>{vm.cpu} vCPU</span>
                                          <span>•</span>
                                          <span>{vm.memory} GB RAM</span>
                                          <span>•</span>
                                          <span>{vm.storage} GB</span>
                                        </div>
                                      )}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleRemoveVM(vm.name)}
                                      className="text-red-600 hover:bg-red-50 h-7 w-7 p-0"
                                    >
                                      <X className="size-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </DropZone>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRegion && selectedVMs.length > 0 && (
                  <PhaseCapacityIndicator region={selectedRegion} vmCount={selectedVMs.length} />
                )}

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreatePhase} className="bg-[#DB0011] hover:bg-[#A50010]">
                    <Calendar className="size-4 mr-2" />
                    Create Phase
                  </Button>
                  <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Existing Phases Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#DB0011]">Existing Migration Phases</CardTitle>
              <CardDescription className="text-slate-600">
                Search and filter migration phases ({filteredPhases.length} of {phases.length} phases)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="size-5 text-[#DB0011]" />
                  <span className="text-slate-900">Filter Phases</span>
                  {hasActivePhaseFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearPhaseFilters}
                      className="ml-auto text-[#DB0011] hover:bg-[#FEF0F1]"
                    >
                      <X className="size-4 mr-1" />
                      Clear Filters
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phase-search">Search Phase</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="phase-search"
                        placeholder="Phase name or ID..."
                        value={phaseSearchTerm}
                        onChange={(e) => setPhaseSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filter-region">Region</Label>
                    <Select value={filterRegion} onValueChange={setFilterRegion}>
                      <SelectTrigger id="filter-region">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        {uniquePhaseRegions.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filter-assigned">Assigned To</Label>
                    <Select value={filterAssignedTo} onValueChange={setFilterAssignedTo}>
                      <SelectTrigger id="filter-assigned">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Assignees</SelectItem>
                        {uniqueAssignees.map(assignee => (
                          <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filter-date-from">Date From</Label>
                    <Input
                      id="filter-date-from"
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filter-date-to">Date To</Label>
                    <Input
                      id="filter-date-to"
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#DB0011]">Phase ID</TableHead>
                      <TableHead className="text-[#DB0011]">Phase Name</TableHead>
                      <TableHead className="text-[#DB0011]">Region</TableHead>
                      <TableHead className="text-[#DB0011]">Category</TableHead>
                      <TableHead className="text-[#DB0011]">Change Request</TableHead>
                      <TableHead className="text-[#DB0011]">CR Status</TableHead>
                      <TableHead className="text-[#DB0011]">VMs</TableHead>
                      <TableHead className="text-[#DB0011]">Assigned To</TableHead>
                      <TableHead className="text-[#DB0011]">Created</TableHead>
                      <TableHead className="text-[#DB0011]">Status</TableHead>
                      {canStartMigration && <TableHead className="text-[#DB0011]">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPhases.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={canStartMigration ? 11 : 10} className="text-center text-slate-500 py-8">
                          No phases found matching the filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPhases.map((phase) => (
                        <TableRow key={phase.id}>
                          <TableCell className="text-slate-900">{phase.id}</TableCell>
                          <TableCell className="text-slate-900">{phase.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {phase.region}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-slate-700">{phase.category}</Badge>
                          </TableCell>
                          <TableCell className="text-[#DB0011]">{phase.changeRequest}</TableCell>
                          <TableCell className="text-[#DB0011]">
                            {getCRStatusBadge(phase.crStatus)}
                          </TableCell>
                          <TableCell className="text-slate-700">{phase.vmCount}</TableCell>
                          <TableCell className="text-slate-700">{phase.assignedTo}</TableCell>
                          <TableCell className="text-slate-600">{phase.createdDate}</TableCell>
                          <TableCell className="text-slate-700">
                            <Badge
                              variant="outline"
                              className={
                                phase.status === 'planned' ? 'bg-gray-50 text-gray-700' :
                                phase.status === 'migrating' ? 'bg-yellow-50 text-yellow-700' :
                                'bg-green-50 text-green-700'
                              }
                            >
                              {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                            </Badge>
                          </TableCell>
                          {canStartMigration && (
                            <TableCell>
                              {phase.status === 'planned' && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCheckReadiness(phase)}
                                    className="text-blue-700 border-blue-300 hover:bg-blue-50"
                                  >
                                    <FileCheck className="size-4 mr-2" />
                                    Check Readiness
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleStartMigration(phase)}
                                    className="bg-[#DB0011] hover:bg-[#A50010]"
                                  >
                                    <Play className="size-4 mr-2" />
                                    Start Migration
                                  </Button>
                                </div>
                              )}
                              {phase.status === 'migrating' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setMigrationPhase(phase);
                                    setShowMigrationProgress(true);
                                  }}
                                  className="text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                                >
                                  View Progress
                                </Button>
                              )}
                              {phase.status === 'completed' && (
                                <Badge variant="outline" className="bg-green-100 text-green-700">
                                  Completed
                                </Badge>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smart" className="space-y-6">
          <SmartRecommendations onAcceptPhase={handleUseRecommendation} />
        </TabsContent>
      </Tabs>

      {migrationPhase && (
        <MigrationProgress
          phaseName={migrationPhase.name}
          vmCount={migrationPhase.vmCount}
          isOpen={showMigrationProgress}
          onClose={handleMigrationComplete}
        />
      )}

      {readinessPhase && (
        <ReadinessCheckDialog
          phaseName={readinessPhase.name}
          vmCount={readinessPhase.vmCount}
          isOpen={showReadinessCheck}
          onClose={() => setShowReadinessCheck(false)}
        />
      )}
    </DndProvider>
  );
}
