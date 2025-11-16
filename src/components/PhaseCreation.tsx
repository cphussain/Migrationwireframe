import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Calendar, Plus, ChevronRight, ChevronLeft, X, Filter, Search } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Phase {
  id: string;
  name: string;
  region: string;
  category: string;
  changeRequest: string;
  vmCount: number;
  createdDate: string;
  assignedTo: string;
}

interface VM {
  name: string;
  serviceName: string;
  region: string;
  category: string;
}

const ItemType = 'VM';

// Draggable VM Item Component
function DraggableVMItem({ vm, onSelect }: { vm: VM; onSelect: () => void }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { vm },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`border rounded p-3 bg-white cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-900">{vm.name}</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              {vm.region}
            </Badge>
          </div>
          <p className="text-sm text-slate-600 mt-1">{vm.serviceName}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onSelect}
          className="text-[#DB0011] hover:bg-[#FEF0F1]"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// Selected VM Item Component
function SelectedVMItem({ vm, onRemove }: { vm: VM; onRemove: () => void }) {
  return (
    <div className="border rounded p-3 bg-green-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-900">{vm.name}</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              {vm.region}
            </Badge>
          </div>
          <p className="text-sm text-slate-600 mt-1">{vm.serviceName}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRemove}
          className="text-red-600 hover:bg-red-50"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}

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

// Generate more realistic VM data
const generateAvailableVMs = () => {
  const vms: VM[] = [];
  const regions = ['US-East', 'US-West', 'EU-Central', 'APAC'];
  const categories = ['C1', 'C2'];
  const services = [
    'Payment Gateway', 'Customer Portal', 'Trading Platform', 'Mobile Banking',
    'Core Banking', 'Analytics Service', 'Risk Management', 'Loan Processing',
    'ATM Network', 'Card Services', 'Wealth Management', 'Treasury System',
  ];

  for (let i = 1; i <= 150; i++) {
    vms.push({
      name: `VM-${String(i).padStart(6, '0')}`,
      serviceName: services[Math.floor(Math.random() * services.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
    });
  }
  return vms;
};

export function PhaseCreation() {
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: 'P001',
      name: 'Phase 1 - US East C1 VMs',
      region: 'US-East',
      category: 'C1',
      changeRequest: 'CHG0001234',
      vmCount: 5,
      createdDate: '2025-11-10',
      assignedTo: 'John Doe'
    },
    {
      id: 'P002',
      name: 'Phase 2 - EU Central C2 VMs',
      region: 'EU-Central',
      category: 'C2',
      changeRequest: 'CHG0001235',
      vmCount: 8,
      createdDate: '2025-11-12',
      assignedTo: 'Jane Smith'
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

  // Filters for existing phases
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterAssignedTo, setFilterAssignedTo] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [phaseSearchTerm, setPhaseSearchTerm] = useState('');

  // Filter available VMs based on region and category
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
    }
  };

  const handleRemoveVM = (vmName: string) => {
    setSelectedVMs(selectedVMs.filter(vm => vm.name !== vmName));
  };

  const handleAddAll = () => {
    const toAdd = availableVMs.slice(0, 50); // Limit to 50 at a time
    const newSelected = [...selectedVMs];
    toAdd.forEach(vm => {
      if (!newSelected.find(selected => selected.name === vm.name)) {
        newSelected.push(vm);
      }
    });
    setSelectedVMs(newSelected);
  };

  const handleRemoveAll = () => {
    setSelectedVMs([]);
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
      vmCount: selectedVMs.length,
      createdDate: new Date().toISOString().split('T')[0],
      assignedTo
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
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
              {/* Phase Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phase-name" className="text-slate-900">Phase Name</Label>
                  <Input
                    id="phase-name"
                    placeholder="e.g., Phase 3 - APAC Migration"
                    value={phaseName}
                    onChange={(e) => setPhaseName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="change-request" className="text-slate-900">Change Request ID</Label>
                  <Input
                    id="change-request"
                    placeholder="e.g., CHG0001236"
                    value={changeRequest}
                    onChange={(e) => setChangeRequest(e.target.value)}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-slate-900">Region</Label>
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
                  <Label htmlFor="category" className="text-slate-900">Category</Label>
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
                  <Label htmlFor="assigned-to" className="text-slate-900">Assigned To</Label>
                  <Input
                    id="assigned-to"
                    placeholder="e.g., John Doe"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  />
                </div>
              </div>

              {/* VM Selection Grid */}
              {selectedRegion && selectedCategory && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-900">Select VMs for Migration Phase</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddAll}
                        disabled={availableVMs.length === 0}
                      >
                        Add First 50
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveAll}
                        disabled={selectedVMs.length === 0}
                      >
                        Remove All
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Available VMs */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-900">Available VMs ({availableVMs.length})</Label>
                        <Input
                          placeholder="Search..."
                          value={searchAvailable}
                          onChange={(e) => setSearchAvailable(e.target.value)}
                          className="w-48 h-8"
                        />
                      </div>
                      <DropZone onDrop={handleRemoveVM}>
                        <div className="space-y-2">
                          {availableVMs.length === 0 ? (
                            <p className="text-center text-slate-500 py-8">
                              No VMs available with selected filters
                            </p>
                          ) : (
                            availableVMs.slice(0, 20).map((vm) => (
                              <DraggableVMItem
                                key={vm.name}
                                vm={vm}
                                onSelect={() => handleAddVM(vm)}
                              />
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

                    {/* Selected VMs */}
                    <div className="space-y-3">
                      <Label className="text-slate-900">Selected VMs ({selectedVMs.length})</Label>
                      <DropZone onDrop={handleAddVM}>
                        <div className="space-y-2">
                          {selectedVMs.length === 0 ? (
                            <p className="text-center text-slate-500 py-8">
                              Drag VMs here or click the arrow to add
                            </p>
                          ) : (
                            selectedVMs.map((vm) => (
                              <SelectedVMItem
                                key={vm.name}
                                vm={vm}
                                onRemove={() => handleRemoveVM(vm.name)}
                              />
                            ))
                          )}
                        </div>
                      </DropZone>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
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
            {/* Phase Filters */}
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
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="phase-search" className="text-slate-900">Search Phase</Label>
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

                {/* Region Filter */}
                <div className="space-y-2">
                  <Label htmlFor="filter-region" className="text-slate-900">Region</Label>
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

                {/* Assigned To Filter */}
                <div className="space-y-2">
                  <Label htmlFor="filter-assigned" className="text-slate-900">Assigned To</Label>
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

                {/* Date From */}
                <div className="space-y-2">
                  <Label htmlFor="filter-date-from" className="text-slate-900">Date From</Label>
                  <Input
                    id="filter-date-from"
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                  />
                </div>

                {/* Date To */}
                <div className="space-y-2">
                  <Label htmlFor="filter-date-to" className="text-slate-900">Date To</Label>
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
                    <TableHead className="text-[#DB0011]">VMs</TableHead>
                    <TableHead className="text-[#DB0011]">Assigned To</TableHead>
                    <TableHead className="text-[#DB0011]">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPhases.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-slate-500 py-8">
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
                        <TableCell className="text-slate-700">{phase.vmCount}</TableCell>
                        <TableCell className="text-slate-700">{phase.assignedTo}</TableCell>
                        <TableCell className="text-slate-600">{phase.createdDate}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  );
}