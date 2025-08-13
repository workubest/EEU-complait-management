import React from 'react';
import { HTMLRepairOrderPDFExport } from './HTMLRepairOrderPDFExport';
import { Complaint } from '@/types/complaint';

interface RepairOrderPDFExportProps {
  complaints: Complaint[];
  onExport?: () => void;
}

export function RepairOrderPDFExport({ complaints, onExport }: RepairOrderPDFExportProps) {
  // Use the new HTML-based PDF export for perfect Amharic support
  return <HTMLRepairOrderPDFExport complaints={complaints} onExport={onExport} />;
}