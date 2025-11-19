import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { UserPlus, Edit2, Users, Wrench, Search } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface RegionLead {
  id: string;
  region: string;
  primaryLead: string;
  primaryEmail: string;
  secondaryLead: string;
  secondaryEmail: string;
  engineers: string;
  assignedDate: string;
}

const initialLeads: RegionLead[] = [
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

const allRegions = ['US-East', 'US-West', 'EU-Central', 'APAC', 'EU-West', 'US-Central', 'APAC-South', 'EU-North'];

export function LeadAssignment() {
  const [leads, setLeads] = useState<RegionLead[]>(initialLeads);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingLead, setEditingLead] = useState<RegionLead | null>(null);
  const [formData, setFormData] = useState({
    region: '',
    primaryLead: '',
    primaryEmail: '',
    secondaryLead: '',
    secondaryEmail: '',
    engineers: ''
  });

  const handleEdit = (lead: RegionLead) => {
    setEditingLead(lead);
    setFormData({
      region: lead.region,
      primaryLead: lead.primaryLead,
      primaryEmail: lead.primaryEmail,
      secondaryLead: lead.secondaryLead,
      secondaryEmail: lead.secondaryEmail,
      engineers: lead.engineers
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editingLead) {
      setLeads(leads.map(lead =>
        lead.id === editingLead.id
          ? { ...lead, ...formData }
          : lead
      ));
    }
    setIsEditing(false);
    setEditingLead(null);
    resetForm();
  };

  const handleAddNew = () => {
    const newLead: RegionLead = {
      id: String(leads.length + 1),
      region: formData.region,
      primaryLead: formData.primaryLead,
      primaryEmail: formData.primaryEmail,
      secondaryLead: formData.secondaryLead,
      secondaryEmail: formData.secondaryEmail,
      engineers: formData.engineers,
      assignedDate: new Date().toISOString().split('T')[0]
    };
    setLeads([...leads, newLead]);
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      region: '',
      primaryLead: '',
      primaryEmail: '',
      secondaryLead: '',
      secondaryEmail: '',
      engineers: ''
    });
  };

  const assignedRegions = leads.map(lead => lead.region);
  const availableRegions = allRegions.filter(region => !assignedRegions.includes(region));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#DB0011]">Regional Team Assignment</CardTitle>
              <CardDescription className="text-slate-600">
                Manage primary leads, secondary leads, and migration engineers for each region
              </CardDescription>
            </div>
            <Dialog open={isAdding} onOpenChange={setIsAdding}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsAdding(true)} className="bg-[#DB0011] hover:bg-[#A50010]">
                  <UserPlus className="size-4 mr-2" />
                  Assign New Region
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#DB0011]">Assign Regional Team</DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Assign primary lead, secondary lead, and engineers for a region
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-region" className="text-slate-900">Region</Label>
                    <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                      <SelectTrigger id="add-region">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRegions.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-primary" className="text-slate-900">Primary Lead Name</Label>
                      <Input
                        id="add-primary"
                        placeholder="e.g., John Doe"
                        value={formData.primaryLead}
                        onChange={(e) => setFormData({ ...formData, primaryLead: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-primary-email" className="text-slate-900">Primary Lead Email</Label>
                      <Input
                        id="add-primary-email"
                        type="email"
                        placeholder="john.doe@hsbc.com"
                        value={formData.primaryEmail}
                        onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-secondary" className="text-slate-900">Secondary Lead Name</Label>
                      <Input
                        id="add-secondary"
                        placeholder="e.g., Jane Smith"
                        value={formData.secondaryLead}
                        onChange={(e) => setFormData({ ...formData, secondaryLead: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-secondary-email" className="text-slate-900">Secondary Lead Email</Label>
                      <Input
                        id="add-secondary-email"
                        type="email"
                        placeholder="jane.smith@hsbc.com"
                        value={formData.secondaryEmail}
                        onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="add-engineers" className="text-slate-900">Migration Engineers</Label>
                    <Textarea
                      id="add-engineers"
                      placeholder="Enter engineer names separated by commas (e.g., Mike Wilson, Tom Anderson, Lisa White)"
                      value={formData.engineers}
                      onChange={(e) => setFormData({ ...formData, engineers: e.target.value })}
                      rows={3}
                    />
                    <p className="text-xs text-slate-500">Separate multiple engineer names with commas</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setIsAdding(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNew} className="bg-[#DB0011] hover:bg-[#A50010]">
                    Assign Team
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#DB0011]">Region</TableHead>
                  <TableHead className="text-[#DB0011]">Primary Lead</TableHead>
                  <TableHead className="text-[#DB0011]">Secondary Lead</TableHead>
                  <TableHead className="text-[#DB0011]">Migration Engineers</TableHead>
                  <TableHead className="text-[#DB0011]">Assigned Date</TableHead>
                  <TableHead className="text-[#DB0011]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {lead.region}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-[#DB0011]" />
                          <span className="text-slate-900">{lead.primaryLead}</span>
                        </div>
                        <p className="text-xs text-slate-500 ml-6">{lead.primaryEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-slate-400" />
                          <span className="text-slate-900">{lead.secondaryLead}</span>
                        </div>
                        <p className="text-xs text-slate-500 ml-6">{lead.secondaryEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {lead.engineers.split(',').map((engineer, idx) => (
                          <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                            <Wrench className="size-3 mr-1" />
                            {engineer.trim()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{lead.assignedDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(lead)}
                        className="text-[#DB0011] hover:text-[#A50010] hover:bg-[#FEF0F1]"
                      >
                        <Edit2 className="size-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#DB0011]">Edit Regional Team</DialogTitle>
            <DialogDescription className="text-slate-600">
              Update primary lead, secondary lead, and engineers for {formData.region}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-primary" className="text-slate-900">Primary Lead Name</Label>
                <Input
                  id="edit-primary"
                  value={formData.primaryLead}
                  onChange={(e) => setFormData({ ...formData, primaryLead: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-primary-email" className="text-slate-900">Primary Lead Email</Label>
                <Input
                  id="edit-primary-email"
                  type="email"
                  value={formData.primaryEmail}
                  onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-secondary" className="text-slate-900">Secondary Lead Name</Label>
                <Input
                  id="edit-secondary"
                  value={formData.secondaryLead}
                  onChange={(e) => setFormData({ ...formData, secondaryLead: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-secondary-email" className="text-slate-900">Secondary Lead Email</Label>
                <Input
                  id="edit-secondary-email"
                  type="email"
                  value={formData.secondaryEmail}
                  onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-engineers" className="text-slate-900">Migration Engineers</Label>
              <Textarea
                id="edit-engineers"
                value={formData.engineers}
                onChange={(e) => setFormData({ ...formData, engineers: e.target.value })}
                rows={3}
              />
              <p className="text-xs text-slate-500">Separate multiple engineer names with commas</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditing(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-[#DB0011] hover:bg-[#A50010]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}