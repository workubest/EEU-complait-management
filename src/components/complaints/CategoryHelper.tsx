import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { COMPLAINT_CATEGORIES } from '@/types/complaint';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryHelperProps {
  onCategorySelect: (category: string) => void;
  selectedCategory?: string;
}

export function CategoryHelper({ onCategorySelect, selectedCategory }: CategoryHelperProps) {
  const { t } = useLanguage();

  const emergencyCategories = COMPLAINT_CATEGORIES.filter(cat => cat.priority === 'critical');
  const highPriorityCategories = COMPLAINT_CATEGORIES.filter(cat => cat.priority === 'high');
  const standardCategories = COMPLAINT_CATEGORIES.filter(cat => cat.priority === 'medium');
  const lowPriorityCategories = COMPLAINT_CATEGORIES.filter(cat => cat.priority === 'low');

  const CategoryGroup = ({ title, categories, colorClass, bgClass }: {
    title: string;
    categories: typeof COMPLAINT_CATEGORIES;
    colorClass: string;
    bgClass: string;
  }) => (
    <div className="space-y-2">
      <h4 className={`font-medium text-sm ${colorClass}`}>{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategorySelect(category.value)}
            className={`p-4 text-left rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-105 ${
              selectedCategory === category.value
                ? `${bgClass} border-current shadow-md scale-105`
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-sm">{t(category.labelKey)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {category.value === 'pole-fall' && 'Emergency - Safety hazard'}
                  {category.value === 'wire-cut' && 'Power line damage'}
                  {category.value === 'wire-sag' && 'Dangerous sagging lines'}
                  {category.value === 'no-supply-total' && 'Area-wide outage'}
                  {category.value === 'no-supply-partial' && 'Partial area outage'}
                  {category.value === 'no-supply-single-house' && 'Individual customer'}
                  {category.value === 'transformer-issue' && 'Equipment malfunction'}
                  {category.value === 'breaker-problem' && 'Circuit breaker issues'}
                  {category.value === 'over-voltage' && 'High voltage problems'}
                  {category.value === 'under-voltage' && 'Low voltage issues'}
                  {category.value === 'voltage-fluctuation' && 'Power quality issue'}
                  {category.value === 'prepaid-meter-issue' && 'Prepaid meter problems'}
                  {category.value === 'postpaid-meter-malfunction' && 'Postpaid meter issues'}
                  {category.value === 'meter-reading-issue' && 'Reading problems'}
                  {category.value === 'billing-issue' && 'Payment disputes'}
                  {category.value === 'new-connection-request' && 'Service request'}
                  {category.value === 'disconnection-request' && 'Service termination'}
                  {category.value === 'reconnection-request' && 'Service restoration'}
                  {category.value === 'line-maintenance' && 'Infrastructure repair'}
                  {category.value === 'safety-concern' && 'Safety issue'}
                  {category.value === 'other' && 'Other issues'}
                </div>
              </div>
              <Badge variant="outline" className={`ml-2 ${colorClass} text-xs`}>
                {category.priority}
              </Badge>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="border-eeu-orange shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-eeu-orange-light">
      <CardHeader className="bg-gradient-eeu text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <span className="text-2xl">⚡</span>
          <span>Quick Category Selection</span>
        </CardTitle>
        <p className="text-orange-100">
          Choose the category that best describes your electrical service issue
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <CategoryGroup
          title="🚨 Emergency (Immediate Response)"
          categories={emergencyCategories}
          colorClass="text-red-600"
          bgClass="bg-red-50 text-red-800 border-red-300"
        />
        
        <CategoryGroup
          title="⚡ High Priority (Same Day Response)"
          categories={highPriorityCategories}
          colorClass="text-yellow-600"
          bgClass="bg-yellow-50 text-yellow-800 border-yellow-300"
        />
        
        <CategoryGroup
          title="🔧 Standard Priority (1-3 Days)"
          categories={standardCategories}
          colorClass="text-eeu-green"
          bgClass="bg-eeu-green-light text-eeu-green border-eeu-green"
        />
        
        <CategoryGroup
          title="📋 Low Priority (3-7 Days)"
          categories={lowPriorityCategories}
          colorClass="text-eeu-orange"
          bgClass="bg-eeu-orange-light text-eeu-orange border-eeu-orange"
        />
      </CardContent>
    </Card>
  );
}