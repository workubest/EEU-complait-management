import React from 'react';
import { format } from 'date-fns';
import { Complaint } from '../../types/complaint';

interface RepairOrderExportProps {
  complaints: Complaint[];
}

export const RepairOrderExport: React.FC<RepairOrderExportProps> = ({ complaints }) => {
  // Ethiopian Electric Utility logo as base64 (embedded for offline HTML viewing)
  const eeuLogoBase64 = "data:image/png;base64,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";

  const generateSingleRepairOrder = (complaint: Complaint, position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    // Safe date formatting with validation
    const formatSafeDate = (dateValue: any, formatString: string, fallback: string = 'N/A') => {
      try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
          return fallback;
        }
        return format(date, formatString);
      } catch (error) {
        console.warn('Date formatting error:', error, 'for value:', dateValue);
        return fallback;
      }
    };

    const reportedDate = formatSafeDate(complaint.reportedAt, 'dd/MM/yyyy', 'N/A');
    const reportedTime = formatSafeDate(complaint.reportedAt, 'HH:mm', 'N/A');
    const updatedDate = formatSafeDate(complaint.updatedAt, 'dd/MM/yyyy HH:mm', 'N/A');
    const status = complaint.status?.toLowerCase() || 'unknown';
    const priority = complaint.priority?.toLowerCase() || 'normal';
    const assignedTo = complaint.assignedTo || 'Unassigned';
    
    const truncateText = (text: string | null | undefined, maxLength: number) => {
      const safeText = text || '';
      return safeText.length > maxLength ? safeText.substring(0, maxLength) + '...' : safeText;
    };
    
    const customerName = truncateText(complaint.customer?.name, 25);
    const customerAddress = truncateText(complaint.customer?.address, 30);
    const customerEmail = truncateText(complaint.customer?.email, 20) || 'N/A';
    const customerPhone = complaint.customer?.phone || 'N/A';
    const damageTitle = truncateText(complaint.title, 30);
    const damageDescription = truncateText(complaint.description, 40);
    const region = truncateText(complaint.region, 20);
    
    return `
      <div class="repair-order repair-order-${position}" style="
        position: absolute;
        width: 48%;
        height: 45%;
        border: 1.5px solid #000;
        padding: 10px;
        font-family: Arial, sans-serif;
        font-size: 10px;
        line-height: 1.3;
        box-sizing: border-box;
        background: white;
        ${position === 'top-left' ? 'top: 2%; left: 1%;' : ''}
        ${position === 'top-right' ? 'top: 2%; right: 1%;' : ''}
        ${position === 'bottom-left' ? 'bottom: 8%; left: 1%;' : ''}
        ${position === 'bottom-right' ? 'bottom: 8%; right: 1%;' : ''}
      ">
        <!-- Ethiopian Electric Utility Logo -->
        <div style="text-align: center; margin-bottom: 8px; border-bottom: 1px solid #000; padding-bottom: 4px;">
          <div style="margin-bottom: 4px;">
            <img src="${eeuLogoBase64}" alt="Ethiopian Electric Utility Logo" style="width: 60px; height: auto; max-height: 40px;">
          </div>
          <div style="font-size: 10px; font-weight: bold; margin-top: 2px;">
            የማደሻ ትእዛዝ - REPAIR ORDER
          </div>
        </div>

        <!-- Complaint Details Row 1 -->
        <div style="margin-bottom: 5px; display: flex; justify-content: space-between;">
          <span style="font-size: 9px;">ቀን/Date: <strong>${reportedDate}</strong></span>
          <span style="font-size: 9px;">ሰዓት/Hour: <strong>${reportedTime}</strong></span>
        </div>

        <!-- Customer Information -->
        <div style="margin-bottom: 5px;">
          <div style="margin-bottom: 3px;">
            <span style="font-size: 9px;">ስም/Name: <strong>${customerName}</strong></span>
          </div>
          <div style="margin-bottom: 3px;">
            <span style="font-size: 9px;">አድራሻ/Address: <strong>${customerAddress}</strong></span>
          </div>
          <div style="margin-bottom: 3px; display: flex; justify-content: space-between;">
            <span style="font-size: 9px;">ስልክ/Tel: <strong>${customerPhone}</strong></span>
            <span style="font-size: 9px;">ክልል/Region: <strong>${region}</strong></span>
          </div>
        </div>

        <!-- System Data -->
        <div style="margin-bottom: 5px; background-color: #f5f5f5; padding: 3px; border-radius: 3px; border: 1px solid #ddd;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span style="font-size: 8px;">ID: <strong>${complaint.id || 'N/A'}</strong></span>
            <span style="font-size: 8px;">Status: <strong>${status.toUpperCase()}</strong></span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span style="font-size: 8px;">Priority: <strong>${priority.toUpperCase()}</strong></span>
            <span style="font-size: 8px;">Email: <strong>${customerEmail}</strong></span>
          </div>
          <div style="font-size: 8px;">
            <span>Assigned: <strong>${assignedTo}</strong></span>
          </div>
        </div>

        <!-- Damage Description -->
        <div style="margin-bottom: 5px; border: 1px solid #ccc; padding: 4px; border-radius: 3px; background-color: #fafafa;">
          <div style="margin-bottom: 3px;">
            <span style="font-size: 9px; font-weight: bold; color: #d32f2f;">የተበላሸው/Damage:</span>
          </div>
          <div style="margin-bottom: 2px;">
            <span style="font-size: 8px;"><strong>${damageTitle}</strong></span>
          </div>
          <div style="font-size: 8px; color: #333;">
            ${damageDescription}
          </div>
        </div>

        <!-- Work Fields -->
        <div style="margin-bottom: 5px;">
          <div style="margin-bottom: 3px; border-bottom: 1px dotted #999; padding-bottom: 2px;">
            <span style="font-size: 8px;">ተረኛ ስልከኛ/Tel.Operator: ________________</span>
          </div>
          <div style="margin-bottom: 3px; border-bottom: 1px dotted #999; padding-bottom: 2px;">
            <span style="font-size: 8px;">ኤሌክትሪሺያን/Electrician: ________________</span>
          </div>
        </div>

        <!-- Completion Fields -->
        <div style="margin-bottom: 5px;">
          <div style="margin-bottom: 3px; display: flex; justify-content: space-between;">
            <span style="font-size: 8px; border-bottom: 1px dotted #999; padding-bottom: 1px;">ተጠናቀቀ/Completed: _______</span>
            <span style="font-size: 8px; border-bottom: 1px dotted #999; padding-bottom: 1px;">ሰዓት/Time: _______</span>
          </div>
        </div>

        <!-- Cause and Remarks -->
        <div style="margin-bottom: 5px;">
          <div style="margin-bottom: 3px; border-bottom: 1px dotted #999; padding-bottom: 2px;">
            <span style="font-size: 8px;">ምክንያት/Cause: _________________________</span>
          </div>
          <div style="border-bottom: 1px dotted #999; padding-bottom: 2px;">
            <span style="font-size: 8px;">አስተያየት/Remark: _______________________</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: right; font-size: 7px; color: #666; margin-top: 3px; border-top: 1px solid #eee; padding-top: 2px;">
          Updated: ${updatedDate} | Priority: ${priority} | Status: ${status}
        </div>
      </div>
    `;
  };

  const generateRepairOrderHTML = (complaints: Complaint[]) => {
    const complaintsPerPage = 4;
    const pages = [];
    
    for (let i = 0; i < complaints.length; i += complaintsPerPage) {
      pages.push(complaints.slice(i, i + complaintsPerPage));
    }

    const positions: ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right')[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

    return pages.map((pageComplaints, pageIndex) => {
      return `
        <div class="page" style="
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
          position: relative;
          page-break-after: ${pageIndex < pages.length - 1 ? 'always' : 'avoid'};
          background: white;
          box-sizing: border-box;
        ">
          ${pageComplaints.map((complaint, index) => 
            generateSingleRepairOrder(complaint, positions[index] || 'top-left')
          ).join('')}
          

        </div>
      `;
    }).join('');
  };

  const handleExport = () => {
    console.log('Starting HTML export...');
    console.log('Complaints count:', complaints.length);
    
    if (complaints.length === 0) {
      alert('No complaints selected for export');
      return;
    }

    try {
      console.log('Generating HTML content...');
      const htmlContent = generateRepairOrderHTML(complaints);
      console.log('HTML content generated, length:', htmlContent.length);
      
      const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ethiopian Electric Utility - Repair Orders</title>
  <style>
    @media print {
      body { margin: 0; padding: 0; }
      .page { page-break-after: always; }
      .page:last-child { page-break-after: avoid; }
    }
    
    * {
      margin: 0;
      padding: 0;
      background: white;
      font-size: 10px;
    }
    
    body {
      font-family: Arial, sans-serif;
      background: white;
    }
    
    .page {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      position: relative;
      background: white;
      box-sizing: border-box;
    }
    
    .page:last-child {
      page-break-after: avoid;
    }
    
    .repair-order {
      position: absolute;
      width: 48%;
      height: 45%;
      border: 1.5px solid #000;
      padding: 10px;
      font-family: Arial, sans-serif;
      font-size: 10px;
      line-height: 1.3;
      box-sizing: border-box;
      page-break-inside: avoid;
      background: white;
    }
    
    .repair-order-top-left {
      top: 2%;
      left: 1%;
    }
    
    .repair-order-top-right {
      top: 2%;
      right: 1%;
    }
    
    .repair-order-bottom-left {
      bottom: 8%;
      left: 1%;
    }
    
    .repair-order-bottom-right {
      bottom: 8%;
      right: 1%;
    }
    
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

      console.log('Creating blob...');
      const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
      console.log('Blob created, size:', blob.size);
      
      // Try different download approach
      console.log('Attempting download...');
      const now = new Date();
      const filename = `ethiopian-electric-repair-orders-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}.html`;
      
      // Method 1: Try standard download
      try {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('Standard download method completed');
        alert('Repair orders exported successfully! Check your downloads folder.');
        return;
      } catch (downloadError) {
        console.error('Standard download failed:', downloadError);
      }
      
      // Method 2: Try data URL approach
      try {
        const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(fullHTML);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Data URL download method completed');
        alert('Repair orders exported successfully! Check your downloads folder.');
        return;
      } catch (dataUrlError) {
        console.error('Data URL download failed:', dataUrlError);
      }
      
      // Method 3: Open in new window as fallback
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(fullHTML);
        newWindow.document.close();
        console.log('Opened in new window as fallback');
        alert('Export opened in new window. Use Ctrl+S to save the file.');
      } else {
        throw new Error('All download methods failed and popup was blocked');
      }
      
    } catch (error) {
      console.error('Detailed error in HTML export:', error);
      console.error('Error stack:', error.stack);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      alert(`Error exporting repair orders: ${error.message}. Check console for details.`);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Export Repair Orders (HTML)
    </button>
  );
};