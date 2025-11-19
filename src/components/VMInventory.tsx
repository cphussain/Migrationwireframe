import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, Filter, X } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface UserSession {
  username: string;
  role: string;
  region?: string;
}

interface VMInventoryProps {
  userSession: UserSession;
}

// Mock VM data generator for 100k VMs
const generateVMs = () => {
  const vms = [];
  const regions = ['US-East', 'US-West', 'EU-Central', 'APAC', 'EU-West', 'US-Central', 'APAC-South', 'EU-North'];
  const categories = ['C1', 'C2', 'Unassigned'];
  const services = [
    'Payment Gateway', 'Customer Portal', 'Trading Platform', 'Mobile Banking', 
    'Core Banking', 'Analytics Service', 'Risk Management', 'Loan Processing',
    'ATM Network', 'Card Services', 'Wealth Management', 'Treasury System',
    'Compliance System', 'HR Portal', 'Email Service', 'File Server'
  ];

  for (let i = 1; i <= 100000; i++) {
    vms.push({
      name: `VM-${String(i).padStart(6, '0')}`,
      serviceName: services[Math.floor(Math.random() * services.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      cpu: Math.floor(Math.random() * 16) + 2,
      memory: Math.floor(Math.random() * 64) + 8,
      storage: Math.floor(Math.random() * 500) + 100,
      phase: Math.random() > 0.5 ? `Phase ${Math.floor(Math.random() * 5) + 1}` : '-',
    });
  }
  return vms;
};

export function VMInventory({ userSession }: VMInventoryProps) {
  const [vms] = useState(() => generateVMs());
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Get unique values for filters
  const uniqueRegions = useMemo(() => {
    const regions = new Set(vms.map(vm => vm.region));
    return Array.from(regions).sort();
  }, [vms]);

  const uniqueServices = useMemo(() => {
    const services = new Set(vms.map(vm => vm.serviceName));
    return Array.from(services).sort();
  }, [vms]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(vms.map(vm => vm.category));
    return Array.from(categories).sort();
  }, [vms]);

  // Filter VMs
  const filteredVMs = useMemo(() => {
    return vms.filter(vm => {
      const matchesSearch = searchTerm === '' || 
        vm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vm.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRegion = regionFilter === 'all' || vm.region === regionFilter;
      const matchesService = serviceFilter === 'all' || vm.serviceName === serviceFilter;
      const matchesCategory = categoryFilter === 'all' || vm.category === categoryFilter;

      return matchesSearch && matchesRegion && matchesService && matchesCategory;
    });
  }, [vms, searchTerm, regionFilter, serviceFilter, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredVMs.length / itemsPerPage);
  const paginatedVMs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVMs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVMs, currentPage]);

  const clearFilters = () => {
    setSearchTerm('');
    setRegionFilter('all');
    setServiceFilter('all');
    setCategoryFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== '' || regionFilter !== 'all' || 
                          serviceFilter !== 'all' || categoryFilter !== 'all';

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'C1':
        return 'bg-purple-100 text-purple-800';
      case 'C2':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#DB0011]">VMware Inventory</CardTitle>
        <CardDescription className="text-slate-600">
          Complete list of VMs available for migration ({vms.length.toLocaleString()} total, {filteredVMs.length.toLocaleString()} filtered)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="size-5 text-[#DB0011]" />
            <span className="text-slate-900">Search & Filter Options</span>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="ml-auto text-[#DB0011] hover:bg-[#FEF0F1]"
              >
                <X className="size-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Text Search */}
            <div className="lg:col-span-2 space-y-2">
              <Label htmlFor="search" className="text-slate-900">Search by VM or Service Name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Region Filter */}
            <div className="space-y-2">
              <Label htmlFor="region-filter" className="text-slate-900">Region</Label>
              <Select value={regionFilter} onValueChange={(value) => {
                setRegionFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger id="region-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {uniqueRegions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Filter */}
            <div className="space-y-2">
              <Label htmlFor="service-filter" className="text-slate-900">Service Name</Label>
              <Select value={serviceFilter} onValueChange={(value) => {
                setServiceFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger id="service-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {uniqueServices.map(service => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="category-filter" className="text-slate-900">Category</Label>
              <Select value={categoryFilter} onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger id="category-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#DB0011]">VM Name</TableHead>
                <TableHead className="text-[#DB0011]">Service Name</TableHead>
                <TableHead className="text-[#DB0011]">Region</TableHead>
                <TableHead className="text-[#DB0011]">Category</TableHead>
                <TableHead className="text-[#DB0011]">CPU</TableHead>
                <TableHead className="text-[#DB0011]">Memory (GB)</TableHead>
                <TableHead className="text-[#DB0011]">Storage (GB)</TableHead>
                <TableHead className="text-[#DB0011]">Phase</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVMs.map((vm, index) => (
                <TableRow key={`${vm.name}-${index}`}>
                  <TableCell className="text-slate-900">{vm.name}</TableCell>
                  <TableCell className="text-slate-900">{vm.serviceName}</TableCell>
                  <TableCell className="text-slate-700">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {vm.region}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getCategoryColor(vm.category)}>
                      {vm.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-700">{vm.cpu}</TableCell>
                  <TableCell className="text-slate-700">{vm.memory}</TableCell>
                  <TableCell className="text-slate-700">{vm.storage}</TableCell>
                  <TableCell className="text-slate-600">{vm.phase}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredVMs.length)} of {filteredVMs.length.toLocaleString()} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}