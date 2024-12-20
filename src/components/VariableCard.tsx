import React, { useState, useEffect } from 'react';
import { GripHorizontal, ListRestart, Dices, LockKeyhole, X } from 'lucide-react';

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

  useEffect(() => {
    onUpdate({
      name: variable.name,
      tags: variable.tags,
      selectedTag,
      separator,
      isLocked,
      value: selectedTag || variable.tags[0] || ''
    });
  }, [selectedTag, separator, isLocked]);

  const handleRandomTag = () => {
    const availableTags = variable.tags.filter(tag => !isLocked || tag === selectedTag);
    if (availableTags.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTags.length);
      setSelectedTag(availableTags[randomIndex]);
    }
  };

  const handleReset = () => {
    setSelectedTag(variable.tags[0] || '');
    setSeparator(',');
    setIsLocked(false);
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
      <div className="flex flex-col gap-2">
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select a tag</option>
          {variable.tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={separator}
          onChange={(e) => setSeparator(e.target.value)}
          placeholder="Separator"
          className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}