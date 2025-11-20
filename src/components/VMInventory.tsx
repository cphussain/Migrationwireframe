import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, Filter, X, Monitor, Calendar, Clock } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { getVMInventory, type VM } from '../data/mockApi';
import { datacenters } from '../data/datacenters';

interface UserSession {
  username: string;
  role: string;
  region?: string;
}

interface VMInventoryProps {
  userSession: UserSession;
}

export function VMInventory({ userSession }: VMInventoryProps) {
  const [vms, setVMs] = useState<VM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchVMs = async () => {
      setIsLoading(true);
      const data = await getVMInventory();
      setVMs(data);
      setIsLoading(false);
    };
    fetchVMs();
  }, []);

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
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#DB0011]">VM Name</TableHead>
                <TableHead className="text-[#DB0011]">Service Name</TableHead>
                <TableHead className="text-[#DB0011]">Country</TableHead>
                <TableHead className="text-[#DB0011]">Datacenter</TableHead>
                <TableHead className="text-[#DB0011]">Category</TableHead>
                <TableHead className="text-[#DB0011]">CPU</TableHead>
                <TableHead className="text-[#DB0011]">Memory (GB)</TableHead>
                <TableHead className="text-[#DB0011]">Storage (GB)</TableHead>
                <TableHead className="text-[#DB0011]">Patching CR</TableHead>
                <TableHead className="text-[#DB0011]">Patching Time</TableHead>
                <TableHead className="text-[#DB0011]">Last Discovery</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-4">
                    <LoadingSpinner />
                  </TableCell>
                </TableRow>
              ) : paginatedVMs.map((vm, index) => (
                <TableRow key={`${vm.name}-${index}`}>
                  <TableCell className="text-slate-900">
                    <div className="flex items-center gap-2">
                      {vm.os === 'Windows' ? (
                        <svg className="size-4 flex-shrink-0" viewBox="0 0 88 88" fill="#00ADEF">
                          <path d="M0 12.402l35.687-4.8602.0156 34.423-35.67.20313zm35.67 33.529.0277 34.453-35.67-4.9041-.002-29.78zm4.3261-39.025l47.318-6.906v41.527l-47.318.37565zm47.329 39.349-.0111 41.34-47.318-6.6784-.0663-34.739z"/>
                        </svg>
                      ) : (
                        <svg className="size-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                          <path d="M12.5 0C11.5 0 10.7 0.8 10.7 1.8c0 0.6 0.3 1.1 0.7 1.4 0 0.1 0 0.1 0 0.2 0 0.4-0.3 0.7-0.7 0.7s-0.7-0.3-0.7-0.7c0-0.1 0-0.1 0-0.2C9.6 2.9 9.3 2.4 9.3 1.8 9.3 0.8 8.5 0 7.5 0S5.7 0.8 5.7 1.8c0 0.6 0.3 1.1 0.7 1.4v0.2c0 1.3 1 2.3 2.3 2.3h3.6c1.3 0 2.3-1 2.3-2.3v-0.2c0.4-0.3 0.7-0.8 0.7-1.4C15.3 0.8 14.5 0 13.5 0h-1z" fill="#FCC624"/>
                          <ellipse cx="7.5" cy="7" rx="1" ry="1.5" fill="#000"/>
                          <ellipse cx="12.5" cy="7" rx="1" ry="1.5" fill="#000"/>
                          <path d="M10 2C6.7 2 4 4.7 4 8v6c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4V8c0-3.3-2.7-6-6-6zm0 14c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" fill="#000"/>
                          <path d="M10 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" fill="#FFF"/>
                          <ellipse cx="10" cy="20" rx="3" ry="2" fill="#FCC624"/>
                          <ellipse cx="10" cy="21" rx="4" ry="1.5" fill="#FFA500"/>
                          <path d="M6 16c-0.5 0.5-1 1.5-1 2.5 0 1.1 0.9 2 2 2s2-0.9 2-2c0-1-0.5-2-1-2.5" fill="#FFA500"/>
                          <path d="M14 16c0.5 0.5 1 1.5 1 2.5 0 1.1-0.9 2-2 2s-2-0.9-2-2c0-1 0.5-2 1-2.5" fill="#FFA500"/>
                        </svg>
                      )}
                      {vm.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-900">{vm.serviceName}</TableCell>
                  <TableCell className="text-slate-700">{vm.country}</TableCell>
                  <TableCell className="text-slate-700">
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">
                      {vm.datacenter}
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
                  <TableCell className="text-slate-700">
                    {vm.patchingCR ? (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {vm.patchingCR}
                      </Badge>
                    ) : (
                      <span className="text-slate-400 text-xs">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {vm.patchingTime ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3 text-slate-500" />
                        <span className="text-xs">{vm.patchingTime}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {vm.lastPatchDiscovery ? (
                      <div className="flex items-center gap-1">
                        <Clock className="size-3 text-green-600" />
                        <span className="text-xs text-green-700">{vm.lastPatchDiscovery}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">N/A</span>
                    )}
                  </TableCell>
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