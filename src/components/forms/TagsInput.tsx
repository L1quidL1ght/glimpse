
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GuestFormData } from '@/hooks/useGuestForm';
import { TagIcon } from '@/components/ui/tag-icon';

interface TagsInputProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
}

const PREDEFINED_TAGS = [
  '333 Club',
  'VIP', 
  'Regular',
  'Anniversary',
  'Birthday',
  'Special Occasion',
  'Frequent',
  'Premium'
];

const TagsInput: React.FC<TagsInputProps> = ({ formData, updateField }) => {
  const [currentTag, setCurrentTag] = React.useState('');

  const addTag = (tagToAdd?: string) => {
    const tag = tagToAdd || currentTag;
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      updateField('tags', [...formData.tags, tag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    updateField('tags', formData.tags.filter((_, i) => i !== index));
  };

  const addPredefinedTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      updateField('tags', [...formData.tags, tag]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-foreground">Tags</label>
      
      {/* Quick Add Predefined Tags */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">Quick Add:</div>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_TAGS.map((tag) => (
            <Button
              key={tag}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addPredefinedTag(tag)}
              disabled={formData.tags.includes(tag)}
              className="h-7 text-xs flex items-center gap-1"
            >
              <TagIcon tagName={tag} className="w-3 h-3" />
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Tag Input */}
      <div className="flex gap-2">
        <Input
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder="Add custom tag..."
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={() => addTag()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2">
        {formData.tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            <TagIcon tagName={tag} className="w-3 h-3" />
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
