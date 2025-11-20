import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Database,
  Wifi,
  MemoryStick,
  RefreshCw,
  Building2,
  Server,
  TrendingUp,
  Activity
} from 'lucide-react';
import { datacenters, uniqueCountries, type Datacenter, type OpenShiftCluster } from '../data/datacenters';

interface UserSession {
  username: string;
  role: string;
  region?: string;
}

interface CapacityProps {
  userSession: UserSession;
}

export function Capacity({ userSession }: CapacityProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Set default country and datacenter on mount
  const defaultCountry = uniqueCountries[0]?.code || '';
  const defaultDatacenter = defaultCountry 
    ? datacenters.find(dc => dc.countryCode === defaultCountry)?.locationName || ''
    : '';
  
  const [selectedCountry, setSelectedCountry] = useState<string>(defaultCountry);
  const [selectedDatacenter, setSelectedDatacenter] = useState<string>(defaultDatacenter);

  const calculateUtilization = (available: number, total: number) => {
    return Math.round(((total - available) / total) * 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-100 text-green-700 border-green-300">Operational</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Warning</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-300">Maintenance</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="size-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="size-5 text-yellow-600" />;
      case 'maintenance':
        return <XCircle className="size-5 text-orange-600" />;
      default:
        return <AlertTriangle className="size-5 text-slate-600" />;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdated(new Date());
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  // Calculate VM capacity based on resources (assuming 4 vCPU, 8GB RAM, 100GB storage per VM)
  const calculateVMCapacity = (compute: number, memory: number, storage: number) => {
    const byCompute = Math.floor(compute / 4);
    const byMemory = Math.floor(memory / 8);
    const byStorage = Math.floor((storage * 1024) / 100); // Convert TB to GB
    return Math.min(byCompute, byMemory, byStorage);
  };

  // Get datacenters for selected country
  const countryDatacenters = useMemo(() => {
    if (!selectedCountry) return [];
    return datacenters.filter(dc => dc.countryCode === selectedCountry);
  }, [selectedCountry]);

  // Get selected datacenter details
  const selectedDC = useMemo(() => {
    if (!selectedDatacenter) return null;
    return datacenters.find(dc => dc.locationName === selectedDatacenter);
  }, [selectedDatacenter]);

  // Calculate total capacity across all clusters in the datacenter
  const datacenterTotals = useMemo(() => {
    if (!selectedDC) return null;

    const totals = {
      compute: { available: 0, total: 0 },
      memory: { available: 0, total: 0 },
      storage: { available: 0, total: 0 },
      network: { available: 0, total: 0 },
      currentVMs: 0,
      maxCapacity: 0,
    };

    selectedDC.openShiftClusters.forEach(cluster => {
      totals.compute.available += cluster.compute.available;
      totals.compute.total += cluster.compute.total;
      totals.memory.available += cluster.memory.available;
      totals.memory.total += cluster.memory.total;
      totals.storage.available += cluster.storage.available;
      totals.storage.total += cluster.storage.total;
      totals.network.available += cluster.network.available;
      totals.network.total += cluster.network.total;
      totals.currentVMs += cluster.currentVMs;
      totals.maxCapacity += cluster.maxCapacity;
    });

    return totals;
  }, [selectedDC]);

  const availableVMCapacity = datacenterTotals 
    ? calculateVMCapacity(
        datacenterTotals.compute.available, 
        datacenterTotals.memory.available, 
        datacenterTotals.storage.available
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-[#DB0011] to-[#B00010] text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white mb-2">OpenShift Infrastructure Capacity</h2>
            <p className="text-white/90 text-sm">
              Datacenter and cluster-wise capacity with VM migration projections
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-white/80">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <RefreshCw className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Selection Dropdowns */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Country Selector */}
          <div className="space-y-2">
            <Label className="text-slate-900">Select Country</Label>
            <Select value={selectedCountry} onValueChange={(value) => {
              setSelectedCountry(value);
              setSelectedDatacenter('');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a country..." />
              </SelectTrigger>
              <SelectContent>
                {uniqueCountries.map((country) => {
                  const dcCount = datacenters.filter(dc => dc.countryCode === country.code).length;
                  return (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.code}) - {dcCount} DC{dcCount !== 1 ? 's' : ''}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Datacenter Selector */}
          <div className="space-y-2">
            <Label className="text-slate-900">Select Datacenter</Label>
            <Select 
              value={selectedDatacenter} 
              onValueChange={setSelectedDatacenter}
              disabled={!selectedCountry}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedCountry ? "Choose a datacenter..." : "Select country first"} />
              </SelectTrigger>
              <SelectContent>
                {countryDatacenters.map((dc) => (
                  <SelectItem key={dc.locationName} value={dc.locationName}>
                    {dc.locationName} - {dc.openShiftClusters.length} Cluster{dc.openShiftClusters.length !== 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Datacenter Details */}
      {selectedDC && datacenterTotals && (
        <div className="space-y-6">
          {/* Datacenter Overview */}
          <Card className="p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Building2 className="size-8 text-[#DB0011]" />
                <div>
                  <h3 className="text-slate-900">{selectedDC.locationName}</h3>
                  <p className="text-sm text-slate-600">
                    {selectedDC.country} • {selectedDC.openShiftClusters.length} OpenShift Cluster{selectedDC.openShiftClusters.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {getStatusBadge(selectedDC.status)}
            </div>

            {/* Migration Capacity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-white border-2 border-[#DB0011]">
                <div className="flex items-center justify-between mb-2">
                  <Server className="size-8 text-[#DB0011]" />
                  <TrendingUp className="size-5 text-green-600" />
                </div>
                <p className="text-sm text-slate-600 mb-1">Current VMs</p>
                <p className="text-2xl text-slate-900">{datacenterTotals.currentVMs}</p>
                <p className="text-xs text-slate-500 mt-1">of {datacenterTotals.maxCapacity} max</p>
              </Card>

              <Card className="p-4 bg-white border-2 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="size-8 text-green-600" />
                  <CheckCircle2 className="size-5 text-green-600" />
                </div>
                <p className="text-sm text-slate-600 mb-1">Available Slots</p>
                <p className="text-2xl text-green-600">{datacenterTotals.maxCapacity - datacenterTotals.currentVMs}</p>
                <p className="text-xs text-slate-500 mt-1">VMs can be added</p>
              </Card>

              <Card className="p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <Database className="size-8 text-blue-600" />
                  <CheckCircle2 className="size-5 text-blue-600" />
                </div>
                <p className="text-sm text-slate-600 mb-1">Total Storage</p>
                <p className="text-2xl text-slate-900">{datacenterTotals.storage.available.toFixed(1)} TB</p>
                <p className="text-xs text-slate-500 mt-1">of {datacenterTotals.storage.total.toFixed(1)} TB available</p>
              </Card>

              <Card className="p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="size-8 text-purple-600" />
                  <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                    {Math.round((datacenterTotals.currentVMs / datacenterTotals.maxCapacity) * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-1">Utilization</p>
                <Progress 
                  value={(datacenterTotals.currentVMs / datacenterTotals.maxCapacity) * 100} 
                  className="mt-2 h-3" 
                />
              </Card>
            </div>

            {/* Resource Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <Cpu className="size-6 text-[#DB0011]" />
                  {getStatusIcon('operational')}
                </div>
                <p className="text-sm text-slate-600 mb-1">Compute</p>
                <p className="text-slate-900">
                  {datacenterTotals.compute.available.toLocaleString()} / {datacenterTotals.compute.total.toLocaleString()} cores
                </p>
                <Progress 
                  value={calculateUtilization(datacenterTotals.compute.available, datacenterTotals.compute.total)} 
                  className="mt-2 h-2" 
                />
              </Card>

              <Card className="p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <MemoryStick className="size-6 text-[#DB0011]" />
                  {getStatusIcon('operational')}
                </div>
                <p className="text-sm text-slate-600 mb-1">Memory</p>
                <p className="text-slate-900">
                  {datacenterTotals.memory.available.toLocaleString()} / {datacenterTotals.memory.total.toLocaleString()} GB
                </p>
                <Progress 
                  value={calculateUtilization(datacenterTotals.memory.available, datacenterTotals.memory.total)} 
                  className="mt-2 h-2" 
                />
              </Card>

              <Card className="p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <Database className="size-6 text-[#DB0011]" />
                  {getStatusIcon('operational')}
                </div>
                <p className="text-sm text-slate-600 mb-1">Storage</p>
                <p className="text-slate-900">
                  {datacenterTotals.storage.available.toFixed(1)} / {datacenterTotals.storage.total.toFixed(1)} TB
                </p>
                <Progress 
                  value={calculateUtilization(datacenterTotals.storage.available, datacenterTotals.storage.total)} 
                  className="mt-2 h-2" 
                />
              </Card>

              <Card className="p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <Wifi className="size-6 text-[#DB0011]" />
                  {getStatusIcon('operational')}
                </div>
                <p className="text-sm text-slate-600 mb-1">Network</p>
                <p className="text-slate-900">
                  {datacenterTotals.network.available.toFixed(1)} / {datacenterTotals.network.total.toFixed(1)} Gbps
                </p>
                <Progress 
                  value={calculateUtilization(datacenterTotals.network.available, datacenterTotals.network.total)} 
                  className="mt-2 h-2" 
                />
              </Card>
            </div>
          </Card>

          {/* VM Migration Capacity Analysis */}
          <Card className="p-6">
            <h3 className="text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="size-5 text-[#DB0011]" />
              VM Migration Capacity Analysis
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Server className="size-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-slate-900 mb-2">
                    <strong>Can migrate approximately {availableVMCapacity} additional VMs</strong> based on current available resources
                  </p>
                  <p className="text-sm text-slate-600">
                    Calculation based on standard VM profile: 4 vCPUs, 8GB RAM, 100GB storage
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-slate-500">By Compute</p>
                      <p className="text-slate-900">{Math.floor(datacenterTotals.compute.available / 4)} VMs</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">By Memory</p>
                      <p className="text-slate-900">{Math.floor(datacenterTotals.memory.available / 8)} VMs</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">By Storage</p>
                      <p className="text-slate-900">{Math.floor((datacenterTotals.storage.available * 1024) / 100)} VMs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {availableVMCapacity < 20 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Low capacity warning: Consider provisioning additional resources before large-scale migrations
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* OpenShift Clusters Table */}
          <Card>
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <h3 className="text-slate-900 flex items-center gap-2">
                <Server className="size-5 text-[#DB0011]" />
                OpenShift Clusters - Detailed View
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Cluster-wise capacity breakdown and VM allocation
              </p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cluster Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Current VMs</TableHead>
                    <TableHead className="text-right">Max Capacity</TableHead>
                    <TableHead className="text-right">Available Slots</TableHead>
                    <TableHead className="text-right">Compute</TableHead>
                    <TableHead className="text-right">Memory</TableHead>
                    <TableHead className="text-right">Storage</TableHead>
                    <TableHead className="text-right">Network</TableHead>
                    <TableHead className="text-right">Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDC.openShiftClusters.map((cluster, index) => {
                    const utilization = (cluster.currentVMs / cluster.maxCapacity) * 100;
                    const availableSlots = cluster.maxCapacity - cluster.currentVMs;
                    const canMigrate = calculateVMCapacity(
                      cluster.compute.available,
                      cluster.memory.available,
                      cluster.storage.available
                    );

                    return (
                      <TableRow key={index}>
                        <TableCell className="text-slate-900">{cluster.name}</TableCell>
                        <TableCell>{getStatusBadge(cluster.status)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {cluster.currentVMs}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-slate-600">{cluster.maxCapacity}</TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant="outline" 
                            className={availableSlots > 20 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}
                          >
                            {availableSlots}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {cluster.compute.available} / {cluster.compute.total}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {cluster.memory.available} / {cluster.memory.total} GB
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {cluster.storage.available.toFixed(1)} / {cluster.storage.total.toFixed(1)} TB
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {cluster.network.available.toFixed(1)} / {cluster.network.total.toFixed(1)} Gbps
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress value={utilization} className="w-16 h-2" />
                            <span className="text-sm text-slate-600 w-12">{Math.round(utilization)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {/* No Selection State */}
      {!selectedDC && (
        <Card className="p-12 text-center">
          <Building2 className="size-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-600 mb-2">Select a Country and Datacenter</h3>
          <p className="text-sm text-slate-500">
            Choose a country and datacenter from the dropdowns above to view detailed capacity information
          </p>
        </Card>
      )}
    </div>
  );
}