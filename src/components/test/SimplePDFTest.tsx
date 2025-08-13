import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

export function SimplePDFTest() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const testBasicPDF = async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      setTestResults([]);
      addResult('🚀 Starting basic PDF test...');

      // Test 1: Check if jsPDF can be imported
      addResult('📦 Testing jsPDF import...');
      const { jsPDF } = await import('jspdf');
      addResult('✅ jsPDF imported successfully');

      // Test 2: Create a simple PDF
      addResult('📄 Creating simple PDF...');
      const pdf = new jsPDF();
      addResult('✅ PDF instance created');

      // Test 3: Add simple text
      addResult('✏️ Adding text to PDF...');
      pdf.text('Hello World!', 20, 20);
      pdf.text('Simple PDF Test', 20, 40);
      pdf.text('Ethiopian Electric Utility', 20, 60);
      addResult('✅ Text added to PDF');

      // Test 4: Try to save PDF
      addResult('💾 Attempting to save PDF...');
      const filename = `simple_test_${Date.now()}.pdf`;
      
      try {
        pdf.save(filename);
        addResult('✅ PDF saved successfully using pdf.save()');
      } catch (saveError) {
        addResult(`⚠️ pdf.save() failed: ${saveError.message}`);
        addResult('🔄 Trying alternative blob method...');
        
        // Alternative method
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        addResult('✅ PDF saved successfully using blob method');
      }

      addResult('🎉 Basic PDF test completed successfully!');
      
    } catch (error) {
      addResult(`❌ Error: ${error.message}`);
      console.error('PDF Test Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const testHTML2Canvas = async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      setTestResults([]);
      addResult('🚀 Starting html2canvas test...');

      // Test 1: Check if html2canvas can be imported
      addResult('📦 Testing html2canvas import...');
      const html2canvas = (await import('html2canvas')).default;
      addResult('✅ html2canvas imported successfully');

      // Test 2: Create test element
      addResult('🏗️ Creating test HTML element...');
      const testDiv = document.createElement('div');
      testDiv.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif; background: white;">
          <h1>HTML2Canvas Test</h1>
          <p>This is a test of HTML to canvas conversion.</p>
          <p style="font-family: 'Noto Sans Ethiopic', sans-serif;">Amharic Test: የማደሻ ትእዛዝ</p>
        </div>
      `;
      testDiv.style.position = 'absolute';
      testDiv.style.left = '-9999px';
      testDiv.style.top = '-9999px';
      document.body.appendChild(testDiv);
      addResult('✅ Test HTML element created');

      // Test 3: Convert to canvas
      addResult('🖼️ Converting HTML to canvas...');
      const canvas = await html2canvas(testDiv, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      addResult(`✅ Canvas created: ${canvas.width}x${canvas.height}`);

      // Test 4: Convert to image data
      addResult('🔄 Converting canvas to image data...');
      const imgData = canvas.toDataURL('image/png');
      addResult(`✅ Image data created (length: ${imgData.length})`);

      // Test 5: Create PDF with image
      addResult('📄 Creating PDF with canvas image...');
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width * 0.264583; // Convert pixels to mm
      const imgHeight = canvas.height * 0.264583;
      
      // Scale to fit page
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      pdf.addImage(imgData, 'PNG', 10, 10, scaledWidth, scaledHeight);
      addResult('✅ Image added to PDF');

      // Test 6: Save PDF
      addResult('💾 Saving PDF...');
      const filename = `html2canvas_test_${Date.now()}.pdf`;
      pdf.save(filename);
      addResult('✅ PDF with HTML content saved successfully!');

      // Cleanup
      document.body.removeChild(testDiv);
      addResult('🧹 Cleanup completed');
      addResult('🎉 HTML2Canvas test completed successfully!');
      
    } catch (error) {
      addResult(`❌ Error: ${error.message}`);
      console.error('HTML2Canvas Test Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          PDF Download Diagnostic Tests
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Test PDF Generation Components
          </h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              onClick={testBasicPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Test Basic PDF (jsPDF only)
            </Button>
            
            <Button
              onClick={testHTML2Canvas}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Test HTML2Canvas + PDF
            </Button>
            
            <Button
              onClick={clearResults}
              disabled={isGenerating}
              variant="outline"
            >
              Clear Results
            </Button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h3 className="font-semibold text-gray-800 mb-2">Test Results:</h3>
            {testResults.length === 0 ? (
              <p className="text-gray-500 italic">No tests run yet. Click a test button above.</p>
            ) : (
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result.includes('❌') ? (
                      <span className="text-red-600">{result}</span>
                    ) : result.includes('✅') ? (
                      <span className="text-green-600">{result}</span>
                    ) : result.includes('⚠️') ? (
                      <span className="text-yellow-600">{result}</span>
                    ) : result.includes('🎉') ? (
                      <span className="text-blue-600 font-semibold">{result}</span>
                    ) : (
                      <span className="text-gray-700">{result}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">🔍 Diagnostic Information:</h3>
          <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
            <li><strong>Browser:</strong> {navigator.userAgent}</li>
            <li><strong>Platform:</strong> {navigator.platform}</li>
            <li><strong>Language:</strong> {navigator.language}</li>
            <li><strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}</li>
            <li><strong>Cookies Enabled:</strong> {navigator.cookieEnabled ? 'Yes' : 'No'}</li>
            <li><strong>Current URL:</strong> {window.location.href}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}