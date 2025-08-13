import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPLAINT_CATEGORIES, COMPLAINT_TITLES, ComplaintCategory, ComplaintPriority } from '@/types/complaint';
import { ETHIOPIAN_REGIONS, SERVICE_CENTERS } from '@/types/user';
import { apiService } from '@/lib/api';
import { CategoryHelper } from '@/components/complaints/CategoryHelper';

export function ComplaintForm() {
  const { toast } = useToast();
  const { user, permissions } = useAuth();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    region: user?.region || '',
    serviceCenter: user?.serviceCenter || '',
    complaintNumber: '',
    accountNumber: '',
    title: '',
    description: '',
    category: '' as ComplaintCategory,
    priority: 'medium' as ComplaintPriority
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare complaint data
      const complaintData = {
        customer: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
          address: formData.customerAddress,
          region: formData.region,
          serviceCenter: formData.serviceCenter,
          complaintNumber: formData.complaintNumber,
          accountNumber: formData.accountNumber
        },
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        region: formData.region,
        serviceCenter: formData.serviceCenter,
        createdBy: user?.id || 'anonymous'
      };

      const response = await apiService.createComplaint(complaintData);

      if (response.success) {
        toast({
          title: t("complaint.success"),
          description: `${t("complaint.success_desc")} ${response.data?.id || 'CMP-' + Date.now().toString().slice(-6)}`,
        });

        // Reset form
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          customerAddress: '',
          region: user?.region || '',
          serviceCenter: user?.serviceCenter || '',
          complaintNumber: '',
          accountNumber: '',
          title: '',
          description: '',
          category: '' as ComplaintCategory,
          priority: 'medium' as ComplaintPriority
        });
      } else {
        throw new Error(response.error || 'Failed to submit complaint');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast({
        title: t("complaint.error"),
        description: error instanceof Error ? error.message : t("complaint.error_desc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-suggest priority based on complaint category
      if (field === 'category') {
        const selectedCategory = COMPLAINT_CATEGORIES.find(cat => cat.value === value);
        if (selectedCategory && selectedCategory.priority) {
          newData.priority = selectedCategory.priority as ComplaintPriority;
        }
      }
      
      // Reset service center when region changes
      if (field === 'region') {
        newData.serviceCenter = '';
      }
      
      return newData;
    });
  };

  // Determine available priority levels based on role
  const availablePriorities = permissions.canSetHighPriority 
    ? ['low', 'medium', 'high', 'critical']
    : ['low', 'medium'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">


      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <Card className="border-2 border-eeu-orange shadow-lg bg-gradient-to-br from-white via-orange-50 to-eeu-orange-light">
            <CardHeader className="bg-gradient-eeu text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold">
                {t("form.customer_information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Enhanced Name Field */}
              <div className="space-y-3 group">
                <Label htmlFor="customerName" className="text-sm font-semibold text-gray-700">
                  {t("complaint.customer_name")} *
                </Label>
                <div className="relative">
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder={t("form.enter_full_name")}
                    className="pr-4 py-3 text-lg border-2 border-orange-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-orange/30 focus:border-eeu-orange focus:scale-105 hover:border-eeu-orange/60 bg-white/80 backdrop-blur-sm"
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {formData.customerName && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Email and Phone Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 group">
                  <Label htmlFor="customerEmail" className="text-sm font-semibold text-gray-700">
                    {t("form.email")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      placeholder="customer@email.com"
                      className="pr-4 py-3 text-lg border-2 border-orange-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-orange/30 focus:border-eeu-orange focus:scale-105 hover:border-eeu-orange/60 bg-white/80 backdrop-blur-sm"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {formData.customerEmail && formData.customerEmail.includes('@') && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 group">
                  <Label htmlFor="customerPhone" className="text-sm font-semibold text-gray-700">
                    {t("form.phone_number")} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="customerPhone"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      placeholder="+251-9XX-XXXXXX"
                      className="pr-4 py-3 text-lg border-2 border-orange-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-orange/30 focus:border-eeu-orange focus:scale-105 hover:border-eeu-orange/60 bg-white/80 backdrop-blur-sm"
                      required
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {formData.customerPhone && formData.customerPhone.length >= 10 && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Address Field */}
              <div className="space-y-3 group">
                <Label htmlFor="customerAddress" className="text-sm font-semibold text-gray-700">
                  {t("form.address")} *
                </Label>
                <div className="relative">
                  <Textarea
                    id="customerAddress"
                    value={formData.customerAddress}
                    onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                    placeholder={t("form.complete_address")}
                    className="pr-4 py-3 text-lg border-2 border-orange-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-orange/30 focus:border-eeu-orange focus:scale-105 hover:border-eeu-orange/60 bg-white/80 backdrop-blur-sm min-h-[100px] resize-none"
                    required
                  />
                  <div className="absolute right-4 top-4">
                    {formData.customerAddress && formData.customerAddress.length > 10 && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Region Field */}
              <div className="space-y-3 group">
                <Label htmlFor="region" className="text-sm font-semibold text-gray-700">
                  {t("common.region")} *
                </Label>
                <div className="relative">
                  <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                    <SelectTrigger className="pr-4 py-3 text-lg border-2 border-orange-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-orange/30 focus:border-eeu-orange hover:border-eeu-orange/60 bg-white/80 backdrop-blur-sm">
                      <SelectValue placeholder={t("form.select_region")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-orange-200">
                      {ETHIOPIAN_REGIONS.map((region) => (
                        <SelectItem key={region} value={region} className="py-3 px-4 hover:bg-orange-50 transition-colors">
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    {formData.region && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Service Center Field */}
              <div className="space-y-3 group">
                <Label htmlFor="serviceCenter" className="text-sm font-semibold text-gray-700">
                  {t("form.service_center")} *
                </Label>
                <div className="relative">
                  <Select 
                    value={formData.serviceCenter} 
                    onValueChange={(value) => handleInputChange('serviceCenter', value)}
                    disabled={!formData.region}
                  >
                    <SelectTrigger className="pr-4 py-3 text-lg border-2 border-orange-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-orange/30 focus:border-eeu-orange hover:border-eeu-orange/60 bg-white/80 backdrop-blur-sm">
                      <SelectValue placeholder={formData.region ? t("form.select_service_center") : t("form.select_region_first")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-orange-200">
                      {formData.region && SERVICE_CENTERS[formData.region as keyof typeof SERVICE_CENTERS]?.map((center) => (
                        <SelectItem key={center} value={center} className="py-3 px-4 hover:bg-orange-50 transition-colors">
                          {center}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    {formData.serviceCenter && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Account Numbers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 group">
                  <Label htmlFor="complaintNumber" className="text-sm font-semibold text-gray-700">
                    {t("form.complaint_number")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="complaintNumber"
                      value={formData.complaintNumber}
                      onChange={(e) => handleInputChange('complaintNumber', e.target.value)}
                      placeholder="8009456781"
                      className="pr-4 py-3 text-lg border-2 border-orange-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-orange/30 focus:border-eeu-orange focus:scale-105 hover:border-eeu-orange/60 bg-white/80 backdrop-blur-sm"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {formData.complaintNumber && formData.complaintNumber.length >= 8 && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 group">
                  <Label htmlFor="accountNumber" className="text-sm font-semibold text-gray-700">
                    {t("form.account_number")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      placeholder="ACC-789456"
                      className="pr-4 py-3 text-lg border-2 border-orange-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-orange/30 focus:border-eeu-orange focus:scale-105 hover:border-eeu-orange/60 bg-white/80 backdrop-blur-sm"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {formData.accountNumber && formData.accountNumber.length >= 6 && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Complaint Details */}
          <Card className="border-2 border-eeu-green shadow-lg bg-gradient-to-br from-white via-green-50 to-eeu-green-light">
            <CardHeader className="bg-gradient-eeu-reverse text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold">
                {t("form.complaint_details")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Enhanced Title Field */}
              <div className="space-y-3 group">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                  {t("form.complaint_title")} *
                </Label>
                {formData.category && COMPLAINT_TITLES[formData.category as keyof typeof COMPLAINT_TITLES] ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <Select value={formData.title} onValueChange={(value) => handleInputChange('title', value)}>
                        <SelectTrigger className="pr-4 py-3 text-lg border-2 border-green-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-green/30 focus:border-eeu-green hover:border-eeu-green/60 bg-white/80 backdrop-blur-sm">
                          <SelectValue placeholder={t("form.select_predefined_title")} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-2 border-green-200">
                          {COMPLAINT_TITLES[formData.category as keyof typeof COMPLAINT_TITLES].map((title, index) => (
                            <SelectItem key={index} value={title} className="py-3 px-4 hover:bg-green-50 transition-colors">
                              {title}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom" className="py-3 px-4 hover:bg-green-50 transition-colors">
                            {t("form.custom_title")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                        {formData.title && formData.title !== 'custom' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    {formData.title === 'custom' && (
                      <div className="relative">
                        <Input
                          value=""
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder={t("form.enter_custom_title")}
                          className="pr-4 py-3 text-lg border-2 border-green-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-green/30 focus:border-eeu-green focus:scale-105 hover:border-eeu-green/60 bg-white/80 backdrop-blur-sm"
                          required
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder={t("form.brief_description")}
                      className="pr-4 py-3 text-lg border-2 border-green-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-green/30 focus:border-eeu-green focus:scale-105 hover:border-eeu-green/60 bg-white/80 backdrop-blur-sm"
                      required
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {formData.title && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Category Field */}
              <div className="space-y-3 group">
                <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                  {t("form.category")} *
                </Label>
                <div className="relative">
                  <Select value={formData.category} onValueChange={(value: ComplaintCategory) => handleInputChange('category', value)}>
                    <SelectTrigger className="pr-4 py-3 text-lg border-2 border-green-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-green/30 focus:border-eeu-green hover:border-eeu-green/60 bg-white/80 backdrop-blur-sm">
                      <SelectValue placeholder={t("form.select_complaint_category")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 rounded-xl border-2 border-green-200">
                      {COMPLAINT_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value} className="py-4 px-4 hover:bg-green-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${
                              category.priority === 'critical' ? 'bg-red-100 text-red-600' :
                              category.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                              category.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              <div className="w-3 h-3 rounded-full bg-current" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800">{t(category.labelKey)}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {category.priority === 'critical' ? t('priority.emergency_response') :
                                 category.priority === 'high' ? t('priority.high_priority') :
                                 category.priority === 'medium' ? t('priority.standard_priority') :
                                 t('priority.low_priority')}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    {formData.category && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Priority Field */}
              <div className="space-y-3 group">
                <Label htmlFor="priority" className="text-sm font-semibold text-gray-700">
                  {t("form.priority")} *
                </Label>
                <div className="relative">
                  <Select value={formData.priority} onValueChange={(value: ComplaintPriority) => handleInputChange('priority', value)}>
                    <SelectTrigger className="pr-4 py-3 text-lg border-2 border-green-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-green/30 focus:border-eeu-green hover:border-eeu-green/60 bg-white/80 backdrop-blur-sm">
                      <SelectValue placeholder={t("form.select_priority_level")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-green-200">
                      {availablePriorities.map((priority) => (
                        <SelectItem key={priority} value={priority} className="py-3 px-4 hover:bg-green-50 transition-colors">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full ${
                                priority === 'critical' ? 'bg-red-500 animate-pulse' :
                                priority === 'high' ? 'bg-orange-500' :
                                priority === 'medium' ? 'bg-yellow-500' :
                                'bg-gray-400'
                              }`} />
                              <span className="font-medium">{t(`priority.${priority}`)}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    {formData.priority && (
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        formData.priority === 'critical' ? 'bg-red-500' :
                        formData.priority === 'high' ? 'bg-orange-500' :
                        formData.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`} />
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Description Field */}
              <div className="space-y-3 group">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  {t("form.detailed_description")} *
                </Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={t("complaint.description_placeholder")}
                    className="pr-4 py-4 text-lg border-2 border-green-200 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-eeu-green/30 focus:border-eeu-green focus:scale-105 hover:border-eeu-green/60 bg-white/80 backdrop-blur-sm min-h-[140px] resize-none"
                    required
                  />
                  <div className="absolute right-4 top-4">
                    {formData.description && formData.description.length > 20 && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                    {formData.description.length}/500
                  </div>
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <div className="pt-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-eeu rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                  <Button
                    type="submit"
                    className="relative w-full py-6 text-xl font-bold bg-gradient-eeu hover:opacity-95 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl rounded-2xl border-2 border-white/20"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="animate-pulse">{t("form.submitting")}</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    ) : (
                      <span>{t("form.submit_complaint")}</span>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Category Helper - Moved to bottom */}
      <div>
        <CategoryHelper 
          onCategorySelect={(category) => handleInputChange('category', category)}
          selectedCategory={formData.category}
        />
      </div>
    </div>
  );
}
