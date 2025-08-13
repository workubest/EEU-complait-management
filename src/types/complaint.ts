export type ComplaintStatus = 'open' | 'in-progress' | 'resolved' | 'escalated' | 'closed' | 'cancelled';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';
export type ComplaintCategory = 
  | 'pole-fall'
  | 'prepaid-meter-issue'
  | 'postpaid-meter-malfunction'
  | 'wire-cut'
  | 'wire-sag'
  | 'no-supply-partial'
  | 'no-supply-total'
  | 'no-supply-single-house'
  | 'over-voltage'
  | 'under-voltage'
  | 'voltage-fluctuation'
  | 'transformer-issue'
  | 'breaker-problem'
  | 'billing-issue'
  | 'meter-reading-issue'
  | 'new-connection-request'
  | 'disconnection-request'
  | 'reconnection-request'
  | 'line-maintenance'
  | 'safety-concern'
  | 'other';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  region: string;
  serviceCenter?: string;
  meterNumber?: string;
  accountNumber?: string;
  contractNumber?: string;
  businessPartner?: string;
}

export interface Complaint {
  id: string;
  customerId: string;
  customer: Customer;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  region: string;
  serviceCenter?: string;
  assignedTo?: string;
  assignedBy?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  resolvedAt?: string;
  estimatedResolution?: string;
  workType?: string;
  resolutionNotes?: string;
  contractNumber?: string;
  businessPartner?: string;
  repairOrder?: string;
  notes: string[];
  attachments?: string[];
}

// Predefined complaint titles based on categories
export const COMPLAINT_TITLES = {
  'pole-fall': [
    'Electric pole has fallen on the road',
    'Fallen pole blocking traffic',
    'Pole collapsed due to strong wind',
    'Damaged pole creating safety hazard'
  ],
  'wire-cut': [
    'Power line cut/broken in our area',
    'Electrical wire damaged by tree branch',
    'Wire cut during construction work',
    'Broken overhead line causing outage'
  ],
  'wire-sag': [
    'Low hanging electrical wires',
    'Sagging power lines near buildings',
    'Dangerous wire sag over road',
    'Electrical wires touching tree branches'
  ],
  'no-supply-total': [
    'Complete power outage in our area',
    'Total blackout affecting entire neighborhood',
    'No electricity supply for whole district',
    'Area-wide power failure'
  ],
  'no-supply-partial': [
    'Partial power outage - some phases working',
    'Power supply missing in part of area',
    'Intermittent power supply',
    'Some streets without electricity'
  ],
  'no-supply-single-house': [
    'No power supply to my house',
    'Individual house power outage',
    'Electricity not reaching my property',
    'Single customer power failure'
  ],
  'transformer-issue': [
    'Transformer making loud noise',
    'Transformer oil leakage',
    'Burnt transformer in our area',
    'Transformer overheating problem'
  ],
  'breaker-problem': [
    'Circuit breaker keeps tripping',
    'Main breaker not working properly',
    'Faulty circuit breaker needs replacement',
    'Breaker panel malfunction'
  ],
  'over-voltage': [
    'High voltage damaging appliances',
    'Voltage too high - equipment burning',
    'Over-voltage causing appliance failure',
    'Excessive voltage in power supply'
  ],
  'under-voltage': [
    'Low voltage - appliances not working',
    'Insufficient voltage supply',
    'Voltage drop affecting equipment',
    'Under-voltage causing poor performance'
  ],
  'voltage-fluctuation': [
    'Voltage keeps fluctuating',
    'Unstable power supply voltage',
    'Lights flickering due to voltage changes',
    'Variable voltage damaging equipment'
  ],
  'prepaid-meter-issue': [
    'Prepaid meter not accepting tokens',
    'Meter display not working',
    'Prepaid meter showing error',
    'Token loading problem'
  ],
  'postpaid-meter-malfunction': [
    'Postpaid meter not recording usage',
    'Meter reading incorrect',
    'Faulty postpaid meter needs replacement',
    'Meter display malfunction'
  ],
  'meter-reading-issue': [
    'Incorrect meter reading on bill',
    'Unable to access meter for reading',
    'Meter reading dispute',
    'Wrong consumption calculation'
  ],
  'billing-issue': [
    'Incorrect electricity bill amount',
    'Billing dispute - overcharged',
    'Payment not reflected in account',
    'Bill calculation error'
  ],
  'new-connection-request': [
    'Request for new electricity connection',
    'New house needs power connection',
    'Business premises connection request',
    'Additional meter installation needed'
  ],
  'disconnection-request': [
    'Request to disconnect electricity service',
    'Temporary disconnection needed',
    'Permanent service termination request',
    'Disconnect due to property sale'
  ],
  'reconnection-request': [
    'Request to restore electricity connection',
    'Reconnection after payment',
    'Service restoration needed',
    'Reactivate disconnected meter'
  ],
  'line-maintenance': [
    'Power lines need maintenance',
    'Tree trimming required near lines',
    'Loose electrical connections',
    'Infrastructure maintenance needed'
  ],
  'safety-concern': [
    'Exposed electrical wires danger',
    'Electrical safety hazard in area',
    'Dangerous electrical installation',
    'Public safety risk from power lines'
  ],
  'other': [
    'Other electrical service issue',
    'General complaint about power supply',
    'Miscellaneous electrical problem',
    'Other utility service concern'
  ]
} as const;

export const COMPLAINT_CATEGORIES = [
  { value: 'pole-fall', labelKey: 'complaint_type.pole-fall', icon: 'AlertTriangle', priority: 'critical' },
  { value: 'wire-cut', labelKey: 'complaint_type.wire-cut', icon: 'Scissors', priority: 'high' },
  { value: 'wire-sag', labelKey: 'complaint_type.wire-sag', icon: 'TrendingDown', priority: 'high' },
  { value: 'no-supply-total', labelKey: 'complaint_type.no-supply-total', icon: 'ZapOff', priority: 'high' },
  { value: 'no-supply-partial', labelKey: 'complaint_type.no-supply-partial', icon: 'Zap', priority: 'medium' },
  { value: 'no-supply-single-house', labelKey: 'complaint_type.no-supply-single-house', icon: 'Home', priority: 'medium' },
  { value: 'transformer-issue', labelKey: 'complaint_type.transformer-issue', icon: 'Box', priority: 'high' },
  { value: 'breaker-problem', labelKey: 'complaint_type.breaker-problem', icon: 'Power', priority: 'medium' },
  { value: 'over-voltage', labelKey: 'complaint_type.over-voltage', icon: 'TrendingUp', priority: 'high' },
  { value: 'under-voltage', labelKey: 'complaint_type.under-voltage', icon: 'TrendingDown', priority: 'medium' },
  { value: 'voltage-fluctuation', labelKey: 'complaint_type.voltage-fluctuation', icon: 'Activity', priority: 'medium' },
  { value: 'prepaid-meter-issue', labelKey: 'complaint_type.prepaid-meter-issue', icon: 'CreditCard', priority: 'medium' },
  { value: 'postpaid-meter-malfunction', labelKey: 'complaint_type.postpaid-meter-malfunction', icon: 'Gauge', priority: 'medium' },
  { value: 'meter-reading-issue', labelKey: 'complaint_type.meter-reading-issue', icon: 'FileText', priority: 'low' },
  { value: 'billing-issue', labelKey: 'complaint_type.billing-issue', icon: 'Receipt', priority: 'low' },
  { value: 'new-connection-request', labelKey: 'complaint_type.new-connection-request', icon: 'Plus', priority: 'low' },
  { value: 'disconnection-request', labelKey: 'complaint_type.disconnection-request', icon: 'Minus', priority: 'low' },
  { value: 'reconnection-request', labelKey: 'complaint_type.reconnection-request', icon: 'RotateCcw', priority: 'medium' },
  { value: 'line-maintenance', labelKey: 'complaint_type.line-maintenance', icon: 'Wrench', priority: 'medium' },
  { value: 'safety-concern', labelKey: 'complaint_type.safety-concern', icon: 'Shield', priority: 'high' },
  { value: 'other', labelKey: 'complaint_type.other', icon: 'MoreHorizontal', priority: 'low' }
] as const;

export const PRIORITY_CONFIG = {
  low: { labelKey: 'priority.low', color: 'text-muted-foreground', bgColor: 'bg-muted' },
  medium: { labelKey: 'priority.medium', color: 'text-primary', bgColor: 'bg-primary/10' },
  high: { labelKey: 'priority.high', color: 'text-warning', bgColor: 'bg-warning/10' },
  critical: { labelKey: 'priority.critical', color: 'text-destructive', bgColor: 'bg-destructive/10' }
} as const;

export const STATUS_CONFIG = {
  open: { labelKey: 'status.open', color: 'text-primary', bgColor: 'bg-primary/10' },
  'in-progress': { labelKey: 'status.in_progress', color: 'text-warning', bgColor: 'bg-warning/10' },
  resolved: { labelKey: 'status.resolved', color: 'text-success', bgColor: 'bg-success/10' },
  escalated: { labelKey: 'status.escalated', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  closed: { labelKey: 'status.closed', color: 'text-muted-foreground', bgColor: 'bg-muted' },
  cancelled: { labelKey: 'status.cancelled', color: 'text-destructive', bgColor: 'bg-destructive/10' }
} as const;