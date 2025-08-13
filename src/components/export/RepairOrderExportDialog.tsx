import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Globe, Printer, CheckCircle } from 'lucide-react';
import { Complaint } from '@/types/complaint';
import { RepairOrderExport } from './RepairOrderExport';
import { RepairOrderPDFExport } from './RepairOrderPDFExport';
import { useLanguage } from '@/contexts/LanguageContext';

interface RepairOrderExportDialogProps {
  complaints: Complaint[];
  selectedComplaints?: string[];
  onExport?: () => void;
}

export function RepairOrderExportDialog({ 
  complaints, 
  selectedComplaints = [], 
  onExport 
}: RepairOrderExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  // Filter complaints based on selection
  const complaintsToExport = selectedComplaints.length > 0 
    ? complaints.filter(c => selectedComplaints.includes(c.id))
    : complaints;

  const totalPages = Math.ceil(complaintsToExport.length / 4);

  const handleExportComplete = () => {
    setIsOpen(false);
    onExport?.();
  };

  const ExportPreview = () => (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          Export Summary
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Complaints:</span>
            <Badge variant="secondary" className="ml-2">
              {complaintsToExport.length}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground">Total Pages:</span>
            <Badge variant="secondary" className="ml-2">
              {totalPages}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground">Format:</span>
            <span className="ml-2">4 complaints per page</span>
          </div>
          <div>
            <span className="text-muted-foreground">Language:</span>
            <span className="ml-2">Amharic & English</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Export Options:</h4>
        
        <div className="grid gap-3">
          {/* PDF Export */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-red-600" />
              <div>
                <div className="font-medium">PDF Format</div>
                <div className="text-sm text-muted-foreground">
                  Professional print-ready format
                </div>
              </div>
            </div>
            <RepairOrderPDFExport 
              complaints={complaintsToExport}
              onExport={handleExportComplete}
            />
          </div>

          {/* HTML Export */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">HTML Format</div>
                <div className="text-sm text-muted-foreground">
                  Web format with auto-print option
                </div>
              </div>
            </div>
            <RepairOrderExport 
              complaints={complaintsToExport}
              onExport={handleExportComplete}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="text-sm text-muted-foreground space-y-2">
        <div className="flex items-center">
          <Printer className="h-4 w-4 mr-2" />
          <span>Forms are optimized for A4 paper printing</span>
        </div>
        <div>
          <strong>Format Details:</strong>
          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
            <li>Each repair order includes customer details, damage description, and completion fields</li>
            <li>Bilingual format (Amharic and English)</li>
            <li>4 repair orders per page for efficient paper usage</li>
            <li>Professional border and layout for official use</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-2"
          disabled={complaintsToExport.length === 0}
        >
          <Download className="h-4 w-4" />
          <span>Repair Orders</span>
          {complaintsToExport.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {complaintsToExport.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Repair Orders
          </DialogTitle>
          <DialogDescription>
            Generate repair order forms in the official Ethiopian Electric Utility format.
            Each form includes customer details, damage description, and completion fields.
          </DialogDescription>
        </DialogHeader>

        <ExportPreview />
      </DialogContent>
    </Dialog>
  );
}

export default RepairOrderExportDialog;