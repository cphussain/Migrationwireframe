import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Card } from './ui/card';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  Database,
  Network,
  HardDrive,
  Cpu,
  MemoryStick,
  FileCheck,
  Calendar
} from 'lucide-react';

interface Phase {
  id: string;
  name: string;
  changeRequest: string;
  region: string;
  category: string;
  vmCount: number;
  scheduledDate: string;
  status: string;
}

interface ReadinessCheckDialogProps {
  phaseName: string;
  vmCount: number;
  isOpen: boolean;
  onClose: () => void;
}

interface ValidationResult {
  category: string;
  icon: any;
  status: 'passed' | 'warning' | 'failed' | 'checking';
  message: string;
  details?: string;
}

export function ReadinessCheckDialog({ phaseName, vmCount, isOpen, onClose }: ReadinessCheckDialogProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const [validations, setValidations] = useState<ValidationResult[]>([]);

  useEffect(() => {
    if (isOpen) {
      performReadinessCheck();
    } else {
      // Reset state when dialog closes
      setIsChecking(false);
      setCheckComplete(false);
      setValidations([]);
    }
  }, [isOpen]);

  const performReadinessCheck = async () => {
    setIsChecking(true);
    setCheckComplete(false);

    // Initialize validation checks
    const checks: ValidationResult[] = [
      {
        category: 'Capacity Validation',
        icon: HardDrive,
        status: 'checking',
        message: 'Checking datacenter capacity...',
      },
      {
        category: 'Network Connectivity',
        icon: Network,
        status: 'checking',
        message: 'Validating network dependencies...',
      },
      {
        category: 'Storage Availability',
        icon: Database,
        status: 'checking',
        message: 'Verifying storage resources...',
      },
      {
        category: 'Compute Resources',
        icon: Cpu,
        status: 'checking',
        message: 'Checking compute allocation...',
      },
      {
        category: 'Memory Resources',
        icon: MemoryStick,
        status: 'checking',
        message: 'Validating memory availability...',
      },
      {
        category: 'Data Validation',
        icon: FileCheck,
        status: 'checking',
        message: 'Verifying latest VM inventory data...',
      },
    ];

    setValidations([...checks]);

    // Simulate checking each validation sequentially
    for (let i = 0; i < checks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate results based on phase data
      const result = simulateValidation(checks[i].category, vmCount);
      checks[i] = result;
      
      setValidations([...checks]);
    }

    setIsChecking(false);
    setCheckComplete(true);
  };

  const simulateValidation = (category: string, vmCount: number): ValidationResult => {
    
    switch (category) {
      case 'Capacity Validation':
        // Check if VM count is reasonable
        if (vmCount > 200) {
          return {
            category,
            icon: HardDrive,
            status: 'warning',
            message: 'High VM count detected',
            details: `Phase requires ${vmCount} VMs. Consider splitting into smaller batches.`,
          };
        }
        return {
          category,
          icon: HardDrive,
          status: 'passed',
          message: 'Datacenter capacity validated',
          details: `Sufficient capacity for ${vmCount} VMs in ${phaseName}`,
        };

      case 'Network Connectivity':
        return {
          category,
          icon: Network,
          status: 'passed',
          message: 'Network dependencies validated',
          details: 'All required network paths and dependencies are available',
        };

      case 'Storage Availability':
        const storageNeeded = Math.round((vmCount * 100) / 1024 * 10) / 10;
        return {
          category,
          icon: Database,
          status: 'passed',
          message: 'Storage resources available',
          details: `${storageNeeded} TB required, sufficient storage available`,
        };

      case 'Compute Resources':
        const coresNeeded = vmCount * 4;
        if (coresNeeded > 800) {
          return {
            category,
            icon: Cpu,
            status: 'warning',
            message: 'High compute requirement',
            details: `${coresNeeded} cores needed. Ensure cluster capacity before migration.`,
          };
        }
        return {
          category,
          icon: Cpu,
          status: 'passed',
          message: 'Compute resources validated',
          details: `${coresNeeded} cores available for allocation`,
        };

      case 'Memory Resources':
        const memoryNeeded = vmCount * 8;
        return {
          category,
          icon: MemoryStick,
          status: 'passed',
          message: 'Memory resources validated',
          details: `${memoryNeeded} GB RAM available for allocation`,
        };

      case 'Data Validation':
        // Simulate checking if inventory data is up to date
        const lastUpdated = new Date();
        lastUpdated.setHours(lastUpdated.getHours() - 2);
        return {
          category,
          icon: FileCheck,
          status: 'passed',
          message: 'VM inventory data is current',
          details: `Last updated: ${lastUpdated.toLocaleString()}`,
        };

      default:
        return {
          category,
          icon: AlertTriangle,
          status: 'failed',
          message: 'Unknown validation',
        };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="size-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="size-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="size-5 text-red-600" />;
      case 'checking':
        return <Loader2 className="size-5 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-700 border-green-300">Passed</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Warning</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 border-red-300">Failed</Badge>;
      case 'checking':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-300">Checking...</Badge>;
      default:
        return null;
    }
  };

  const overallStatus = checkComplete
    ? validations.some(v => v.status === 'failed')
      ? 'failed'
      : validations.some(v => v.status === 'warning')
      ? 'warning'
      : 'passed'
    : 'checking';

  const passedCount = validations.filter(v => v.status === 'passed').length;
  const totalCount = validations.length;
  const progressPercent = (passedCount / totalCount) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="size-6 text-[#DB0011]" />
            Migration Readiness Check
          </DialogTitle>
          <DialogDescription>
            Validating dependencies and resources for phase migration
          </DialogDescription>
        </DialogHeader>

        {/* Phase Information */}
        <Card className="p-4 bg-slate-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Phase Name</p>
              <p className="text-slate-900">{phaseName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">VM Count</p>
              <p className="text-slate-900">{vmCount} VMs</p>
            </div>
          </div>
        </Card>

        {/* Overall Status */}
        {checkComplete && (
          <Card className={`p-4 ${
            overallStatus === 'passed' 
              ? 'bg-green-50 border-green-200' 
              : overallStatus === 'warning'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {getStatusIcon(overallStatus)}
              <div className="flex-1">
                <h4 className={`${
                  overallStatus === 'passed'
                    ? 'text-green-900'
                    : overallStatus === 'warning'
                    ? 'text-yellow-900'
                    : 'text-red-900'
                }`}>
                  {overallStatus === 'passed'
                    ? '✓ All Checks Passed'
                    : overallStatus === 'warning'
                    ? '⚠ Warnings Detected'
                    : '✗ Failed Checks'}
                </h4>
                <p className={`text-sm mt-1 ${
                  overallStatus === 'passed'
                    ? 'text-green-700'
                    : overallStatus === 'warning'
                    ? 'text-yellow-700'
                    : 'text-red-700'
                }`}>
                  {overallStatus === 'passed'
                    ? 'Phase is ready for migration. All dependencies validated.'
                    : overallStatus === 'warning'
                    ? 'Phase can proceed but review warnings before migration.'
                    : 'Phase has failed checks. Address issues before proceeding.'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Progress Bar */}
        {isChecking && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Validation Progress</span>
              <span className="text-slate-900">{passedCount} of {totalCount} checks</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {/* Validation Results */}
        <div className="space-y-3">
          <h4 className="text-slate-900">Validation Results</h4>
          {validations.map((validation, index) => {
            const Icon = validation.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon className={`size-5 ${
                      validation.status === 'passed'
                        ? 'text-green-600'
                        : validation.status === 'warning'
                        ? 'text-yellow-600'
                        : validation.status === 'failed'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-slate-900 text-sm">{validation.category}</h5>
                      {getStatusBadge(validation.status)}
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{validation.message}</p>
                    {validation.details && (
                      <p className="text-xs text-slate-500">{validation.details}</p>
                    )}
                  </div>
                  {getStatusIcon(validation.status)}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Last checked: {new Date().toLocaleString()}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onClose()}
            >
              Close
            </Button>
            {checkComplete && (
              <Button
                onClick={performReadinessCheck}
                className="bg-[#DB0011] hover:bg-[#B00010]"
              >
                Re-run Check
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}