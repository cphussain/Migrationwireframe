import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface MigrationProgressProps {
  phaseName: string;
  vmCount: number;
  isOpen: boolean;
  onClose: () => void;
}

const migrationSteps = [
  { id: 1, name: 'Pre-Migration Validation', description: 'Validating VM configurations and compatibility' },
  { id: 2, name: 'Source VM Preparation', description: 'Installing migration tools on source VMs' },
  { id: 3, name: 'Network Configuration', description: 'Setting up network mappings and security' },
  { id: 4, name: 'Storage Migration', description: 'Transferring VM disks to OpenShift' },
  { id: 5, name: 'VM Conversion', description: 'Converting VMware VMs to containerized workloads' },
  { id: 6, name: 'Post-Migration Testing', description: 'Validating migrated VMs functionality' },
  { id: 7, name: 'Cutover & Verification', description: 'Final cutover and connectivity checks' }
];

export function MigrationProgress({ phaseName, vmCount, isOpen, onClose }: MigrationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setOverallProgress(0);
      setIsCompleted(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < migrationSteps.length - 1) {
          return prev + 1;
        } else {
          setIsCompleted(true);
          clearInterval(interval);
          return prev;
        }
      });

      setOverallProgress(prev => {
        const newProgress = Math.min(prev + (100 / migrationSteps.length), 100);
        return newProgress;
      });
    }, 3000); // Each step takes 3 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'in-progress';
    return 'pending';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#DB0011]">
            MTV Migration in Progress
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Phase: {phaseName} • {vmCount} VMs being migrated using Migration Toolkit for Virtualization
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-900">Overall Migration Progress</span>
              <span className="text-slate-600">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            {isCompleted && (
              <div className="flex items-center gap-2 text-green-600 mt-2">
                <CheckCircle2 className="size-5" />
                <span>Migration completed successfully!</span>
              </div>
            )}
          </div>

          {/* Migration Steps */}
          <div className="space-y-1">
            <h3 className="text-slate-900 mb-4">Migration Steps</h3>
            <div className="space-y-3">
              {migrationSteps.map((step, index) => {
                const status = getStepStatus(index);
                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border ${
                      status === 'completed' 
                        ? 'bg-green-50 border-green-200' 
                        : status === 'in-progress'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="mt-0.5">
                      {status === 'completed' && (
                        <CheckCircle2 className="size-6 text-green-600" />
                      )}
                      {status === 'in-progress' && (
                        <Loader2 className="size-6 text-blue-600 animate-spin" />
                      )}
                      {status === 'pending' && (
                        <Circle className="size-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-slate-900">{step.name}</h4>
                        <Badge
                          variant="outline"
                          className={
                            status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }
                        >
                          {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Migration Details */}
          <div className="bg-slate-50 p-4 rounded-lg border space-y-2">
            <h4 className="text-slate-900">Migration Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Migration Tool:</span>
                <span className="text-slate-900 ml-2">MTV (Migration Toolkit for Virtualization)</span>
              </div>
              <div>
                <span className="text-slate-600">VMs in Phase:</span>
                <span className="text-slate-900 ml-2">{vmCount}</span>
              </div>
              <div>
                <span className="text-slate-600">Migration Type:</span>
                <span className="text-slate-900 ml-2">Cold Migration</span>
              </div>
              <div>
                <span className="text-slate-600">Target Platform:</span>
                <span className="text-slate-900 ml-2">OpenShift Virtualization</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
