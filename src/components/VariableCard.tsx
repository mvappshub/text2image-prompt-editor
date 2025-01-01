import React, { useState, useEffect, useRef } from 'react';
import { Dices, LockKeyhole, X, List, BookmarkPlus, ChevronUp, ChevronDown, Plus, Minus } from 'lucide-react';

interface Variable {
  id: string;
  name: string;
  tags: string[];
  type: 'variable';
  selectedTag: string;
  separator: string;
  isLocked: boolean;
  weight: number;
  value: string;
}

interface VariableCardProps {
  variable: Variable;
  onUpdate: (variable: Variable) => void;
  onRemove: () => void;
  onAddToSidebar?: () => void;
}

export function VariableCard({
  variable,
  onUpdate,
  onRemove,
  onAddToSidebar,
}: VariableCardProps) {
  const [selectedTag, setSelectedTag] = useState(variable.selectedTag || '');
  const [separator, setSeparator] = useState(variable.separator || ',');
  const [isLocked, setIsLocked] = useState(variable.isLocked || false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [weight, setWeight] = useState(variable.weight || 1.0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedTag(variable.selectedTag || '');
    setWeight(variable.weight || 1.0);
  }, [variable.selectedTag, variable.weight]);

  const formatTag = (tag: string, tagWeight: number) => {
    return tagWeight !== 1.0 ? `(${tag}:${tagWeight.toFixed(2)})` : tag;
  };

  useEffect(() => {
    const formattedTag = selectedTag ? formatTag(selectedTag, weight) : (variable.tags[0] || '');
    onUpdate({
      ...variable,
      selectedTag,
      separator,
      isLocked,
      weight,
      value: formattedTag
    });
  }, [selectedTag, separator, isLocked, weight]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRandomTag = () => {
    if (isLocked) return;
    const availableTags = variable.tags;
    if (availableTags.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTags.length);
      const newTag = availableTags[randomIndex];
      setSelectedTag(newTag);
      setWeight(1.0);
    }
  };

  const handleTagInput = (value: string) => {
    if (!isLocked) {
      setSelectedTag(value);
      if (value.endsWith('\n')) {
        const newTag = value.trim();
        if (newTag && !variable.tags.includes(newTag)) {
          variable.tags = [...variable.tags, newTag];
        }
        setSelectedTag('');
        setWeight(1.0);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLocked) {
      e.preventDefault();
      const newTag = selectedTag.trim();
      if (newTag && !variable.tags.includes(newTag)) {
        variable.tags = [...variable.tags, newTag];
      }
      setSelectedTag('');
      setWeight(1.0);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const newTags = text.split('\n').map(tag => tag.trim()).filter(Boolean);
        variable.tags = [...new Set([...variable.tags, ...newTags])];
      };
      reader.readAsText(file);
    }
  };

  const handlePreviousTag = () => {
    if (isLocked) return;
    const currentIndex = variable.tags.indexOf(selectedTag);
    if (currentIndex > 0) {
      setSelectedTag(variable.tags[currentIndex - 1]);
    } else if (currentIndex === -1 && variable.tags.length > 0) {
      setSelectedTag(variable.tags[variable.tags.length - 1]);
    } else if (variable.tags.length > 0) {
      setSelectedTag(variable.tags[variable.tags.length - 1]);
    }
    setWeight(1.0);
  };

  const handleNextTag = () => {
    if (isLocked) return;
    const currentIndex = variable.tags.indexOf(selectedTag);
    if (currentIndex < variable.tags.length - 1) {
      setSelectedTag(variable.tags[currentIndex + 1]);
    } else if (currentIndex === -1 && variable.tags.length > 0) {
      setSelectedTag(variable.tags[0]);
    } else if (variable.tags.length > 0) {
      setSelectedTag(variable.tags[0]);
    }
    setWeight(1.0);
  };

  const increaseWeight = () => {
    if (!isLocked && selectedTag) {
      setWeight((prev: number) => prev + 0.05);
    }
  };

  const decreaseWeight = () => {
    if (!isLocked && selectedTag) {
      setWeight((prev: number) => Math.max(0.55, prev - 0.05));
    }
  };

  return (
    <div
      className="group relative flex flex-col gap-2 p-4 bg-white border rounded-lg shadow-sm"
      data-variable-card
    >
      <div className="flex items-center gap-2">
        <h3 className="flex-1 text-sm font-medium text-gray-900">{variable.name}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={decreaseWeight}
            disabled={isLocked || !selectedTag}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            title="Decrease weight"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={increaseWeight}
            disabled={isLocked || !selectedTag}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            title="Increase weight"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={handleRandomTag}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            title="Random Tag"
          >
            <Dices size={16} />
          </button>
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`p-1.5 ${isLocked ? 'text-blue-500' : 'text-gray-500'} hover:text-gray-700 hover:bg-gray-100 rounded-lg`}
            title={isLocked ? 'Unlock' : 'Lock'}
          >
            <LockKeyhole size={16} />
          </button>
          {onAddToSidebar && (
            <button
              onClick={onAddToSidebar}
              className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded-lg"
              title="Add to Sidebar"
            >
              <BookmarkPlus size={16} />
            </button>
          )}
          <button
            onClick={onRemove}
            title="Remove"
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2" ref={dropdownRef}>
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-grow flex items-center gap-2">
              <input
                type="text"
                value={selectedTag}
                onChange={(e) => handleTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLocked}
                className="flex-grow px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter or select a tag"
              />
              {selectedTag && weight !== 1.0 && (
                <div className="text-sm text-gray-500 min-w-[3rem]">
                  {weight.toFixed(2)}
                </div>
              )}
            </div>
            <button
              onClick={handlePreviousTag}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Previous tag"
            >
              <ChevronUp size={16} />
            </button>
            <button
              onClick={handleNextTag}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Next tag"
            >
              <ChevronDown size={16} />
            </button>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Show tag list"
            >
              <List size={16} />
            </button>
          </div>
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              <div className="p-2 border-b">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileInput}
                  className="hidden"
                  id={`file-input-${variable.id}`}
                />
                <button
                  onClick={() => document.getElementById(`file-input-${variable.id}`)?.click()}
                  className="w-full px-2 py-1 text-sm text-left text-gray-700 hover:bg-gray-100 rounded"
                >
                  Import tags from file...
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {variable.tags.map((tag: string) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag);
                      setWeight(1.0);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-2 py-1 text-sm text-left text-gray-700 hover:bg-gray-100"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <input
          type="text"
          value={separator}
          onChange={(e) => setSeparator(e.target.value)}
          disabled={isLocked}
          placeholder="Separator"
          className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}