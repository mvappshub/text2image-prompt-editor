import React, { useState, useEffect, useRef } from 'react';
import { GripHorizontal, ListRestart, Dices, LockKeyhole, X, List } from 'lucide-react';

interface VariableCardProps {
  variable: any;
  index: number;
  onUpdate: (variable: any) => void;
  onRemove: () => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
}

export function VariableCard({
  variable,
  index,
  onUpdate,
  onRemove,
  onDragStart,
}: VariableCardProps) {
  const [selectedTag, setSelectedTag] = useState(variable.selectedTag || '');
  const [separator, setSeparator] = useState(variable.separator || ',');
  const [isLocked, setIsLocked] = useState(variable.isLocked || false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onUpdate({
      ...variable,
      selectedTag,
      separator,
      isLocked,
      value: selectedTag || variable.tags[0] || ''
    });
  }, [selectedTag, separator, isLocked]);

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
      setSelectedTag(availableTags[randomIndex]);
    }
  };

  const handleReset = () => {
    if (isLocked) return;
    setSelectedTag(variable.tags[0] || '');
    setSeparator(',');
  };

  const handleTagInput = (value: string) => {
    if (!isLocked) {
      setSelectedTag(value);
      // If the value matches a tag exactly, keep it in the tags list
      if (!variable.tags.includes(value)) {
        variable.tags = [...variable.tags, value];
      }
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

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      className="group relative flex flex-col gap-2 p-4 bg-white border rounded-lg shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <GripHorizontal className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
        <h3 className="flex-1 text-sm font-medium text-gray-900">{variable.name}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            title="Reset"
          >
            <ListRestart size={16} />
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
          <button
            onClick={onRemove}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"
            title="Remove"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Tag input */}
      <div className="flex flex-col gap-2" ref={dropdownRef}>
        <div className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={selectedTag}
              onChange={(e) => handleTagInput(e.target.value)}
              disabled={isLocked}
              className="flex-grow px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter or select a tag"
            />
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