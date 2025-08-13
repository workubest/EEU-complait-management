import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Complaint } from '@/types/complaint';
import { format } from 'date-fns';

interface HTMLRepairOrderPDFExportProps {
  complaints: Complaint[];
  onExport?: () => void;
}

export function HTMLRepairOrderPDFExport({ complaints, onExport }: HTMLRepairOrderPDFExportProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Safe date formatting function
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

  // Safe text truncation function
  const truncateText = (text: string | null | undefined, maxLength: number) => {
    const safeText = text || '';
    return safeText.length > maxLength ? safeText.substring(0, maxLength) + '...' : safeText;
  };

  // Ethiopian Electric Utility logo as base64
  const eeuLogoBase64 = "data:image/png;base64,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";

  const generateHTMLPDF = async () => {
    if (isGenerating) return; // Prevent multiple simultaneous generations
    
    try {
      setIsGenerating(true);
      console.log('Starting PDF generation...');
      console.log('Browser info:', {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      });
      
      // Check if we have complaints
      if (!complaints || complaints.length === 0) {
        alert('No repair orders to export. Please add some complaints first.');
        setIsGenerating(false);
        return;
      }

      // Check if printRef is available
      if (!printRef.current) {
        console.error('Print reference not available');
        alert('PDF generation failed: Print reference not available. Please try again.');
        setIsGenerating(false);
        return;
      }

      console.log('Loading libraries...');
      // Import html2canvas and jsPDF dynamically
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      console.log('Libraries loaded successfully');

      console.log('Generating PDF with multiple pages...');
      
      // Create PDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      console.log('PDF dimensions:', pdfWidth, 'x', pdfHeight);
      
      // Get all page elements
      const pageElements = printRef.current.children;
      console.log('Found', pageElements.length, 'pages to process');
      
      // Process each page separately
      for (let pageIndex = 0; pageIndex < pageElements.length; pageIndex++) {
        const pageElement = pageElements[pageIndex] as HTMLElement;
        console.log(`Processing page ${pageIndex + 1}/${pageElements.length}...`);
        
        // Generate canvas for this page
        const canvas = await html2canvas(pageElement, {
          scale: 2, // Higher resolution
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: pageElement.scrollWidth,
          height: pageElement.scrollHeight,
          scrollX: 0,
          scrollY: 0,
          logging: false,
        });
        
        console.log(`Page ${pageIndex + 1} canvas:`, canvas.width, 'x', canvas.height);
        
        // Convert to image data
        const imgData = canvas.toDataURL('image/png');
        
        // Add new page if not the first page
        if (pageIndex > 0) {
          pdf.addPage();
        }
        
        // Calculate scaling to fit A4 page
        const imgWidth = canvas.width * 0.264583; // Convert pixels to mm
        const imgHeight = canvas.height * 0.264583;
        
        // Scale to fit page while maintaining aspect ratio
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const scaledWidth = imgWidth * ratio;
        const scaledHeight = imgHeight * ratio;
        
        // Center the image on the page
        const x = (pdfWidth - scaledWidth) / 2;
        const y = (pdfHeight - scaledHeight) / 2;
        
        console.log(`Adding page ${pageIndex + 1} to PDF at position:`, x, y, 'size:', scaledWidth, 'x', scaledHeight);
        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
      }
      
      console.log('All pages processed successfully!');
      
      // Generate filename with timestamp
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const filename = `EEU_Repair_Orders_${timestamp}.pdf`;
      
      console.log('Saving PDF as:', filename);
      
      // Try different save methods for better browser compatibility
      let downloadSuccess = false;
      
      // Method 1: Standard jsPDF save
      try {
        pdf.save(filename);
        console.log('PDF saved successfully using pdf.save()!');
        downloadSuccess = true;
      } catch (saveError) {
        console.warn('pdf.save() failed, trying alternative methods:', saveError);
      }
      
      // Method 2: Blob download (if Method 1 failed)
      if (!downloadSuccess) {
        try {
          const pdfBlob = pdf.output('blob');
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          console.log('PDF saved successfully using blob method!');
          downloadSuccess = true;
        } catch (blobError) {
          console.warn('Blob method failed, trying data URI method:', blobError);
        }
      }
      
      // Method 3: Data URI download (if Methods 1 & 2 failed)
      if (!downloadSuccess) {
        try {
          const pdfDataUri = pdf.output('datauristring');
          const link = document.createElement('a');
          link.href = pdfDataUri;
          link.download = filename;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log('PDF saved successfully using data URI method!');
          downloadSuccess = true;
        } catch (dataUriError) {
          console.error('All download methods failed:', dataUriError);
          throw new Error('Unable to download PDF. Please check browser settings and try again.');
        }
      }
      
      // Show success message
      console.log('PDF generation completed successfully!');
      alert(`✅ PDF generated successfully!\n\nFile: ${filename}\n\nThe PDF should start downloading automatically. If not, please check your browser's download settings.`);
      
      if (onExport) {
        onExport();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error stack:', error.stack);
      alert(`Error generating PDF: ${error.message}. Please check the console for more details and try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const RepairOrderCard = ({ complaint, index }: { complaint: Complaint; index: number }) => {
    // Safe data extraction
    const reportedDate = formatSafeDate(complaint.reportedAt || complaint.createdAt, 'dd/MM/yyyy', 'N/A');
    const reportedTime = formatSafeDate(complaint.reportedAt || complaint.createdAt, 'HH:mm', 'N/A');
    const updatedDate = formatSafeDate(complaint.updatedAt, 'dd/MM/yyyy HH:mm', 'N/A');
    
    const customerName = truncateText(complaint.customer?.name, 25);
    const customerAddress = truncateText(complaint.customer?.address, 30);
    const customerPhone = complaint.customer?.phone || 'N/A';
    const customerEmail = truncateText(complaint.customer?.email, 20) || 'N/A';
    const region = truncateText(complaint.region, 15);
    
    const priority = complaint.priority?.toLowerCase() || 'medium';
    const status = complaint.status?.toLowerCase() || 'open';
    const assignedTo = truncateText(complaint.assignedTo, 20) || 'Not Assigned';
    
    const damageTitle = truncateText(complaint.title, 35);
    const damageDescription = truncateText(complaint.description, 60);

    return (
      <div className="repair-order-card" style={{
        width: '100%',
        height: '130mm', // Fixed height for consistent 2x2 grid
        border: '2px solid #ddd',
        borderRadius: '8px',
        padding: '8mm',
        backgroundColor: '#ffffff',
        fontFamily: '"Noto Sans Ethiopic", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        fontSize: '10px',
        lineHeight: '1.2',
        pageBreakInside: 'avoid',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header with Logo */}
        <div style={{ textAlign: 'center', marginBottom: '8px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
          <img 
            src={eeuLogoBase64} 
            alt="EEU Logo" 
            style={{ width: '40px', height: '24px', marginBottom: '4px' }}
          />
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#000' }}>
            የማደሻ ትእዛዝ - REPAIR ORDER
          </div>
        </div>

        {/* Date and Time */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span><strong>ቀን/Date:</strong> {reportedDate}</span>
          <span><strong>ሰዓት/Hour:</strong> {reportedTime}</span>
        </div>

        {/* Customer Information */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ marginBottom: '3px' }}>
            <strong>ስም/Name:</strong> {customerName}
          </div>
          <div style={{ marginBottom: '3px' }}>
            <strong>አድራሻ/Address:</strong> {customerAddress}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span><strong>ስልክ/Tel:</strong> {customerPhone}</span>
            <span><strong>ክልል/Region:</strong> {region}</span>
          </div>
        </div>

        {/* System Data Box */}
        <div style={{
          backgroundColor: '#f5f5f5',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '6px',
          marginBottom: '8px',
          fontSize: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span><strong>ID:</strong> {complaint.id || 'N/A'}</span>
            <span><strong>Status:</strong> {status.toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span><strong>Priority:</strong> {priority.toUpperCase()}</span>
            <span><strong>Email:</strong> {customerEmail}</span>
          </div>
          <div>
            <strong>Assigned:</strong> {assignedTo}
          </div>
        </div>

        {/* Damage Description Box */}
        <div style={{
          backgroundColor: '#fafafa',
          border: '2px solid #E67E22',
          borderRadius: '4px',
          padding: '8px',
          marginBottom: '8px'
        }}>
          <div style={{ fontWeight: 'bold', color: '#E67E22', marginBottom: '4px' }}>
            የተበላሸው/Damage:
          </div>
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
            {damageTitle}
          </div>
          <div style={{ fontSize: '10px' }}>
            {damageDescription}
          </div>
        </div>

        {/* Work Fields */}
        <div style={{ marginBottom: '8px', fontSize: '10px' }}>
          <div style={{ marginBottom: '4px' }}>
            <strong>ተረኛ ስልከኛ/Tel.Operator:</strong> ________________
          </div>
          <div style={{ marginBottom: '6px' }}>
            <strong>ኤሌክትሪሺያን/Electrician:</strong> ________________
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span><strong>ተጠናቀቀ/Completed:</strong> _______</span>
            <span><strong>ሰዓት/Time:</strong> _______</span>
          </div>
          
          <div style={{ marginBottom: '4px' }}>
            <strong>ምክንያት/Cause:</strong> _________________________
          </div>
          <div style={{ marginBottom: '6px' }}>
            <strong>አስተያየት/Remark:</strong> _______________________
          </div>
        </div>

        {/* Footer */}
        <div style={{
          fontSize: '8px',
          color: '#666',
          borderTop: '1px solid #eee',
          paddingTop: '4px',
          textAlign: 'center'
        }}>
          Updated: {updatedDate} | Priority: {priority} | Status: {status}
        </div>
      </div>
    );
  };

  // Split complaints into pages of 4
  const complaintsPerPage = 4;
  const pages = [];
  for (let i = 0; i < complaints.length; i += complaintsPerPage) {
    pages.push(complaints.slice(i, i + complaintsPerPage));
  }

  const PageHeader = ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => (
    <div style={{ 
      textAlign: 'center', 
      marginBottom: '15px',
      borderBottom: '2px solid #E67E22',
      paddingBottom: '10px'
    }}>
      <img 
        src={eeuLogoBase64} 
        alt="EEU Logo" 
        style={{ width: '60px', height: '36px', marginBottom: '8px' }}
      />
      <h1 style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        margin: '0',
        color: '#E67E22'
      }}>
        Ethiopian Electric Utility - የማደሻ ትእዛዝ - REPAIR ORDERS
      </h1>
      <p style={{ 
        fontSize: '12px', 
        margin: '4px 0 0 0', 
        color: '#666' 
      }}>
        Generated: {format(new Date(), 'dd/MM/yyyy HH:mm')} | Total Complaints: {complaints.length} | Page {pageNumber} of {totalPages}
      </p>
    </div>
  );

  const PageFooter = ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => (
    <div style={{
      marginTop: '20px',
      textAlign: 'center',
      fontSize: '10px',
      color: '#666',
      borderTop: '1px solid #ddd',
      paddingTop: '8px'
    }}>
      Ethiopian Electric Utility - Official Repair Orders | Page {pageNumber} of {totalPages} | Generated with Perfect Amharic Support
    </div>
  );

  return (
    <div>
      <Button
        onClick={generateHTMLPDF}
        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
        disabled={complaints.length === 0 || isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Export Repair Orders (HTML to PDF)
          </>
        )}
      </Button>

      {/* Hidden printable content - Multiple Pages */}
      <div 
        ref={printRef} 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: '-9999px',
          backgroundColor: '#ffffff',
          fontFamily: '"Noto Sans Ethiopic", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        }}
      >
        {pages.map((pageComplaints, pageIndex) => (
          <div
            key={pageIndex}
            style={{
              width: '210mm', // A4 width
              minHeight: '297mm', // A4 height
              padding: '10mm',
              pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Page Header */}
            <PageHeader pageNumber={pageIndex + 1} totalPages={pages.length} />

            {/* Repair Orders Grid - 2x2 layout for 4 complaints */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '8mm',
              flex: 1,
              alignContent: 'start'
            }}>
              {pageComplaints.map((complaint, index) => (
                <RepairOrderCard 
                  key={complaint.id || `${pageIndex}-${index}`} 
                  complaint={complaint} 
                  index={pageIndex * complaintsPerPage + index} 
                />
              ))}
            </div>

            {/* Page Footer */}
            <PageFooter pageNumber={pageIndex + 1} totalPages={pages.length} />
          </div>
        ))}
      </div>
    </div>
  );
}