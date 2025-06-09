
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

interface ImportRow {
  name: string;
  email?: string;
  phone?: string;
  tags?: string;
  tablePreferences?: string;
  foodPreferences?: string;
  winePreferences?: string;
  cocktailPreferences?: string;
  spiritsPreferences?: string;
  allergies?: string;
  notes?: string;
}

const BulkImportDialog: React.FC<BulkImportDialogProps> = ({
  open,
  onOpenChange,
  onImportComplete
}) => {
  const [csvData, setCsvData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{ success: number; errors: string[] } | null>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const template = `name,email,phone,tags,tablePreferences,foodPreferences,winePreferences,cocktailPreferences,spiritsPreferences,allergies,notes
John Doe,john@example.com,555-0123,"VIP,Regular","Window Seat,Quiet Area","Steak,Seafood","Cabernet,Pinot Noir","Old Fashioned,Manhattan","Whiskey,Gin","Shellfish",Special occasion guest
Jane Smith,jane@example.com,555-0124,"Regular","Bar Seating","Vegetarian,Salads","Chardonnay,Sauvignon Blanc","Martini,Cosmopolitan","Vodka","None",Prefers early dining`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'guest_import_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (csvText: string): ImportRow[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows: ImportRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === 0) continue;
      
      const row: ImportRow = { name: '' };
      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'name':
            row.name = value;
            break;
          case 'email':
            row.email = value;
            break;
          case 'phone':
            row.phone = value;
            break;
          case 'tags':
          case 'tablePreferences':
          case 'foodPreferences':
          case 'winePreferences':
          case 'cocktailPreferences':
          case 'spiritsPreferences':
          case 'allergies':
            row[header] = value;
            break;
          case 'notes':
            row.notes = value;
            break;
        }
      });
      
      if (row.name.trim()) {
        rows.push(row);
      }
    }
    
    return rows;
  };

  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
  };

  const importGuests = async () => {
    if (!csvData.trim()) {
      toast({
        title: "Error",
        description: "Please paste CSV data before importing",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    const errors: string[] = [];
    let successCount = 0;

    try {
      const rows = parseCSV(csvData);
      
      if (rows.length === 0) {
        throw new Error("No valid rows found in CSV data");
      }

      for (const [index, row] of rows.entries()) {
        try {
          // Insert customer
          const { data: customer, error: customerError } = await supabase
            .from('customers')
            .insert({
              name: row.name.trim(),
              email: row.email?.trim() || null,
              phone: row.phone?.trim() || null
            })
            .select()
            .single();

          if (customerError) throw customerError;

          // Insert related data
          const customerId = customer.id;

          // Tags
          if (row.tags) {
            const tags = row.tags.split(',').map(t => t.trim()).filter(t => t);
            if (tags.length > 0) {
              await supabase.from('customer_tags').insert(
                tags.map(tag => ({ customer_id: customerId, tag_name: tag }))
              );
            }
          }

          // Table preferences
          if (row.tablePreferences) {
            const prefs = row.tablePreferences.split(',').map(p => p.trim()).filter(p => p);
            if (prefs.length > 0) {
              await supabase.from('table_preferences').insert(
                prefs.map(pref => ({ customer_id: customerId, preference: pref }))
              );
            }
          }

          // Food preferences
          if (row.foodPreferences) {
            const prefs = row.foodPreferences.split(',').map(p => p.trim()).filter(p => p);
            if (prefs.length > 0) {
              await supabase.from('food_preferences').insert(
                prefs.map(pref => ({ customer_id: customerId, preference: pref }))
              );
            }
          }

          // Wine preferences
          if (row.winePreferences) {
            const prefs = row.winePreferences.split(',').map(p => p.trim()).filter(p => p);
            if (prefs.length > 0) {
              await supabase.from('wine_preferences').insert(
                prefs.map(pref => ({ customer_id: customerId, preference: pref }))
              );
            }
          }

          // Cocktail preferences
          if (row.cocktailPreferences) {
            const prefs = row.cocktailPreferences.split(',').map(p => p.trim()).filter(p => p);
            if (prefs.length > 0) {
              await supabase.from('cocktail_preferences').insert(
                prefs.map(pref => ({ customer_id: customerId, preference: pref }))
              );
            }
          }

          // Spirits preferences
          if (row.spiritsPreferences) {
            const prefs = row.spiritsPreferences.split(',').map(p => p.trim()).filter(p => p);
            if (prefs.length > 0) {
              await supabase.from('spirits_preferences').insert(
                prefs.map(pref => ({ customer_id: customerId, preference: pref }))
              );
            }
          }

          // Allergies
          if (row.allergies && row.allergies.toLowerCase() !== 'none') {
            const allergies = row.allergies.split(',').map(a => a.trim()).filter(a => a);
            if (allergies.length > 0) {
              await supabase.from('allergies').insert(
                allergies.map(allergy => ({ customer_id: customerId, allergy }))
              );
            }
          }

          // Notes
          if (row.notes) {
            await supabase.from('customer_notes').insert({
              customer_id: customerId,
              note: row.notes.trim()
            });
          }

          successCount++;
        } catch (error: any) {
          errors.push(`Row ${index + 2} (${row.name}): ${error.message}`);
        }
      }

      setImportResults({ success: successCount, errors });
      
      if (successCount > 0) {
        toast({
          title: "Import Complete",
          description: `Successfully imported ${successCount} guests${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
        });
        
        if (errors.length === 0) {
          onImportComplete();
          onOpenChange(false);
        }
      }
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setCsvData('');
    setImportResults(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Guests</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions */}
          <Card className="p-4 bg-muted">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-primary mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-medium">How to use bulk import:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Download the CSV template below</li>
                  <li>Fill in your guest data following the format</li>
                  <li>Copy and paste the CSV content into the text area</li>
                  <li>Click "Import Guests" to upload</li>
                </ol>
              </div>
            </div>
          </Card>

          {/* Template Download */}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download CSV Template
            </Button>
          </div>

          {/* CSV Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">CSV Data</label>
            <Textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="Paste your CSV data here..."
              className="min-h-[200px] font-mono text-sm"
              disabled={isImporting}
            />
          </div>

          {/* Import Results */}
          {importResults && (
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium">Import Results</h3>
                </div>
                
                <div className="text-sm">
                  <div className="text-green-600">Successfully imported: {importResults.success} guests</div>
                  {importResults.errors.length > 0 && (
                    <div className="mt-2">
                      <div className="text-red-600 mb-1">Errors: {importResults.errors.length}</div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {importResults.errors.map((error, index) => (
                          <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            {importResults && (
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Reset
              </Button>
            )}
            <Button 
              onClick={importGuests}
              disabled={isImporting || !csvData.trim()}
              className="flex-1 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {isImporting ? 'Importing...' : 'Import Guests'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkImportDialog;
