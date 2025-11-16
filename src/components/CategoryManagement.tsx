import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Edit2, Lock } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  criteria: string;
  vmCount: number;
  strategy: string;
  region: string;
}

const initialCategories: Category[] = [
  {
    id: 'C1',
    name: 'C1',
    description: 'Low complexity VMs',
    criteria: 'Single tier applications, no external dependencies, < 4 CPU cores',
    vmCount: 18,
    strategy: 'Lift and Shift',
    region: 'US-East'
  },
  {
    id: 'C2',
    name: 'C2',
    description: 'Medium complexity VMs',
    criteria: 'Multi-tier applications, moderate dependencies, 4-8 CPU cores',
    vmCount: 22,
    strategy: 'Replatform',
    region: 'EU-Central'
  }
];

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria: '',
    strategy: '',
    region: ''
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      criteria: category.criteria,
      strategy: category.strategy,
      region: category.region
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
    }
    setIsEditing(false);
    setEditingCategory(null);
    resetForm();
  };

  const handleAddNew = () => {
    const newCategory: Category = {
      id: `C${categories.length + 1}`,
      name: formData.name,
      description: formData.description,
      criteria: formData.criteria,
      strategy: formData.strategy,
      region: formData.region,
      vmCount: 0
    };
    setCategories([...categories, newCategory]);
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      criteria: '',
      strategy: '',
      region: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#DB0011]">Category Management</CardTitle>
            <CardDescription className="text-slate-600">
              Define and manage VM categories for migration strategies
            </CardDescription>
          </div>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAdding(true)} className="bg-[#DB0011] hover:bg-[#A50010]">
                <Plus className="size-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-[#DB0011]">Add New Category</DialogTitle>
                <DialogDescription className="text-slate-600">
                  Create a new category with migration criteria and strategy
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-900">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., C3"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-900">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-slate-900">Region</Label>
                  <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
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
                  <Label htmlFor="criteria" className="text-slate-900">Criteria</Label>
                  <Textarea
                    id="criteria"
                    placeholder="Define the criteria for this category"
                    value={formData.criteria}
                    onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strategy" className="text-slate-900">Migration Strategy</Label>
                  <Input
                    id="strategy"
                    placeholder="e.g., Refactor, Replatform"
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsAdding(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button onClick={handleAddNew} className="bg-[#DB0011] hover:bg-[#A50010]">Add Category</Button>
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
                <TableHead className="text-[#DB0011]">Category ID</TableHead>
                <TableHead className="text-[#DB0011]">Description</TableHead>
                <TableHead className="text-[#DB0011]">Region</TableHead>
                <TableHead className="text-[#DB0011]">Criteria</TableHead>
                <TableHead className="text-[#DB0011]">VMs</TableHead>
                <TableHead className="text-[#DB0011]">Strategy</TableHead>
                <TableHead className="text-[#DB0011]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      {category.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-900">{category.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {category.region}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="flex items-start gap-2">
                      <Lock className="size-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{category.criteria}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-700">{category.vmCount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-slate-700">{category.strategy}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
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

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[#DB0011]">Edit Category</DialogTitle>
              <DialogDescription className="text-slate-600">
                Update category criteria and migration strategy
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-slate-900">Category Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-slate-900">Description</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-region" className="text-slate-900">Region</Label>
                <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                  <SelectTrigger id="edit-region">
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
                <Label htmlFor="edit-criteria" className="text-slate-900">Criteria</Label>
                <Textarea
                  id="edit-criteria"
                  value={formData.criteria}
                  onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-strategy" className="text-slate-900">Migration Strategy</Label>
                <Input
                  id="edit-strategy"
                  value={formData.strategy}
                  onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsEditing(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="bg-[#DB0011] hover:bg-[#A50010]">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
