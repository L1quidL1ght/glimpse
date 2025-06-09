
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Star, Plus, X, Calendar, MapPin, UtensilsCrossed, Wine, AlertTriangle, Users, FileText, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest?: any;
  onGuestAdded?: () => void;
}

const AddGuestDialog: React.FC<AddGuestDialogProps> = ({ 
  open, 
  onOpenChange, 
  guest, 
  onGuestAdded 
}) => {
  const { toast } = useToast();
  const isEditing = !!guest;

  // Basic Information
  const [name, setName] = useState(guest?.name || '');
  const [email, setEmail] = useState(guest?.email || '');
  const [phone, setPhone] = useState(guest?.phone || '');

  // Preferences with golden state
  const [tablePreferences, setTablePreferences] = useState<Array<{value: string, isGolden: boolean}>>(
    guest?.tablePreferences?.map((pref: string) => ({ value: pref, isGolden: false })) || []
  );
  const [foodPreferences, setFoodPreferences] = useState<Array<{value: string, isGolden: boolean}>>(
    guest?.foodPreferences?.map((pref: string) => ({ value: pref, isGolden: false })) || []
  );
  const [winePreferences, setWinePreferences] = useState<Array<{value: string, isGolden: boolean}>>(
    guest?.winePreferences?.map((wine: string) => ({ value: wine, isGolden: false })) || []
  );
  const [spiritsPreferences, setSpiritsPreferences] = useState<Array<{value: string, isGolden: boolean}>>(
    guest?.spiritsPreferences?.map((spirit: string) => ({ value: spirit, isGolden: false })) || []
  );
  const [cocktailPreferences, setCocktailPreferences] = useState<Array<{value: string, isGolden: boolean}>>(
    guest?.cocktailPreferences?.map((cocktail: string) => ({ value: cocktail, isGolden: false })) || []
  );

  // Allergies
  const [allergies, setAllergies] = useState<string[]>(guest?.allergies || []);

  // Important Dates
  const [importantDates, setImportantDates] = useState<Array<{event: string, date: string}>>(
    guest?.importantDates || []
  );

  // Connections
  const [connections, setConnections] = useState<Array<{name: string, relationship: string}>>(
    guest?.connections || []
  );

  // Notes
  const [specialNotes, setSpecialNotes] = useState(guest?.notes || '');
  const [importantNotables, setImportantNotables] = useState<string[]>(
    guest?.importantNotables || []
  );

  // Input states for adding new items
  const [newTablePref, setNewTablePref] = useState('');
  const [newFoodPref, setNewFoodPref] = useState('');
  const [newWinePref, setNewWinePref] = useState('');
  const [newSpiritPref, setNewSpiritPref] = useState('');
  const [newCocktailPref, setNewCocktailPref] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newDateEvent, setNewDateEvent] = useState('');
  const [newDateValue, setNewDateValue] = useState('');
  const [newConnectionName, setNewConnectionName] = useState('');
  const [newConnectionRelationship, setNewConnectionRelationship] = useState('');
  const [newNotable, setNewNotable] = useState('');

  const addPreference = (
    currentPrefs: Array<{value: string, isGolden: boolean}>, 
    setPrefs: React.Dispatch<React.SetStateAction<Array<{value: string, isGolden: boolean}>>>,
    newValue: string,
    setNewValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (newValue.trim()) {
      setPrefs([...currentPrefs, { value: newValue.trim(), isGolden: false }]);
      setNewValue('');
    }
  };

  const removePreference = (
    currentPrefs: Array<{value: string, isGolden: boolean}>, 
    setPrefs: React.Dispatch<React.SetStateAction<Array<{value: string, isGolden: boolean}>>>,
    index: number
  ) => {
    setPrefs(currentPrefs.filter((_, i) => i !== index));
  };

  const toggleGolden = (
    currentPrefs: Array<{value: string, isGolden: boolean}>, 
    setPrefs: React.Dispatch<React.SetStateAction<Array<{value: string, isGolden: boolean}>>>,
    index: number
  ) => {
    setPrefs(currentPrefs.map((pref, i) => 
      i === index ? { ...pref, isGolden: !pref.isGolden } : pref
    ));
  };

  const addSimpleItem = (
    currentItems: string[], 
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    newValue: string,
    setNewValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (newValue.trim()) {
      setItems([...currentItems, newValue.trim()]);
      setNewValue('');
    }
  };

  const removeSimpleItem = (
    currentItems: string[], 
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setItems(currentItems.filter((_, i) => i !== index));
  };

  const addImportantDate = () => {
    if (newDateEvent.trim() && newDateValue) {
      setImportantDates([...importantDates, { event: newDateEvent.trim(), date: newDateValue }]);
      setNewDateEvent('');
      setNewDateValue('');
    }
  };

  const removeImportantDate = (index: number) => {
    setImportantDates(importantDates.filter((_, i) => i !== index));
  };

  const addConnection = () => {
    if (newConnectionName.trim() && newConnectionRelationship.trim()) {
      setConnections([...connections, { 
        name: newConnectionName.trim(), 
        relationship: newConnectionRelationship.trim() 
      }]);
      setNewConnectionName('');
      setNewConnectionRelationship('');
    }
  };

  const removeConnection = (index: number) => {
    setConnections(connections.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Guest name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      let customerId = guest?.id;

      // Create or update customer
      if (isEditing) {
        const { error } = await supabase
          .from('customers')
          .update({
            name: name.trim(),
            email: email.trim() || null,
            phone: phone.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', guest.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('customers')
          .insert({
            name: name.trim(),
            email: email.trim() || null,
            phone: phone.trim() || null
          })
          .select()
          .single();

        if (error) throw error;
        customerId = data.id;
      }

      // If editing, delete existing preferences and related data
      if (isEditing) {
        await Promise.all([
          supabase.from('table_preferences').delete().eq('customer_id', customerId),
          supabase.from('food_preferences').delete().eq('customer_id', customerId),
          supabase.from('wine_preferences').delete().eq('customer_id', customerId),
          supabase.from('spirits_preferences').delete().eq('customer_id', customerId),
          supabase.from('cocktail_preferences').delete().eq('customer_id', customerId),
          supabase.from('allergies').delete().eq('customer_id', customerId),
          supabase.from('important_dates').delete().eq('customer_id', customerId),
          supabase.from('connections').delete().eq('customer_id', customerId),
          supabase.from('important_notables').delete().eq('customer_id', customerId),
          supabase.from('customer_notes').delete().eq('customer_id', customerId)
        ]);
      }

      // Insert all preferences and data
      const insertPromises = [];

      // Table preferences
      if (tablePreferences.length > 0) {
        insertPromises.push(
          supabase.from('table_preferences').insert(
            tablePreferences.map(pref => ({
              customer_id: customerId,
              preference: pref.value
            }))
          )
        );
      }

      // Food preferences
      if (foodPreferences.length > 0) {
        insertPromises.push(
          supabase.from('food_preferences').insert(
            foodPreferences.map(pref => ({
              customer_id: customerId,
              preference: pref.value,
              is_golden: pref.isGolden
            }))
          )
        );
      }

      // Wine preferences
      if (winePreferences.length > 0) {
        insertPromises.push(
          supabase.from('wine_preferences').insert(
            winePreferences.map(pref => ({
              customer_id: customerId,
              preference: pref.value,
              is_golden: pref.isGolden
            }))
          )
        );
      }

      // Spirits preferences
      if (spiritsPreferences.length > 0) {
        insertPromises.push(
          supabase.from('spirits_preferences').insert(
            spiritsPreferences.map(pref => ({
              customer_id: customerId,
              preference: pref.value,
              is_golden: pref.isGolden
            }))
          )
        );
      }

      // Cocktail preferences
      if (cocktailPreferences.length > 0) {
        insertPromises.push(
          supabase.from('cocktail_preferences').insert(
            cocktailPreferences.map(pref => ({
              customer_id: customerId,
              preference: pref.value,
              is_golden: pref.isGolden
            }))
          )
        );
      }

      // Allergies
      if (allergies.length > 0) {
        insertPromises.push(
          supabase.from('allergies').insert(
            allergies.map(allergy => ({
              customer_id: customerId,
              allergy
            }))
          )
        );
      }

      // Important dates
      if (importantDates.length > 0) {
        insertPromises.push(
          supabase.from('important_dates').insert(
            importantDates.map(date => ({
              customer_id: customerId,
              event: date.event,
              date: date.date
            }))
          )
        );
      }

      // Connections (simplified - would need to link to actual customer IDs in production)
      if (connections.length > 0) {
        // For now, we'll skip connections as they require linking to actual customer records
        console.log('Connections would be saved:', connections);
      }

      // Important notables
      if (importantNotables.length > 0) {
        insertPromises.push(
          supabase.from('important_notables').insert(
            importantNotables.map(notable => ({
              customer_id: customerId,
              notable
            }))
          )
        );
      }

      // Special notes
      if (specialNotes.trim()) {
        insertPromises.push(
          supabase.from('customer_notes').insert({
            customer_id: customerId,
            note: specialNotes.trim()
          })
        );
      }

      await Promise.all(insertPromises);

      toast({
        title: "Success",
        description: `Guest ${isEditing ? 'updated' : 'added'} successfully`,
      });

      onGuestAdded?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving guest:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} guest`,
        variant: "destructive",
      });
    }
  };

  const PreferenceInput = ({ 
    preferences, 
    setPreferences, 
    newValue, 
    setNewValue, 
    placeholder, 
    icon: Icon 
  }: any) => (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-primary" />
        <h4 className="font-medium text-sm">{placeholder}</h4>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {preferences.map((pref: any, index: number) => (
          <div key={index} className="flex items-center gap-1">
            <Badge 
              variant="outline" 
              className={`text-xs ${pref.isGolden ? 'border-yellow-400 bg-yellow-50' : ''}`}
            >
              {pref.value}
              <button
                onClick={() => toggleGolden(preferences, setPreferences, index)}
                className="ml-1 hover:text-yellow-500"
              >
                <Star 
                  className={`w-3 h-3 ${pref.isGolden ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                />
              </button>
              <button
                onClick={() => removePreference(preferences, setPreferences, index)}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={`Add ${placeholder.toLowerCase()}`}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addPreference(preferences, setPreferences, newValue, setNewValue)}
          className="text-sm"
        />
        <Button
          size="sm"
          onClick={() => addPreference(preferences, setPreferences, newValue, setNewValue)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Guest name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <PreferenceInput
                  preferences={tablePreferences}
                  setPreferences={setTablePreferences}
                  newValue={newTablePref}
                  setNewValue={setNewTablePref}
                  placeholder="Table Preferences"
                  icon={MapPin}
                />

                <PreferenceInput
                  preferences={foodPreferences}
                  setPreferences={setFoodPreferences}
                  newValue={newFoodPref}
                  setNewValue={setNewFoodPref}
                  placeholder="Food Preferences"
                  icon={UtensilsCrossed}
                />

                <PreferenceInput
                  preferences={winePreferences}
                  setPreferences={setWinePreferences}
                  newValue={newWinePref}
                  setNewValue={setNewWinePref}
                  placeholder="Wine Preferences"
                  icon={Wine}
                />

                <PreferenceInput
                  preferences={spiritsPreferences}
                  setPreferences={setSpiritsPreferences}
                  newValue={newSpiritPref}
                  setNewValue={setNewSpiritPref}
                  placeholder="Spirits Preferences"
                  icon={Wine}
                />

                <PreferenceInput
                  preferences={cocktailPreferences}
                  setPreferences={setCocktailPreferences}
                  newValue={newCocktailPref}
                  setNewValue={setNewCocktailPref}
                  placeholder="Cocktail Preferences"
                  icon={Wine}
                />

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <h4 className="font-medium text-sm">Allergies</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {allergy}
                        <button
                          onClick={() => removeSimpleItem(allergies, setAllergies, index)}
                          className="ml-1 hover:text-red-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add allergy"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSimpleItem(allergies, setAllergies, newAllergy, setNewAllergy)}
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => addSimpleItem(allergies, setAllergies, newAllergy, setNewAllergy)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-yellow-500" />
                    <h4 className="font-medium text-sm">Important Dates</h4>
                  </div>
                  <div className="space-y-2 mb-3">
                    {importantDates.map((date, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div>
                          <div className="font-medium text-sm">{date.event}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(date.date).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => removeImportantDate(index)}
                          className="hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Event name"
                      value={newDateEvent}
                      onChange={(e) => setNewDateEvent(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={newDateValue}
                        onChange={(e) => setNewDateValue(e.target.value)}
                        className="text-sm"
                      />
                      <Button size="sm" onClick={addImportantDate}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-primary" />
                    <h4 className="font-medium text-sm">Connections</h4>
                  </div>
                  <div className="space-y-2 mb-3">
                    {connections.map((connection, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div>
                          <div className="font-medium text-sm">{connection.name}</div>
                          <div className="text-xs text-muted-foreground">{connection.relationship}</div>
                        </div>
                        <button
                          onClick={() => removeConnection(index)}
                          className="hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Connection name"
                      value={newConnectionName}
                      onChange={(e) => setNewConnectionName(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Relationship"
                        value={newConnectionRelationship}
                        onChange={(e) => setNewConnectionRelationship(e.target.value)}
                        className="text-sm"
                      />
                      <Button size="sm" onClick={addConnection}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 lg:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <h4 className="font-medium text-sm">Important Notables</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {importantNotables.map((notable, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {notable}
                        <button
                          onClick={() => removeSimpleItem(importantNotables, setImportantNotables, index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add important notable"
                      value={newNotable}
                      onChange={(e) => setNewNotable(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSimpleItem(importantNotables, setImportantNotables, newNotable, setNewNotable)}
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => addSimpleItem(importantNotables, setImportantNotables, newNotable, setNewNotable)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 mt-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-primary" />
                  <h4 className="font-medium text-sm">Special Notes</h4>
                </div>
                <Textarea
                  placeholder="Enter special notes about this guest..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            {isEditing ? 'Update Guest' : 'Add Guest'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestDialog;
