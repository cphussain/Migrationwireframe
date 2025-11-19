import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Search } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface UserSession {
  username: string;
  role: string;
  region?: string;
}

interface CategoryManagementProps {
  userSession: UserSession;
}

interface Category {
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

export function CategoryManagement({ userSession }: CategoryManagementProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setCategories(categoryData);
      setIsLoading(false);
    }, 1500);
  }, []);

  const filteredCategories = categories.filter(cat => 
    cat.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.migrationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.criticality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.environment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#DB0011]">Migration Categories</CardTitle>
              <CardDescription className="text-slate-600">
                Category definitions based on migration complexity and requirements
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search by category, migration type, criticality, or environment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#DB0011]">Migration Type</TableHead>
                    <TableHead className="text-[#DB0011]">Category</TableHead>
                    <TableHead className="text-[#DB0011]">Criticality</TableHead>
                    <TableHead className="text-[#DB0011]">Environment</TableHead>
                    <TableHead className="text-[#DB0011]">Site</TableHead>
                    <TableHead className="text-[#DB0011]">VM</TableHead>
                    <TableHead className="text-[#DB0011]">Cluster</TableHead>
                    <TableHead className="text-[#DB0011]">RDM</TableHead>
                    <TableHead className="text-[#DB0011]">Application</TableHead>
                    <TableHead className="text-[#DB0011]">VM Size</TableHead>
                    <TableHead className="text-[#DB0011]">Replication</TableHead>
                    <TableHead className="text-[#DB0011]">Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center text-slate-500 py-8">
                        No categories found matching your search
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((cat, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {cat.migrationType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-[#FEF0F1] text-[#DB0011] border-[#DB0011]">
                            {cat.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-700">{cat.criticality}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {cat.environment}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-700">{cat.site}</TableCell>
                        <TableCell className="text-slate-700">{cat.vm}</TableCell>
                        <TableCell className="text-slate-700">{cat.cluster}</TableCell>
                        <TableCell className="text-slate-700">{cat.rdm}</TableCell>
                        <TableCell className="text-slate-700">{cat.application}</TableCell>
                        <TableCell className="text-slate-700">{cat.vmSize}</TableCell>
                        <TableCell className="text-slate-700">{cat.replication}</TableCell>
                        <TableCell className="text-slate-700">{cat.role || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && (
            <div className="mt-4 text-sm text-slate-600">
              Showing {filteredCategories.length} of {categories.length} categories
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
