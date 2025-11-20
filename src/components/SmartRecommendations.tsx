import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Sparkles, TrendingUp, Clock, AlertCircle, CheckCircle2, ChevronRight, Lightbulb, Monitor } from 'lucide-react';
import { generateRecommendedPhases, getPhaseRecommendationSummary, type RecommendedPhase } from '../services/migrationRecommendations';
import { getVMInventory, type VM } from '../data/mockApi';
import { LoadingSpinner } from './LoadingSpinner';

interface SmartRecommendationsProps {
  onAcceptPhase?: (phase: RecommendedPhase) => void;
}

export function SmartRecommendations({ onAcceptPhase }: SmartRecommendationsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [vms, setVMs] = useState<VM[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedPhase[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<RecommendedPhase | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchDataAndGenerateRecommendations = async () => {
      setIsLoading(true);
      const vmData = await getVMInventory();
      setVMs(vmData);
      
      const recommendedPhases = generateRecommendedPhases(vmData);
      setRecommendations(recommendedPhases);
      
      setIsLoading(false);
    };

    fetchDataAndGenerateRecommendations();
  }, []);

  const handleViewDetails = (phase: RecommendedPhase) => {
    setSelectedPhase(phase);
    setShowDetails(true);
  };

  const handleAcceptPhase = (phase: RecommendedPhase) => {
    if (onAcceptPhase) {
      onAcceptPhase(phase);
    }
    setShowDetails(false);
  };

  const summary = recommendations.length > 0 ? getPhaseRecommendationSummary(vms) : null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Moderate': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Complex': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-[#DB0011] border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="size-6 text-[#DB0011]" />
            <div>
              <CardTitle className="text-[#DB0011]">AI-Powered Migration Recommendations</CardTitle>
              <CardDescription className="text-slate-600">
                Intelligent phase suggestions based on complexity, risk, and best practices
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        {summary && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="size-8 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">Recommended Phases</p>
                  <p className="text-slate-900">{summary.totalPhases} phases</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Clock className="size-8 text-green-600" />
                <div>
                  <p className="text-sm text-slate-600">Estimated Duration</p>
                  <p className="text-slate-900">
                    {recommendations.reduce((sum, p) => {
                      const days = parseInt(p.estimatedDuration);
                      return sum + (isNaN(days) ? 0 : days);
                    }, 0)} days total
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm text-slate-900">Key Insights:</p>
                  {summary.keyInsights.map((insight, index) => (
                    <p key={index} className="text-sm text-slate-700">• {insight}</p>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Recommended Phases Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#DB0011]">Recommended Migration Phases</CardTitle>
          <CardDescription className="text-slate-600">
            Phases are ordered by priority and complexity. Start with high-priority, simple phases first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#DB0011]">#</TableHead>
                  <TableHead className="text-[#DB0011]">Phase Name</TableHead>
                  <TableHead className="text-[#DB0011]">Region</TableHead>
                  <TableHead className="text-[#DB0011]">Category</TableHead>
                  <TableHead className="text-[#DB0011]">Priority</TableHead>
                  <TableHead className="text-[#DB0011]">Complexity</TableHead>
                  <TableHead className="text-[#DB0011]">VMs</TableHead>
                  <TableHead className="text-[#DB0011]">Duration</TableHead>
                  <TableHead className="text-[#DB0011]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-slate-500 py-8">
                      No recommendations available
                    </TableCell>
                  </TableRow>
                ) : (
                  recommendations.map((phase, index) => (
                    <TableRow key={phase.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center justify-center size-8 bg-[#DB0011] text-white rounded-full">
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-900">{phase.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {phase.region}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {phase.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPriorityColor(phase.priority)}>
                          {phase.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getComplexityColor(phase.complexity)}>
                          {phase.complexity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700">{phase.vms.length}</TableCell>
                      <TableCell className="text-slate-700">{phase.estimatedDuration}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(phase)}
                          className="text-[#DB0011] hover:bg-red-50"
                        >
                          View Details
                          <ChevronRight className="size-4 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Phase Details Dialog */}
      {selectedPhase && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#DB0011] flex items-center gap-2">
                <Sparkles className="size-5" />
                {selectedPhase.name}
              </DialogTitle>
              <DialogDescription>
                Detailed analysis and recommendations for this migration phase
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Phase Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Priority</p>
                  <Badge variant="outline" className={getPriorityColor(selectedPhase.priority)}>
                    {selectedPhase.priority}
                  </Badge>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Complexity</p>
                  <Badge variant="outline" className={getComplexityColor(selectedPhase.complexity)}>
                    {selectedPhase.complexity}
                  </Badge>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Total VMs</p>
                  <p className="text-slate-900">{selectedPhase.vms.length}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Est. Duration</p>
                  <p className="text-slate-900">{selectedPhase.estimatedDuration}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-900">Why this phase?</p>
                    <p className="text-sm text-slate-700 mt-1">{selectedPhase.reason}</p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 mb-2">Recommendations:</p>
                    <ul className="space-y-1">
                      {selectedPhase.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-slate-700">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* VM List */}
              <div>
                <h4 className="text-slate-900 mb-3">VMs in this Phase ({selectedPhase.vms.length})</h4>
                <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>VM Name</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>CPU</TableHead>
                        <TableHead>Memory</TableHead>
                        <TableHead>Storage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPhase.vms.map((vm) => (
                        <TableRow key={vm.id}>
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
                          <TableCell className="text-slate-700">{vm.serviceName}</TableCell>
                          <TableCell className="text-slate-700">{vm.cpu} vCPU</TableCell>
                          <TableCell className="text-slate-700">{vm.memory} GB</TableCell>
                          <TableCell className="text-slate-700">{vm.storage} GB</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Close
              </Button>
              {onAcceptPhase && (
                <Button 
                  onClick={() => handleAcceptPhase(selectedPhase)}
                  className="bg-[#DB0011] hover:bg-[#A50010] text-white"
                >
                  <CheckCircle2 className="size-4 mr-2" />
                  Use This Phase
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}