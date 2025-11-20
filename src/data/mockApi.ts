// Mock API delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// VM Inventory Data
export interface VM {
  id: string;
  name: string;
  serviceName: string;
  region: string;
  country: string;
  datacenter: string;
  category: string;
  cpu: number;
  memory: number;
  storage: number;
  phase: string;
  status: string;
  os: 'Windows' | 'Linux';
  patchingCR?: string;
  patchingTime?: string;
  lastPatchDiscovery?: string;
}

const vmInventoryData: VM[] = [
  // US-East Region - C1 VMs (Simple, Direct Migration)
  { id: '1', name: 'GB00001', serviceName: 'Payment Service', region: 'US-East', country: 'United States', datacenter: 'US-EAST-DC01', category: 'C1', cpu: 4, memory: 8, storage: 250, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024001', patchingTime: '2025-12-15 02:00 AM', lastPatchDiscovery: '2025-11-18 10:30 AM' },
  { id: '2', name: 'GB00002', serviceName: 'Email Service', region: 'US-East', country: 'United States', datacenter: 'US-EAST-DC01', category: 'C1', cpu: 2, memory: 4, storage: 100, phase: '-', status: 'Active', os: 'Windows', patchingCR: 'CHG2024002', patchingTime: '2025-12-20 03:00 AM', lastPatchDiscovery: '2025-11-19 09:15 AM' },
  { id: '3', name: 'GB00003', serviceName: 'Auth Service', region: 'US-East', country: 'United States', datacenter: 'US-EAST-DC01', category: 'C1', cpu: 2, memory: 8, storage: 200, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024001', patchingTime: '2025-12-15 02:00 AM', lastPatchDiscovery: '2025-11-18 10:30 AM' },
  { id: '4', name: 'GB00004', serviceName: 'API Gateway', region: 'US-East', country: 'United States', datacenter: 'US-EAST-DC01', category: 'C1', cpu: 4, memory: 8, storage: 300, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024003', patchingTime: '2025-12-18 01:00 AM', lastPatchDiscovery: '2025-11-19 11:45 AM' },
  
  // US-East Region - C2 VMs (Storage Offloading)
  { id: '5', name: 'GB00005', serviceName: 'Customer Portal', region: 'US-East', country: 'United States', datacenter: 'US-EAST-DC02', category: 'C2', cpu: 8, memory: 32, storage: 1500, phase: '-', status: 'Active', os: 'Windows', patchingCR: 'CHG2024002', patchingTime: '2025-12-20 03:00 AM', lastPatchDiscovery: '2025-11-19 09:15 AM' },
  { id: '6', name: 'GB00006', serviceName: 'Data Warehouse', region: 'US-East', country: 'United States', datacenter: 'US-EAST-DC02', category: 'C2', cpu: 16, memory: 64, storage: 2000, phase: '-', status: 'Active', os: 'Windows', patchingCR: 'CHG2024004', patchingTime: '2025-12-22 04:00 AM', lastPatchDiscovery: '2025-11-19 02:20 PM' },
  { id: '7', name: 'GB00007', serviceName: 'File Server', region: 'US-East', country: 'United States', datacenter: 'US-EAST-DC02', category: 'C2', cpu: 8, memory: 32, storage: 1800, phase: '-', status: 'Active', os: 'Windows', patchingCR: 'CHG2024002', patchingTime: '2025-12-20 03:00 AM', lastPatchDiscovery: '2025-11-19 09:15 AM' },
  
  // US-East Region - C3 VMs (Appliance Optimization)
  { id: '8', name: 'GB00008', serviceName: 'Firewall Appliance', region: 'US-East', country: 'United States', datacenter: 'US-EAST-DC01', category: 'C3', cpu: 4, memory: 16, storage: 500, phase: '-', status: 'Active', os: 'Linux' },
  { id: '9', name: 'GB00009', serviceName: 'Load Balancer', region: 'US-East', country: 'United States', datacenter: 'US-EAST-DC01', category: 'C3', cpu: 4, memory: 16, storage: 400, phase: '-', status: 'Active', os: 'Linux' },
  
  // US-West Region - C1 VMs
  { id: '10', name: 'GB00010', serviceName: 'Cache Server', region: 'US-West', country: 'United States', datacenter: 'US-WEST-DC01', category: 'C1', cpu: 2, memory: 8, storage: 200, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024005', patchingTime: '2025-12-16 02:00 AM', lastPatchDiscovery: '2025-11-18 03:45 PM' },
  { id: '11', name: 'GB00011', serviceName: 'Web Server', region: 'US-West', country: 'United States', datacenter: 'US-WEST-DC01', category: 'C1', cpu: 4, memory: 8, storage: 250, phase: '-', status: 'Active', os: 'Windows', patchingCR: 'CHG2024006', patchingTime: '2025-12-25 03:00 AM', lastPatchDiscovery: '2025-11-19 04:30 PM' },
  { id: '12', name: 'GB00012', serviceName: 'DNS Server', region: 'US-West', country: 'United States', datacenter: 'US-WEST-DC01', category: 'C1', cpu: 2, memory: 4, storage: 100, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024005', patchingTime: '2025-12-16 02:00 AM', lastPatchDiscovery: '2025-11-18 03:45 PM' },
  { id: '13', name: 'GB00013', serviceName: 'Proxy Server', region: 'US-West', country: 'United States', datacenter: 'US-WEST-DC01', category: 'C1', cpu: 4, memory: 8, storage: 300, phase: '-', status: 'Active', os: 'Linux' },
  
  // US-West Region - C2 VMs
  { id: '14', name: 'GB00014', serviceName: 'Media Server', region: 'US-West', country: 'United States', datacenter: 'US-WEST-DC02', category: 'C2', cpu: 8, memory: 32, storage: 2500, phase: '-', status: 'Active', os: 'Windows', patchingCR: 'CHG2024006', patchingTime: '2025-12-25 03:00 AM', lastPatchDiscovery: '2025-11-19 04:30 PM' },
  { id: '15', name: 'GB00015', serviceName: 'Backup Server', region: 'US-West', country: 'United States', datacenter: 'US-WEST-DC02', category: 'C2', cpu: 8, memory: 32, storage: 3000, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024007', patchingTime: '2025-12-28 01:00 AM', lastPatchDiscovery: '2025-11-19 05:15 PM' },
  
  // US-West Region - C4 VMs
  { id: '16', name: 'GB00016', serviceName: 'Security Appliance', region: 'US-West', country: 'United States', datacenter: 'US-WEST-DC02', category: 'C4', cpu: 8, memory: 32, storage: 1500, phase: '-', status: 'Active', os: 'Linux' },
  
  // US-West Region - C5 VMs
  { id: '17', name: 'GB00017', serviceName: 'SAN Controller', region: 'US-West', country: 'United States', datacenter: 'US-WEST-DC02', category: 'C5', cpu: 4, memory: 16, storage: 500, phase: '-', status: 'Active', os: 'Linux' },
  
  // EU-Central Region - C1 VMs
  { id: '18', name: 'GB00018', serviceName: 'Message Queue', region: 'EU-Central', country: 'Germany', datacenter: 'FRANKFURT-DC01', category: 'C1', cpu: 4, memory: 8, storage: 300, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024008', patchingTime: '2025-12-17 01:00 AM', lastPatchDiscovery: '2025-11-18 08:30 AM' },
  { id: '19', name: 'GB00019', serviceName: 'Session Store', region: 'EU-Central', country: 'Germany', datacenter: 'FRANKFURT-DC01', category: 'C1', cpu: 2, memory: 8, storage: 200, phase: '-', status: 'Active', os: 'Windows', patchingCR: 'CHG2024009', patchingTime: '2025-12-19 02:00 AM', lastPatchDiscovery: '2025-11-18 09:45 AM' },
  { id: '20', name: 'GB00020', serviceName: 'Config Server', region: 'EU-Central', country: 'Germany', datacenter: 'FRANKFURT-DC01', category: 'C1', cpu: 2, memory: 4, storage: 100, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024008', patchingTime: '2025-12-17 01:00 AM', lastPatchDiscovery: '2025-11-18 08:30 AM' },
  { id: '21', name: 'GB00021', serviceName: 'Logging Service', region: 'EU-Central', country: 'Germany', datacenter: 'FRANKFURT-DC02', category: 'C1', cpu: 4, memory: 8, storage: 400, phase: '-', status: 'Active', os: 'Linux' },
  { id: '22', name: 'GB00022', serviceName: 'Metrics Server', region: 'EU-Central', country: 'Germany', datacenter: 'FRANKFURT-DC02', category: 'C1', cpu: 2, memory: 8, storage: 250, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024010', patchingTime: '2025-12-21 01:30 AM', lastPatchDiscovery: '2025-11-19 10:20 AM' },
  
  // EU-Central Region - C2 VMs
  { id: '23', name: 'GB00023', serviceName: 'Analytics Engine', region: 'EU-Central', country: 'Germany', datacenter: 'FRANKFURT-DC02', category: 'C2', cpu: 16, memory: 64, storage: 2000, phase: '-', status: 'Active', os: 'Windows', patchingCR: 'CHG2024009', patchingTime: '2025-12-19 02:00 AM', lastPatchDiscovery: '2025-11-18 09:45 AM' },
  { id: '24', name: 'GB00024', serviceName: 'Document Store', region: 'EU-Central', country: 'Germany', datacenter: 'FRANKFURT-DC02', category: 'C2', cpu: 8, memory: 32, storage: 1800, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024011', patchingTime: '2025-12-23 03:00 AM', lastPatchDiscovery: '2025-11-19 11:30 AM' },
  { id: '25', name: 'GB00025', serviceName: 'Archive Server', region: 'EU-Central', country: 'Germany', datacenter: 'FRANKFURT-DC02', category: 'C2', cpu: 8, memory: 32, storage: 2200, phase: '-', status: 'Active', os: 'Windows' },
  
  // EU-Central Region - C3 VMs
  { id: '26', name: 'GB00026', serviceName: 'VPN Appliance', region: 'EU-Central', country: 'Germany', datacenter: 'FRANKFURT-DC01', category: 'C3', cpu: 4, memory: 16, storage: 300, phase: '-', status: 'Active', os: 'Linux' },
  { id: '27', name: 'GB00027', serviceName: 'Monitoring Tool', region: 'EU-Central', country: 'Germany', datacenter: 'FRANKFURT-DC01', category: 'C3', cpu: 4, memory: 16, storage: 600, phase: '-', status: 'Active', os: 'Linux' },
  
  // EU-Central Region - C4 VMs
  { id: '28', name: 'GB00028', serviceName: 'IDS Appliance', region: 'EU-Central', country: 'Germany', datacenter: 'FRANKFURT-DC01', category: 'C4', cpu: 8, memory: 32, storage: 1200, phase: '-', status: 'Active', os: 'Linux' },
  
  // APAC Region - C1 VMs
  { id: '29', name: 'GB00029', serviceName: 'Mobile API', region: 'APAC', country: 'Hong Kong', datacenter: 'HK-CENTRAL-DC01', category: 'C1', cpu: 4, memory: 8, storage: 300, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024012', patchingTime: '2025-12-14 23:00 PM', lastPatchDiscovery: '2025-11-18 06:15 AM' },
  { id: '30', name: 'GB00030', serviceName: 'Search Service', region: 'APAC', country: 'Hong Kong', datacenter: 'HK-CENTRAL-DC01', category: 'C1', cpu: 4, memory: 8, storage: 400, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024012', patchingTime: '2025-12-14 23:00 PM', lastPatchDiscovery: '2025-11-18 06:15 AM' },
  { id: '31', name: 'GB00031', serviceName: 'Notification Service', region: 'APAC', country: 'Hong Kong', datacenter: 'HK-CENTRAL-DC01', category: 'C1', cpu: 2, memory: 8, storage: 200, phase: '-', status: 'Active', os: 'Windows', patchingCR: 'CHG2024013', patchingTime: '2025-12-26 23:30 PM', lastPatchDiscovery: '2025-11-19 07:00 AM' },
  { id: '32', name: 'GB00032', serviceName: 'Job Scheduler', region: 'APAC', country: 'Singapore', datacenter: 'SINGAPORE-DC01', category: 'C1', cpu: 2, memory: 4, storage: 150, phase: '-', status: 'Active', os: 'Windows', patchingCR: 'CHG2024013', patchingTime: '2025-12-26 23:30 PM', lastPatchDiscovery: '2025-11-19 07:00 AM' },
  
  // APAC Region - C2 VMs
  { id: '33', name: 'GB00033', serviceName: 'Database Server', region: 'APAC', country: 'Singapore', datacenter: 'SINGAPORE-DC01', category: 'C2', cpu: 16, memory: 64, storage: 2500, phase: '-', status: 'Active', os: 'Windows', patchingCR: 'CHG2024014', patchingTime: '2025-12-27 00:00 AM', lastPatchDiscovery: '2025-11-19 08:30 AM' },
  { id: '34', name: 'GB00034', serviceName: 'CRM Application', region: 'APAC', country: 'Singapore', datacenter: 'SINGAPORE-DC02', category: 'C2', cpu: 8, memory: 32, storage: 1600, phase: '-', status: 'Active', os: 'Windows' },
  
  // APAC Region - C3 VMs
  { id: '35', name: 'GB00035', serviceName: 'WAF Appliance', region: 'APAC', country: 'Singapore', datacenter: 'SINGAPORE-DC02', category: 'C3', cpu: 4, memory: 16, storage: 500, phase: '-', status: 'Active', os: 'Linux' },
  
  // APAC Region - C5 VMs
  { id: '36', name: 'GB00036', serviceName: 'Storage Gateway', region: 'APAC', country: 'Singapore', datacenter: 'SINGAPORE-DC02', category: 'C5', cpu: 4, memory: 16, storage: 600, phase: '-', status: 'Active', os: 'Linux' },
  
  // Additional VMs for better examples
  { id: '37', name: 'GB00037', serviceName: 'Report Generator', region: 'US-East', country: 'United States', datacenter: 'US-EAST-DC01', category: 'C1', cpu: 2, memory: 8, storage: 200, phase: '-', status: 'Active', os: 'Windows', patchingCR: 'CHG2024002', patchingTime: '2025-12-20 03:00 AM', lastPatchDiscovery: '2025-11-19 09:15 AM' },
  { id: '38', name: 'GB00038', serviceName: 'ETL Service', region: 'EU-Central', country: 'Germany', datacenter: 'FRANKFURT-DC02', category: 'C2', cpu: 8, memory: 32, storage: 1400, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024011', patchingTime: '2025-12-23 03:00 AM', lastPatchDiscovery: '2025-11-19 11:30 AM' },
  { id: '39', name: 'GB00039', serviceName: 'Content Server', region: 'US-West', country: 'United States', datacenter: 'US-WEST-DC01', category: 'C1', cpu: 4, memory: 8, storage: 350, phase: '-', status: 'Active', os: 'Windows' },
  { id: '40', name: 'GB00040', serviceName: 'Streaming Server', region: 'APAC', country: 'Hong Kong', datacenter: 'HK-CENTRAL-DC01', category: 'C2', cpu: 8, memory: 32, storage: 1700, phase: '-', status: 'Active', os: 'Linux', patchingCR: 'CHG2024015', patchingTime: '2025-12-29 23:00 PM', lastPatchDiscovery: '2025-11-19 09:45 AM' },
];

export const getVMInventory = async (): Promise<VM[]> => {
  await delay(1000);
  return vmInventoryData;
};

// Category Data
export interface Category {
  migrationType: string;
  category: string;
  criticality: string;
  environment: string;
  site: string;
  vm: string;
  cluster: string;
  rdm: string;
  application: string;
  vmSize: string;
  replication: string;
  role: string;
}

const categoryData: Category[] = [
  {
    migrationType: 'Direct',
    category: 'C1',
    criticality: 'Non Critical',
    environment: 'DEV/UAT/OAT',
    site: 'Single Site',
    vm: 'Single',
    cluster: 'No Cluster',
    rdm: 'No RDM',
    application: 'No Appliance',
    vmSize: 'Not Large',
    replication: 'Not required',
    role: ''
  },
  {
    migrationType: 'Storage Offloading',
    category: 'C2',
    criticality: 'Non Critical',
    environment: 'DEV/UAT/OAT',
    site: 'Single Site',
    vm: 'Single',
    cluster: 'No Cluster',
    rdm: 'No RDM',
    application: 'No Appliance',
    vmSize: 'Large',
    replication: 'Not required',
    role: ''
  },
  {
    migrationType: 'Optimization',
    category: 'C3',
    criticality: 'Non Critical',
    environment: 'DEV/UAT/OAT',
    site: 'Single Site',
    vm: 'Single',
    cluster: 'No Cluster',
    rdm: 'No RDM',
    application: 'Appliance',
    vmSize: 'Not Large',
    replication: 'Not required',
    role: ''
  },
  {
    migrationType: 'Optimization',
    category: 'C4',
    criticality: 'Non Critical',
    environment: 'DEV/UAT/OAT',
    site: 'Single Site',
    vm: 'Single',
    cluster: 'No Cluster',
    rdm: 'No RDM',
    application: 'Appliance',
    vmSize: 'Large',
    replication: 'Not required',
    role: ''
  },
  {
    migrationType: 'Direct With Compressed',
    category: 'C5',
    criticality: 'Non Critical',
    environment: 'DEV/UAT/OAT',
    site: 'Single Site',
    vm: 'Single',
    cluster: 'No Cluster',
    rdm: 'RDM',
    application: 'No Appliance',
    vmSize: 'Not Large',
    replication: 'Not required',
    role: ''
  }
];

export const getCategories = async (): Promise<Category[]> => {
  await delay(1000);
  return categoryData;
};

// Regional Leads Data
export interface RegionLead {
  id: string;
  region: string;
  primaryLead: string;
  primaryEmail: string;
  secondaryLead: string;
  secondaryEmail: string;
  engineers: string;
  assignedDate: string;
}

const regionalLeadsData: RegionLead[] = [
  {
    id: '1',
    region: 'US-East',
    primaryLead: 'John Doe',
    primaryEmail: 'john.doe@hsbc.com',
    secondaryLead: 'Sarah Johnson',
    secondaryEmail: 'sarah.johnson@hsbc.com',
    engineers: 'Mike Wilson, Tom Anderson, Lisa White',
    assignedDate: '2025-11-01'
  },
  {
    id: '2',
    region: 'US-West',
    primaryLead: 'Jane Smith',
    primaryEmail: 'jane.smith@hsbc.com',
    secondaryLead: 'Mike Wilson',
    secondaryEmail: 'mike.wilson@hsbc.com',
    engineers: 'Chris Brown, Amy Davis',
    assignedDate: '2025-11-01'
  },
  {
    id: '3',
    region: 'EU-Central',
    primaryLead: 'Michael Brown',
    primaryEmail: 'michael.brown@hsbc.com',
    secondaryLead: 'Emma Davis',
    secondaryEmail: 'emma.davis@hsbc.com',
    engineers: 'David Miller, Sophie Turner, Alex Johnson',
    assignedDate: '2025-11-02'
  },
  {
    id: '4',
    region: 'APAC',
    primaryLead: 'Lisa Chen',
    primaryEmail: 'lisa.chen@hsbc.com',
    secondaryLead: 'David Lee',
    secondaryEmail: 'david.lee@hsbc.com',
    engineers: 'Kevin Wang, Anna Zhang',
    assignedDate: '2025-11-03'
  }
];

export const getRegionalLeads = async (): Promise<RegionLead[]> => {
  await delay(1000);
  return regionalLeadsData;
};

// Phase Data
export interface Phase {
  id: string;
  name: string;
  region: string;
  changeRequest: string;
  category: string;
  assignedTo: string;
  startDate: string;
  endDate: string;
  status: 'Planned' | 'Migrating' | 'Completed';
  vms: string[];
}

const phasesData: Phase[] = [
  {
    id: '1',
    name: 'Phase 1 - US East C1 Migration',
    region: 'US-East',
    changeRequest: 'CHG001234',
    category: 'C1',
    assignedTo: 'John Doe',
    startDate: '2025-11-20',
    endDate: '2025-11-25',
    status: 'Completed',
    vms: ['GB00001', 'GB00006', 'GB00011']
  },
  {
    id: '2',
    name: 'Phase 2 - EU Central Analytics',
    region: 'EU-Central',
    changeRequest: 'CHG001235',
    category: 'C2',
    assignedTo: 'Michael Brown',
    startDate: '2025-11-22',
    endDate: '2025-11-28',
    status: 'Migrating',
    vms: ['GB00003', 'GB00007', 'GB00015']
  },
  {
    id: '3',
    name: 'Phase 3 - APAC Services',
    region: 'APAC',
    changeRequest: 'CHG001236',
    category: 'C1',
    assignedTo: 'Lisa Chen',
    startDate: '2025-11-25',
    endDate: '2025-12-01',
    status: 'Planned',
    vms: ['GB00005', 'GB00009', 'GB00013']
  }
];

export const getPhases = async (): Promise<Phase[]> => {
  await delay(1000);
  return phasesData;
};

// Migration Reports Data
export interface RegionReport {
  region: string;
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

const regionReportData: RegionReport[] = [
  { region: 'US-East', total: 15, completed: 8, inProgress: 5, notStarted: 2 },
  { region: 'US-West', total: 12, completed: 4, inProgress: 6, notStarted: 2 },
  { region: 'EU-Central', total: 18, completed: 10, inProgress: 6, notStarted: 2 },
  { region: 'APAC', total: 5, completed: 1, inProgress: 2, notStarted: 2 }
];

export const getRegionReports = async (): Promise<RegionReport[]> => {
  await delay(1000);
  return regionReportData;
};

export interface PhaseReport {
  phase: string;
  region: string;
  vms: number;
  assignedTo: string;
  progress: number;
}

const phaseReportData: PhaseReport[] = [
  { phase: 'Phase 1', region: 'US-East', vms: 5, assignedTo: 'John Doe', progress: 80 },
  { phase: 'Phase 2', region: 'EU-Central', vms: 8, assignedTo: 'Jane Smith', progress: 25 },
  { phase: 'Phase 3', region: 'US-West', vms: 6, assignedTo: 'Mike Johnson', progress: 100 },
  { phase: 'Phase 4', region: 'APAC', vms: 3, assignedTo: 'Sarah Lee', progress: 50 }
];

export const getPhaseReports = async (): Promise<PhaseReport[]> => {
  await delay(1000);
  return phaseReportData;
};