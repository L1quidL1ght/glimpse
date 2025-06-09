
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreferenceItem {
  value: string;
  isGolden: boolean;
}

interface PreferenceInputProps {
  label: string;
  preferences: PreferenceItem[];
  onChange: (preferences: PreferenceItem[]) => void;
  options: string[];
}

const PreferenceInput: React.FC<PreferenceInputProps> = ({
  label,
  preferences,
  onChange,
  options
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(inputValue.toLowerCase()) &&
    !preferences.some(pref => pref.value.toLowerCase() === option.toLowerCase())
  );

  const addPreference = (value: string, isGolden: boolean = false) => {
    if (value.trim() && !preferences.some(pref => pref.value.toLowerCase() === value.toLowerCase())) {
      onChange([...preferences, { value: value.trim(), isGolden }]);
      setInputValue('');
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const removePreference = (index: number) => {
    onChange(preferences.filter((_, i) => i !== index));
  };

  const toggleGolden = (index: number) => {
    const updated = preferences.map((pref, i) =>
      i === index ? { ...pref, isGolden: !pref.isGolden } : pref
    );
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
        addPreference(filteredOptions[selectedIndex]);
      } else if (inputValue.trim()) {
        addPreference(inputValue);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  useEffect(() => {
    if (inputValue) {
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Add ${label.toLowerCase()}...`}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addPreference(inputValue)}
            disabled={!inputValue.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {showSuggestions && filteredOptions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={option}
                className={`px-3 py-2 cursor-pointer text-sm ${
                  index === selectedIndex
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                onClick={() => addPreference(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {preferences.map((pref, index) => (
          <Badge
            key={index}
            variant={pref.isGolden ? "default" : "secondary"}
            className={`cursor-pointer ${
              pref.isGolden ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''
            }`}
            onClick={() => toggleGolden(index)}
          >
            {pref.value}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removePreference(index);
              }}
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

export default PreferenceInput;
