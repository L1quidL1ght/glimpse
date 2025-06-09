import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerAdded: () => void;
}
const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({
  open,
  onOpenChange,
  onCustomerAdded
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tablePreferences: [] as string[],
    foodPreferences: [] as string[],
    winePreferences: [] as string[],
    cocktailPreferences: [] as string[],
    spiritsPreferences: [] as string[],
    allergies: [] as string[],
    notes: ''
  });
  const [newPreference, setNewPreference] = useState('');
  const [activeTab, setActiveTab] = useState<keyof typeof formData>('tablePreferences');
  const [loading, setLoading] = useState(false);
  const {
    toast
  } = useToast();
  const addPreference = () => {
    if (newPreference.trim() && Array.isArray(formData[activeTab])) {
      setFormData(prev => ({
        ...prev,
        [activeTab]: [...(prev[activeTab] as string[]), newPreference.trim()]
      }));
      setNewPreference('');
    }
  };
  const removePreference = (index: number) => {
    if (Array.isArray(formData[activeTab])) {
      setFormData(prev => ({
        ...prev,
        [activeTab]: (prev[activeTab] as string[]).filter((_, i) => i !== index)
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      // Create customer
      const {
        data: customer,
        error: customerError
      } = await supabase.from('customers').insert({
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null
      }).select().single();
      if (customerError) throw customerError;

      // Add preferences in parallel
      const promises = [];

      // Table preferences
      if (formData.tablePreferences.length > 0) {
        promises.push(supabase.from('table_preferences').insert(formData.tablePreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref
        }))));
      }

      // Food preferences
      if (formData.foodPreferences.length > 0) {
        promises.push(supabase.from('food_preferences').insert(formData.foodPreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref
        }))));
      }

      // Wine preferences
      if (formData.winePreferences.length > 0) {
        promises.push(supabase.from('wine_preferences').insert(formData.winePreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref
        }))));
      }

      // Cocktail preferences
      if (formData.cocktailPreferences.length > 0) {
        promises.push(supabase.from('cocktail_preferences').insert(formData.cocktailPreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref
        }))));
      }

      // Spirits preferences
      if (formData.spiritsPreferences.length > 0) {
        promises.push(supabase.from('spirits_preferences').insert(formData.spiritsPreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref
        }))));
      }

      // Allergies
      if (formData.allergies.length > 0) {
        promises.push(supabase.from('allergies').insert(formData.allergies.map(allergy => ({
          customer_id: customer.id,
          allergy: allergy
        }))));
      }

      // Notes
      if (formData.notes.trim()) {
        promises.push(supabase.from('customer_notes').insert({
          customer_id: customer.id,
          note: formData.notes.trim()
        }));
      }
      await Promise.all(promises);
      toast({
        title: "Success",
        description: "Customer added successfully"
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        tablePreferences: [],
        foodPreferences: [],
        winePreferences: [],
        cocktailPreferences: [],
        spiritsPreferences: [],
        allergies: [],
        notes: ''
      });
      onCustomerAdded();
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const preferenceLabels = {
    tablePreferences: 'Table Preferences',
    foodPreferences: 'Food Preferences',
    winePreferences: 'Wine Preferences',
    cocktailPreferences: 'Cocktail Preferences',
    spiritsPreferences: 'Spirits Preferences',
    allergies: 'Allergies'
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Guest</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Basic Information</h3>
            
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData(prev => ({
              ...prev,
              name: e.target.value
            }))} required className="px-[10px]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))} />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={formData.phone} onChange={e => setFormData(prev => ({
                ...prev,
                phone: e.target.value
              }))} />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="font-semibold">Preferences & Details</h3>
            
            {/* Preference Tabs */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(preferenceLabels).map(([key, label]) => <Button key={key} type="button" variant={activeTab === key ? "default" : "outline"} size="sm" onClick={() => setActiveTab(key as keyof typeof formData)}>
                  {label}
                </Button>)}
            </div>

            {/* Add Preference Input */}
            <div className="flex gap-2">
              <Input placeholder={`Add ${preferenceLabels[activeTab as keyof typeof preferenceLabels]?.toLowerCase()}`} value={newPreference} onChange={e => setNewPreference(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addPreference())} />
              <Button type="button" onClick={addPreference}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Display Preferences */}
            <div className="flex flex-wrap gap-2">
              {Array.isArray(formData[activeTab]) && (formData[activeTab] as string[]).map((item, index) => <Badge key={index} variant="secondary" className="cursor-pointer">
                  {item}
                  <X className="w-3 h-3 ml-1" onClick={() => removePreference(index)} />
                </Badge>)}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Special Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={e => setFormData(prev => ({
            ...prev,
            notes: e.target.value
          }))} rows={3} />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Guest'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
};
export default AddCustomerDialog;