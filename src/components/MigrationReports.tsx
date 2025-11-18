import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UserSession {
  username: string;
  role: string;
  region?: string;
}

interface MigrationReportsProps {
  userSession: UserSession;
}

const regionData = [
  { region: 'US-East', total: 15, completed: 8, inProgress: 5, notStarted: 2 },
  { region: 'US-West', total: 12, completed: 4, inProgress: 6, notStarted: 2 },
  { region: 'EU-Central', total: 18, completed: 10, inProgress: 6, notStarted: 2 },
  { region: 'APAC', total: 5, completed: 1, inProgress: 2, notStarted: 2 }
];

const phaseData = [
  { phase: 'Phase 1', region: 'US-East', vms: 5, assignedTo: 'John Doe', progress: 80 },
  { phase: 'Phase 2', region: 'EU-Central', vms: 8, assignedTo: 'Jane Smith', progress: 25 },
  { phase: 'Phase 3', region: 'US-West', vms: 6, assignedTo: 'Mike Johnson', progress: 100 },
  { phase: 'Phase 4', region: 'APAC', vms: 3, assignedTo: 'Sarah Lee', progress: 50 }
];

const statusData = [
  { name: 'Completed', value: 23, color: '#10b981' },
  { name: 'In Progress', value: 19, color: '#DB0011' },
  { name: 'Not Started', value: 8, color: '#94a3b8' }
];

export function MigrationReports({ userSession }: MigrationReportsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-600">Total VMs</CardDescription>
            <CardTitle className="text-slate-900">50</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Across all regions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-600">Completed</CardDescription>
            <CardTitle className="text-green-600">23</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">46% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-600">In Progress</CardDescription>
            <CardTitle className="text-[#DB0011]">19</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">38% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-600">Not Started</CardDescription>
            <CardTitle className="text-slate-600">8</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">16% of total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#DB0011]">Region-wise Migration Status</CardTitle>
            <CardDescription className="text-slate-600">VMs status breakdown by region</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="inProgress" fill="#DB0011" name="In Progress" />
                <Bar dataKey="notStarted" fill="#94a3b8" name="Not Started" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#DB0011]">Overall Migration Status</CardTitle>
            <CardDescription className="text-slate-600">Distribution of VM migration status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#DB0011]">Region-wise Detailed Status</CardTitle>
          <CardDescription className="text-slate-600">Complete breakdown of VMs by region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#DB0011]">Region</TableHead>
                  <TableHead className="text-[#DB0011]">Total VMs</TableHead>
                  <TableHead className="text-[#DB0011]">Completed</TableHead>
                  <TableHead className="text-[#DB0011]">In Progress</TableHead>
                  <TableHead className="text-[#DB0011]">Not Started</TableHead>
                  <TableHead className="text-[#DB0011]">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regionData.map((region) => {
                  const progressPercent = Math.round((region.completed / region.total) * 100);
                  return (
                    <TableRow key={region.region}>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {region.region}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-900">{region.total}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {region.completed}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-50 text-[#DB0011] border-red-200">
                          {region.inProgress}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-100 text-slate-800">
                          {region.notStarted}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={progressPercent} className="flex-1" />
                          <span className="text-sm text-slate-600 w-12">{progressPercent}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#DB0011]">Phase-wise Migration Tracking</CardTitle>
          <CardDescription className="text-slate-600">Track which phases are being worked on and by whom</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#DB0011]">Phase</TableHead>
                  <TableHead className="text-[#DB0011]">Region</TableHead>
                  <TableHead className="text-[#DB0011]">Number of VMs</TableHead>
                  <TableHead className="text-[#DB0011]">Assigned To</TableHead>
                  <TableHead className="text-[#DB0011]">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {phaseData.map((phase) => (
                  <TableRow key={phase.phase}>
                    <TableCell className="text-slate-900">{phase.phase}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {phase.region}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-700">{phase.vms}</TableCell>
                    <TableCell className="text-slate-700">{phase.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={phase.progress} className="flex-1" />
                        <span className="text-sm text-slate-600 w-12">{phase.progress}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}