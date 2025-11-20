export interface OpenShiftCluster {
  name: string;
  status: 'operational' | 'maintenance' | 'warning';
  compute: { available: number; total: number; unit: string; };
  memory: { available: number; total: number; unit: string; };
  storage: { available: number; total: number; unit: string; };
  network: { available: number; total: number; unit: string; };
  currentVMs: number;
  maxCapacity: number;
}

export interface Datacenter {
  country: string;
  countryCode: string;
  locationName: string;
  status: 'operational' | 'maintenance' | 'warning';
  resources: {
    compute: { available: number; total: number; unit: string; };
    memory: { available: number; total: number; unit: string; };
    storage: { available: number; total: number; unit: string; };
    network: { available: number; total: number; unit: string; };
  };
  openShiftClusters: OpenShiftCluster[];
}

export const datacenters: Datacenter[] = [
  // Argentina
  {
    country: 'Argentina',
    countryCode: 'AR',
    locationName: 'OLLEROS DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 320, total: 480, unit: 'cores' },
      memory: { available: 640, total: 960, unit: 'GB' },
      storage: { available: 25, total: 40, unit: 'TB' },
      network: { available: 12, total: 18, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'AR-OLLEROS-OCP-01',
        status: 'operational',
        compute: { available: 160, total: 240, unit: 'cores' },
        memory: { available: 320, total: 480, unit: 'GB' },
        storage: { available: 12, total: 20, unit: 'TB' },
        network: { available: 6, total: 9, unit: 'Gbps' },
        currentVMs: 35,
        maxCapacity: 60,
      },
      {
        name: 'AR-OLLEROS-OCP-02',
        status: 'operational',
        compute: { available: 160, total: 240, unit: 'cores' },
        memory: { available: 320, total: 480, unit: 'GB' },
        storage: { available: 13, total: 20, unit: 'TB' },
        network: { available: 6, total: 9, unit: 'Gbps' },
        currentVMs: 28,
        maxCapacity: 60,
      },
    ],
  },
  {
    country: 'Argentina',
    countryCode: 'AR',
    locationName: 'PACHECO DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 280, total: 400, unit: 'cores' },
      memory: { available: 560, total: 800, unit: 'GB' },
      storage: { available: 20, total: 35, unit: 'TB' },
      network: { available: 10, total: 15, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'AR-PACHECO-OCP-01',
        status: 'operational',
        compute: { available: 280, total: 400, unit: 'cores' },
        memory: { available: 560, total: 800, unit: 'GB' },
        storage: { available: 20, total: 35, unit: 'TB' },
        network: { available: 10, total: 15, unit: 'Gbps' },
        currentVMs: 42,
        maxCapacity: 100,
      },
    ],
  },
  // Australia
  {
    country: 'Australia',
    countryCode: 'AU',
    locationName: 'CANBERRA DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 450, total: 600, unit: 'cores' },
      memory: { available: 900, total: 1200, unit: 'GB' },
      storage: { available: 35, total: 50, unit: 'TB' },
      network: { available: 16, total: 22, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'AU-CANBERRA-OCP-01',
        status: 'operational',
        compute: { available: 220, total: 300, unit: 'cores' },
        memory: { available: 440, total: 600, unit: 'GB' },
        storage: { available: 18, total: 25, unit: 'TB' },
        network: { available: 8, total: 11, unit: 'Gbps' },
        currentVMs: 48,
        maxCapacity: 75,
      },
      {
        name: 'AU-CANBERRA-OCP-02',
        status: 'operational',
        compute: { available: 230, total: 300, unit: 'cores' },
        memory: { available: 460, total: 600, unit: 'GB' },
        storage: { available: 17, total: 25, unit: 'TB' },
        network: { available: 8, total: 11, unit: 'Gbps' },
        currentVMs: 52,
        maxCapacity: 75,
      },
    ],
  },
  {
    country: 'Australia',
    countryCode: 'AU',
    locationName: 'GLOBAL SWITCH DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 520, total: 700, unit: 'cores' },
      memory: { available: 1040, total: 1400, unit: 'GB' },
      storage: { available: 40, total: 55, unit: 'TB' },
      network: { available: 18, total: 25, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'AU-GLOBALSW-OCP-01',
        status: 'operational',
        compute: { available: 260, total: 350, unit: 'cores' },
        memory: { available: 520, total: 700, unit: 'GB' },
        storage: { available: 20, total: 27.5, unit: 'TB' },
        network: { available: 9, total: 12.5, unit: 'Gbps' },
        currentVMs: 58,
        maxCapacity: 87,
      },
      {
        name: 'AU-GLOBALSW-OCP-02',
        status: 'operational',
        compute: { available: 260, total: 350, unit: 'cores' },
        memory: { available: 520, total: 700, unit: 'GB' },
        storage: { available: 20, total: 27.5, unit: 'TB' },
        network: { available: 9, total: 12.5, unit: 'Gbps' },
        currentVMs: 62,
        maxCapacity: 87,
      },
    ],
  },
  // United Kingdom
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    locationName: 'ARK DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 680, total: 920, unit: 'cores' },
      memory: { available: 1360, total: 1840, unit: 'GB' },
      storage: { available: 58, total: 82, unit: 'TB' },
      network: { available: 25, total: 37, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'GB-ARK-OCP-01',
        status: 'operational',
        compute: { available: 230, total: 307, unit: 'cores' },
        memory: { available: 460, total: 614, unit: 'GB' },
        storage: { available: 20, total: 27, unit: 'TB' },
        network: { available: 8, total: 12, unit: 'Gbps' },
        currentVMs: 68,
        maxCapacity: 95,
      },
      {
        name: 'GB-ARK-OCP-02',
        status: 'operational',
        compute: { available: 225, total: 307, unit: 'cores' },
        memory: { available: 450, total: 614, unit: 'GB' },
        storage: { available: 19, total: 27, unit: 'TB' },
        network: { available: 8, total: 12, unit: 'Gbps' },
        currentVMs: 72,
        maxCapacity: 95,
      },
      {
        name: 'GB-ARK-OCP-03',
        status: 'operational',
        compute: { available: 225, total: 306, unit: 'cores' },
        memory: { available: 450, total: 612, unit: 'GB' },
        storage: { available: 19, total: 28, unit: 'TB' },
        network: { available: 9, total: 13, unit: 'Gbps' },
        currentVMs: 65,
        maxCapacity: 95,
      },
    ],
  },
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    locationName: 'SLOUGH DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 720, total: 1000, unit: 'cores' },
      memory: { available: 1440, total: 2000, unit: 'GB' },
      storage: { available: 62, total: 90, unit: 'TB' },
      network: { available: 27, total: 40, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'GB-SLOUGH-OCP-01',
        status: 'operational',
        compute: { available: 240, total: 333, unit: 'cores' },
        memory: { available: 480, total: 666, unit: 'GB' },
        storage: { available: 21, total: 30, unit: 'TB' },
        network: { available: 9, total: 13, unit: 'Gbps' },
        currentVMs: 75,
        maxCapacity: 105,
      },
      {
        name: 'GB-SLOUGH-OCP-02',
        status: 'operational',
        compute: { available: 240, total: 333, unit: 'cores' },
        memory: { available: 480, total: 666, unit: 'GB' },
        storage: { available: 21, total: 30, unit: 'TB' },
        network: { available: 9, total: 13, unit: 'Gbps' },
        currentVMs: 78,
        maxCapacity: 105,
      },
      {
        name: 'GB-SLOUGH-OCP-03',
        status: 'operational',
        compute: { available: 240, total: 334, unit: 'cores' },
        memory: { available: 480, total: 668, unit: 'GB' },
        storage: { available: 20, total: 30, unit: 'TB' },
        network: { available: 9, total: 14, unit: 'Gbps' },
        currentVMs: 82,
        maxCapacity: 105,
      },
    ],
  },
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    locationName: 'SOUTH YORKSHIRE DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 620, total: 860, unit: 'cores' },
      memory: { available: 1240, total: 1720, unit: 'GB' },
      storage: { available: 54, total: 78, unit: 'TB' },
      network: { available: 24, total: 35, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'GB-SYORK-OCP-01',
        status: 'operational',
        compute: { available: 310, total: 430, unit: 'cores' },
        memory: { available: 620, total: 860, unit: 'GB' },
        storage: { available: 27, total: 39, unit: 'TB' },
        network: { available: 12, total: 17.5, unit: 'Gbps' },
        currentVMs: 92,
        maxCapacity: 125,
      },
      {
        name: 'GB-SYORK-OCP-02',
        status: 'operational',
        compute: { available: 310, total: 430, unit: 'cores' },
        memory: { available: 620, total: 860, unit: 'GB' },
        storage: { available: 27, total: 39, unit: 'TB' },
        network: { available: 12, total: 17.5, unit: 'Gbps' },
        currentVMs: 88,
        maxCapacity: 125,
      },
    ],
  },
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    locationName: 'WAKEFIELD DATA CENTRE',
    status: 'warning',
    resources: {
      compute: { available: 280, total: 780, unit: 'cores' },
      memory: { available: 560, total: 1560, unit: 'GB' },
      storage: { available: 25, total: 70, unit: 'TB' },
      network: { available: 12, total: 32, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'GB-WAKE-OCP-01',
        status: 'warning',
        compute: { available: 140, total: 390, unit: 'cores' },
        memory: { available: 280, total: 780, unit: 'GB' },
        storage: { available: 12, total: 35, unit: 'TB' },
        network: { available: 6, total: 16, unit: 'Gbps' },
        currentVMs: 135,
        maxCapacity: 150,
      },
      {
        name: 'GB-WAKE-OCP-02',
        status: 'operational',
        compute: { available: 140, total: 390, unit: 'cores' },
        memory: { available: 280, total: 780, unit: 'GB' },
        storage: { available: 13, total: 35, unit: 'TB' },
        network: { available: 6, total: 16, unit: 'Gbps' },
        currentVMs: 128,
        maxCapacity: 150,
      },
    ],
  },
  // United States
  {
    country: 'United States Of America',
    countryCode: 'US',
    locationName: 'NORTHLAKE DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 820, total: 1120, unit: 'cores' },
      memory: { available: 1640, total: 2240, unit: 'GB' },
      storage: { available: 70, total: 100, unit: 'TB' },
      network: { available: 30, total: 45, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'US-NLAKE-OCP-01',
        status: 'operational',
        compute: { available: 275, total: 373, unit: 'cores' },
        memory: { available: 550, total: 746, unit: 'GB' },
        storage: { available: 23, total: 33, unit: 'TB' },
        network: { available: 10, total: 15, unit: 'Gbps' },
        currentVMs: 85,
        maxCapacity: 115,
      },
      {
        name: 'US-NLAKE-OCP-02',
        status: 'operational',
        compute: { available: 275, total: 373, unit: 'cores' },
        memory: { available: 550, total: 746, unit: 'GB' },
        storage: { available: 24, total: 33, unit: 'TB' },
        network: { available: 10, total: 15, unit: 'Gbps' },
        currentVMs: 82,
        maxCapacity: 115,
      },
      {
        name: 'US-NLAKE-OCP-03',
        status: 'operational',
        compute: { available: 270, total: 374, unit: 'cores' },
        memory: { available: 540, total: 748, unit: 'GB' },
        storage: { available: 23, total: 34, unit: 'TB' },
        network: { available: 10, total: 15, unit: 'Gbps' },
        currentVMs: 88,
        maxCapacity: 115,
      },
    ],
  },
  {
    country: 'United States Of America',
    countryCode: 'US',
    locationName: 'NY6 DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 880, total: 1200, unit: 'cores' },
      memory: { available: 1760, total: 2400, unit: 'GB' },
      storage: { available: 75, total: 108, unit: 'TB' },
      network: { available: 32, total: 48, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'US-NY6-OCP-01',
        status: 'operational',
        compute: { available: 293, total: 400, unit: 'cores' },
        memory: { available: 586, total: 800, unit: 'GB' },
        storage: { available: 25, total: 36, unit: 'TB' },
        network: { available: 11, total: 16, unit: 'Gbps' },
        currentVMs: 95,
        maxCapacity: 130,
      },
      {
        name: 'US-NY6-OCP-02',
        status: 'operational',
        compute: { available: 293, total: 400, unit: 'cores' },
        memory: { available: 586, total: 800, unit: 'GB' },
        storage: { available: 25, total: 36, unit: 'TB' },
        network: { available: 11, total: 16, unit: 'Gbps' },
        currentVMs: 92,
        maxCapacity: 130,
      },
      {
        name: 'US-NY6-OCP-03',
        status: 'operational',
        compute: { available: 294, total: 400, unit: 'cores' },
        memory: { available: 588, total: 800, unit: 'GB' },
        storage: { available: 25, total: 36, unit: 'TB' },
        network: { available: 10, total: 16, unit: 'Gbps' },
        currentVMs: 98,
        maxCapacity: 130,
      },
    ],
  },
  {
    country: 'United States Of America',
    countryCode: 'US',
    locationName: 'TELX DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 760, total: 1040, unit: 'cores' },
      memory: { available: 1520, total: 2080, unit: 'GB' },
      storage: { available: 65, total: 94, unit: 'TB' },
      network: { available: 28, total: 42, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'US-TELX-OCP-01',
        status: 'operational',
        compute: { available: 380, total: 520, unit: 'cores' },
        memory: { available: 760, total: 1040, unit: 'GB' },
        storage: { available: 32, total: 47, unit: 'TB' },
        network: { available: 14, total: 21, unit: 'Gbps' },
        currentVMs: 105,
        maxCapacity: 145,
      },
      {
        name: 'US-TELX-OCP-02',
        status: 'operational',
        compute: { available: 380, total: 520, unit: 'cores' },
        memory: { available: 760, total: 1040, unit: 'GB' },
        storage: { available: 33, total: 47, unit: 'TB' },
        network: { available: 14, total: 21, unit: 'Gbps' },
        currentVMs: 102,
        maxCapacity: 145,
      },
    ],
  },
  {
    country: 'United States Of America',
    countryCode: 'US',
    locationName: 'VERNON HILLS DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 700, total: 960, unit: 'cores' },
      memory: { available: 1400, total: 1920, unit: 'GB' },
      storage: { available: 60, total: 86, unit: 'TB' },
      network: { available: 26, total: 38, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'US-VHILLS-OCP-01',
        status: 'operational',
        compute: { available: 350, total: 480, unit: 'cores' },
        memory: { available: 700, total: 960, unit: 'GB' },
        storage: { available: 30, total: 43, unit: 'TB' },
        network: { available: 13, total: 19, unit: 'Gbps' },
        currentVMs: 98,
        maxCapacity: 135,
      },
      {
        name: 'US-VHILLS-OCP-02',
        status: 'operational',
        compute: { available: 350, total: 480, unit: 'cores' },
        memory: { available: 700, total: 960, unit: 'GB' },
        storage: { available: 30, total: 43, unit: 'TB' },
        network: { available: 13, total: 19, unit: 'Gbps' },
        currentVMs: 95,
        maxCapacity: 135,
      },
    ],
  },
  // Hong Kong
  {
    country: 'Hong Kong',
    countryCode: 'HK',
    locationName: 'SHEK MUN DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 580, total: 800, unit: 'cores' },
      memory: { available: 1160, total: 1600, unit: 'GB' },
      storage: { available: 50, total: 72, unit: 'TB' },
      network: { available: 22, total: 32, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'HK-SHEKMUN-OCP-01',
        status: 'operational',
        compute: { available: 290, total: 400, unit: 'cores' },
        memory: { available: 580, total: 800, unit: 'GB' },
        storage: { available: 25, total: 36, unit: 'TB' },
        network: { available: 11, total: 16, unit: 'Gbps' },
        currentVMs: 78,
        maxCapacity: 110,
      },
      {
        name: 'HK-SHEKMUN-OCP-02',
        status: 'operational',
        compute: { available: 290, total: 400, unit: 'cores' },
        memory: { available: 580, total: 800, unit: 'GB' },
        storage: { available: 25, total: 36, unit: 'TB' },
        network: { available: 11, total: 16, unit: 'Gbps' },
        currentVMs: 75,
        maxCapacity: 110,
      },
    ],
  },
  {
    country: 'Hong Kong',
    countryCode: 'HK',
    locationName: 'TSEUNG KWAN O DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 640, total: 880, unit: 'cores' },
      memory: { available: 1280, total: 1760, unit: 'GB' },
      storage: { available: 55, total: 78, unit: 'TB' },
      network: { available: 24, total: 35, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'HK-TKO-OCP-01',
        status: 'operational',
        compute: { available: 320, total: 440, unit: 'cores' },
        memory: { available: 640, total: 880, unit: 'GB' },
        storage: { available: 27, total: 39, unit: 'TB' },
        network: { available: 12, total: 17.5, unit: 'Gbps' },
        currentVMs: 85,
        maxCapacity: 120,
      },
      {
        name: 'HK-TKO-OCP-02',
        status: 'operational',
        compute: { available: 320, total: 440, unit: 'cores' },
        memory: { available: 640, total: 880, unit: 'GB' },
        storage: { available: 28, total: 39, unit: 'TB' },
        network: { available: 12, total: 17.5, unit: 'Gbps' },
        currentVMs: 82,
        maxCapacity: 120,
      },
    ],
  },
  // India
  {
    country: 'India',
    countryCode: 'IN',
    locationName: 'MUMCDC DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 680, total: 920, unit: 'cores' },
      memory: { available: 1360, total: 1840, unit: 'GB' },
      storage: { available: 58, total: 82, unit: 'TB' },
      network: { available: 25, total: 37, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'IN-MUMCDC-OCP-01',
        status: 'operational',
        compute: { available: 340, total: 460, unit: 'cores' },
        memory: { available: 680, total: 920, unit: 'GB' },
        storage: { available: 29, total: 41, unit: 'TB' },
        network: { available: 12, total: 18.5, unit: 'Gbps' },
        currentVMs: 88,
        maxCapacity: 125,
      },
      {
        name: 'IN-MUMCDC-OCP-02',
        status: 'operational',
        compute: { available: 340, total: 460, unit: 'cores' },
        memory: { available: 680, total: 920, unit: 'GB' },
        storage: { available: 29, total: 41, unit: 'TB' },
        network: { available: 13, total: 18.5, unit: 'Gbps' },
        currentVMs: 92,
        maxCapacity: 125,
      },
    ],
  },
  {
    country: 'India',
    countryCode: 'IN',
    locationName: 'NAVI MUMBAI, CTRL-S DATA CENTRE',
    status: 'operational',
    resources: {
      compute: { available: 550, total: 760, unit: 'cores' },
      memory: { available: 1100, total: 1520, unit: 'GB' },
      storage: { available: 48, total: 68, unit: 'TB' },
      network: { available: 21, total: 30, unit: 'Gbps' },
    },
    openShiftClusters: [
      {
        name: 'IN-NMUMBAI-OCP-01',
        status: 'operational',
        compute: { available: 275, total: 380, unit: 'cores' },
        memory: { available: 550, total: 760, unit: 'GB' },
        storage: { available: 24, total: 34, unit: 'TB' },
        network: { available: 10, total: 15, unit: 'Gbps' },
        currentVMs: 72,
        maxCapacity: 105,
      },
      {
        name: 'IN-NMUMBAI-OCP-02',
        status: 'operational',
        compute: { available: 275, total: 380, unit: 'cores' },
        memory: { available: 550, total: 760, unit: 'GB' },
        storage: { available: 24, total: 34, unit: 'TB' },
        network: { available: 11, total: 15, unit: 'Gbps' },
        currentVMs: 75,
        maxCapacity: 105,
      },
    ],
  },
];

// Group datacenters by country code
export const datacentersByCountry = datacenters.reduce((acc, dc) => {
  if (!acc[dc.countryCode]) {
    acc[dc.countryCode] = [];
  }
  acc[dc.countryCode].push(dc);
  return acc;
}, {} as Record<string, Datacenter[]>);

// Get unique countries
export const uniqueCountries = Array.from(
  new Set(datacenters.map(dc => ({ code: dc.countryCode, name: dc.country })))
).sort((a, b) => a.name.localeCompare(b.name));
