import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Cpu, MemoryStick, Database, Wifi, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { datacentersByCountry } from '../data/datacenters';

interface PhaseCapacityIndicatorProps {
  region: string;
  vmCount: number;
}

export function PhaseCapacityIndicator({ region, vmCount }: PhaseCapacityIndicatorProps) {
  // Calculate estimated resources needed based on VM count
  // Assuming average VM needs: 4 vCPUs, 8GB RAM, 100GB storage, 1Gbps network
  const estimatedNeeds = {
    compute: vmCount * 4, // cores
    memory: vmCount * 8, // GB
    storage: Math.round((vmCount * 100) / 1024 * 10) / 10, // TB
    network: Math.round(vmCount * 0.1 * 10) / 10, // Gbps
  };

  // Get capacity from datacenters data
  const getRegionCapacity = (region: string) => {
    // Try to find country by code or name match
    const countryDatacenters = datacentersByCountry[region];
    
    if (!countryDatacenters || countryDatacenters.length === 0) {
      // Fallback to default values if country not found
      return {
        compute: { available: 2400, total: 3200 },
        memory: { available: 4800, total: 6400 },
        storage: { available: 180, total: 250 },
        network: { available: 80, total: 100 },
      };
    }

    // Aggregate all datacenters in this country
    return {
      compute: {
        available: countryDatacenters.reduce((sum, dc) => sum + dc.resources.compute.available, 0),
        total: countryDatacenters.reduce((sum, dc) => sum + dc.resources.compute.total, 0),
      },
      memory: {
        available: countryDatacenters.reduce((sum, dc) => sum + dc.resources.memory.available, 0),
        total: countryDatacenters.reduce((sum, dc) => sum + dc.resources.memory.total, 0),
      },
      storage: {
        available: countryDatacenters.reduce((sum, dc) => sum + dc.resources.storage.available, 0),
        total: countryDatacenters.reduce((sum, dc) => sum + dc.resources.storage.total, 0),
      },
      network: {
        available: countryDatacenters.reduce((sum, dc) => sum + dc.resources.network.available, 0),
        total: countryDatacenters.reduce((sum, dc) => sum + dc.resources.network.total, 0),
      },
    };
  };

  const capacity = region ? getRegionCapacity(region) : null;

  if (!capacity || vmCount === 0) {
    return null;
  }

  const getResourceStatus = (available: number, needed: number) => {
    const remaining = available - needed;
    if (remaining >= needed * 0.5) return 'ready'; // More than 50% headroom
    if (remaining >= 0) return 'warning'; // Some headroom
    return 'critical'; // Not enough
  };

  const resources = [
    {
      name: 'Compute',
      icon: Cpu,
      available: capacity.compute.available,
      total: capacity.compute.total,
      needed: estimatedNeeds.compute,
      unit: 'cores',
      status: getResourceStatus(capacity.compute.available, estimatedNeeds.compute),
    },
    {
      name: 'Memory',
      icon: MemoryStick,
      available: capacity.memory.available,
      total: capacity.memory.total,
      needed: estimatedNeeds.memory,
      unit: 'GB',
      status: getResourceStatus(capacity.memory.available, estimatedNeeds.memory),
    },
    {
      name: 'Storage',
      icon: Database,
      available: capacity.storage.available,
      total: capacity.storage.total,
      needed: estimatedNeeds.storage,
      unit: 'TB',
      status: getResourceStatus(capacity.storage.available, estimatedNeeds.storage),
    },
    {
      name: 'Network',
      icon: Wifi,
      available: capacity.network.available,
      total: capacity.network.total,
      needed: estimatedNeeds.network,
      unit: 'Gbps',
      status: getResourceStatus(capacity.network.available, estimatedNeeds.network),
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle2 className="size-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="size-4 text-yellow-600" />;
      case 'critical':
        return <XCircle className="size-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">Ready</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs">Limited</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-700 border-red-300 text-xs">Insufficient</Badge>;
      default:
        return null;
    }
  };

  const overallStatus = resources.every(r => r.status === 'ready') 
    ? 'ready' 
    : resources.some(r => r.status === 'critical') 
    ? 'critical' 
    : 'warning';

  return (
    <Card className={`p-4 ${overallStatus === 'critical' ? 'border-red-300 bg-red-50' : overallStatus === 'warning' ? 'border-yellow-300 bg-yellow-50' : 'border-green-300 bg-green-50'}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-slate-900 text-sm">Migration Readiness - {region}</h4>
          <p className="text-xs text-slate-600 mt-0.5">Estimated capacity for {vmCount} VMs</p>
        </div>
        {getStatusBadge(overallStatus)}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          const remaining = resource.available - resource.needed;
          const utilizationPercent = Math.round(((resource.total - resource.available) / resource.total) * 100);
          
          return (
            <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-[#DB0011]" />
                  <span className="text-xs text-slate-700">{resource.name}</span>
                </div>
                {getStatusIcon(resource.status)}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Available:</span>
                  <span className="text-slate-900">{resource.available} {resource.unit}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Needed:</span>
                  <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {resource.needed} {resource.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Remaining:</span>
                  <span className={remaining >= 0 ? 'text-slate-900' : 'text-red-600'}>
                    {remaining} {resource.unit}
                  </span>
                </div>
                <Progress 
                  value={utilizationPercent} 
                  className="h-1.5 mt-2" 
                />
              </div>
            </div>
          );
        })}
      </div>

      {overallStatus === 'critical' && (
        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-800">
          ⚠️ Insufficient capacity detected. Please reduce VM count or provision additional resources.
        </div>
      )}
      
      {overallStatus === 'warning' && (
        <div className="mt-3 p-2 bg-yellow-100 border border-yellow-200 rounded text-xs text-yellow-800">
          ⚠️ Limited capacity. Migration is possible but with minimal headroom.
        </div>
      )}

      {overallStatus === 'ready' && (
        <div className="mt-3 p-2 bg-green-100 border border-green-200 rounded text-xs text-green-800">
          ✓ Sufficient capacity available for this migration phase.
        </div>
      )}
    </Card>
  );
}