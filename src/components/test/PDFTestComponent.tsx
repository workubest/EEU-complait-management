import React from 'react';
import { HTMLRepairOrderPDFExport } from '../export/HTMLRepairOrderPDFExport';
import { Complaint } from '@/types/complaint';

// Test data with Amharic content
const testComplaints: Complaint[] = [
  {
    id: 'COMP-001',
    title: 'የኤሌክትሪክ መቆራረጥ',
    description: 'በመኖሪያ አካባቢ ሙሉ የኤሌክትሪክ መቆራረጥ',
    customer: {
      name: 'አበበ ከበደ',
      address: 'አዲስ አበባ ቦሌ ክ/ከተማ',
      phone: '+251911123456',
      email: 'abebe@email.com'
    },
    region: 'አዲስ አበባ',
    priority: 'HIGH',
    status: 'OPEN',
    reportedAt: new Date('2024-12-15T14:30:00Z'),
    createdAt: new Date('2024-12-15T14:30:00Z'),
    updatedAt: new Date('2024-12-15T14:30:00Z')
  },
  {
    id: 'COMP-002',
    title: 'የትራንስፎርመር ብልሽት',
    description: 'የኤሌክትሪክ ትራንስፎርመር ሙሉ በሙሉ ተበላሽቷል',
    customer: {
      name: 'ፋጢማ አሊ',
      address: 'ባህር ዳር፣ አማራ ክልል',
      phone: '+251922654321',
      email: 'fatima@email.com'
    },
    region: 'Amhara',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    reportedAt: new Date('2024-12-16T09:15:00Z'),
    createdAt: new Date('2024-12-16T09:15:00Z'),
    updatedAt: new Date('2024-12-16T10:30:00Z')
  },
  {
    id: 'COMP-003',
    title: 'Power Line Down',
    description: 'Electrical power line has fallen due to strong winds',
    customer: {
      name: 'John Smith',
      address: 'Addis Ababa, Kirkos Sub-city',
      phone: '+251933789012',
      email: 'john@email.com'
    },
    region: 'Addis Ababa',
    priority: 'MEDIUM',
    status: 'OPEN',
    reportedAt: new Date('2024-12-17T11:45:00Z'),
    createdAt: new Date('2024-12-17T11:45:00Z'),
    updatedAt: new Date('2024-12-17T11:45:00Z')
  },
  {
    id: 'COMP-004',
    title: 'የመብራት መብራት ችግር',
    description: 'በቤት ውስጥ የመብራት መብራት አይሰራም',
    customer: {
      name: 'ሳራ ተስፋዬ',
      address: 'ሐዋሳ፣ ሲዳማ ክልል',
      phone: '+251944567890',
      email: 'sara@email.com'
    },
    region: 'Sidama',
    priority: 'LOW',
    status: 'RESOLVED',
    reportedAt: new Date('2024-12-18T16:20:00Z'),
    createdAt: new Date('2024-12-18T16:20:00Z'),
    updatedAt: new Date('2024-12-18T17:45:00Z')
  },
  {
    id: 'COMP-005',
    title: 'የመብራት ምሰሶ ችግር',
    description: 'የመብራት ምሰሶ ተሰብሯል እና መተካት ያስፈልጋል',
    customer: {
      name: 'ዳዊት ገብሬ',
      address: 'ጎንደር፣ አማራ ክልል',
      phone: '+251955123789',
      email: 'dawit@email.com'
    },
    region: 'Amhara',
    priority: 'HIGH',
    status: 'OPEN',
    reportedAt: new Date('2024-12-19T08:30:00Z'),
    createdAt: new Date('2024-12-19T08:30:00Z'),
    updatedAt: new Date('2024-12-19T08:30:00Z')
  },
  {
    id: 'COMP-006',
    title: 'Voltage Fluctuation',
    description: 'Frequent voltage fluctuations causing damage to electrical appliances',
    customer: {
      name: 'Mary Johnson',
      address: 'Mekelle, Tigray Region',
      phone: '+251966456789',
      email: 'mary@email.com'
    },
    region: 'Tigray',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    reportedAt: new Date('2024-12-19T12:15:00Z'),
    createdAt: new Date('2024-12-19T12:15:00Z'),
    updatedAt: new Date('2024-12-19T13:45:00Z')
  },
  {
    id: 'COMP-007',
    title: 'የኤሌክትሪክ ሽቦ መቆራረጥ',
    description: 'በዝናብ ምክንያት የኤሌክትሪክ ሽቦ ተቆርጧል',
    customer: {
      name: 'ሀብታሙ ወልደ',
      address: 'ደሴ፣ ደቡብ ኢትዮጵያ',
      phone: '+251977654321',
      email: 'habtamu@email.com'
    },
    region: 'SNNP',
    priority: 'CRITICAL',
    status: 'OPEN',
    reportedAt: new Date('2024-12-19T15:45:00Z'),
    createdAt: new Date('2024-12-19T15:45:00Z'),
    updatedAt: new Date('2024-12-19T15:45:00Z')
  },
  {
    id: 'COMP-008',
    title: 'Street Light Malfunction',
    description: 'Multiple street lights not working in residential area',
    customer: {
      name: 'Ahmed Hassan',
      address: 'Dire Dawa, Dire Dawa Administration',
      phone: '+251988789012',
      email: 'ahmed@email.com'
    },
    region: 'Dire Dawa',
    priority: 'LOW',
    status: 'RESOLVED',
    reportedAt: new Date('2024-12-20T10:30:00Z'),
    createdAt: new Date('2024-12-20T10:30:00Z'),
    updatedAt: new Date('2024-12-20T14:20:00Z')
  }
];

export function PDFTestComponent() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          PDF Export Test - Amharic Support
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Test Data Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total Complaints</h3>
              <p className="text-2xl font-bold text-blue-600">{testComplaints.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Multi-Page PDF</h3>
              <p className="text-2xl font-bold text-green-600">{Math.ceil(testComplaints.length / 4)} Pages</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Sample Complaints:</h3>
            <ul className="space-y-2">
              {testComplaints.map((complaint, index) => (
                <li key={complaint.id} className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">
                    <strong>{complaint.customer?.name}</strong> - {complaint.title}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    complaint.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    complaint.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    complaint.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {complaint.priority}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Export PDF with Perfect Amharic Support:</h3>
            <HTMLRepairOrderPDFExport 
              complaints={testComplaints}
              onExport={() => console.log('PDF export completed!')}
            />
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">📋 Testing Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-yellow-700">
            <li>Click the "Export Repair Orders (HTML to PDF)" button above</li>
            <li>Wait for the "Generating PDF..." loading state</li>
            <li>Check browser console for detailed logs</li>
            <li>Verify PDF downloads automatically</li>
            <li>Open PDF and verify Amharic text displays correctly</li>
            <li>Check that repair orders are properly paginated (4 per page in 2x2 grid)</li>
            <li>Verify multiple pages are generated ({Math.ceil(testComplaints.length / 4)} pages expected)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}