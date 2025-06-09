
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GuestFormData } from '@/hooks/useGuestForm';

interface TagsInputProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ formData, updateField }) => {
  const [currentTag, setCurrentTag] = React.useState('');

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      updateField('tags', [...formData.tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    updateField('tags', formData.tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Tags</label>
      <div className="flex gap-2">
        <Input
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder="Add tag..."
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={addTag}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.tags.map((tag, index) => (
          <Badge key={index} variant="secondary">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 hover:bg-black/20 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagsInput;
