import React, { useState } from 'react';
import { Download, Upload, Dices, ChevronUp, ChevronDown } from 'lucide-react';
import { VariableCard } from './VariableCard';
import { ConnectorCard } from './ConnectorCard';

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

interface Connector {
  id: string;
  type: 'connector';
  value: string;
}

interface CanvasProps {
  items: (Variable | Connector)[];
  onItemsChange: ((items: (Variable | Connector)[]) => void);
  onItemRemove: (id: string) => void;
  onConnectorChange: (id: string, value: string) => void;
  onAddToSidebar: (variable: Variable) => void;
}

export function Canvas({
  items,
  onItemsChange,
  onItemRemove,
  onConnectorChange,
  onAddToSidebar,
}: CanvasProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVariableName, setNewVariableName] = useState('');

  const handleAddVariable = () => {
    if (!newVariableName) return;
    const newId = `variable-${Date.now()}`;
    onItemsChange([...items, { 
      id: newId, 
      name: newVariableName, 
      tags: [], 
      type: 'variable',
      selectedTag: '',
      separator: ',',
      isLocked: false,
      weight: 1.0,
      value: ''
    }]);
    setNewVariableName('');
    setIsModalOpen(false);
  };

  const handleExportTemplate = () => {
    const template = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      items: items.map(({ id, ...item }) => item)
    };
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (data.items && Array.isArray(data.items)) {
          const newItems = data.items.map((item: any) => ({
            ...item,
            id: `${item.type === 'variable' ? 'var' : 'conn'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          }));
          
          onItemsChange(newItems);
        } else {
          alert('Invalid template format');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import template');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end gap-2 p-4 border-b">
        <button
          onClick={() => {
            const newConnector: Connector = {
              id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: 'connector',
              value: ','
            };
            onItemsChange([...items, newConnector]);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded hover:bg-gray-50"
          title="Add Connector"
        >
          Add Connector
        </button>
        <button
          onClick={() => {
            const updatedItems = [...items];
            updatedItems.forEach((item, index) => {
              if (item.type === 'variable' && !item.isLocked && item.tags.length > 0) {
                const currentIndex = item.tags.indexOf(item.selectedTag);
                let newTag;
                if (currentIndex > 0) {
                  newTag = item.tags[currentIndex - 1];
                } else {
                  newTag = item.tags[item.tags.length - 1];
                }
                updatedItems[index] = {
                  ...item,
                  selectedTag: newTag,
                  value: newTag
                };
              }
            });
            onItemsChange(updatedItems);
          }}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          title="Previous Tags for All"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={() => {
            const updatedItems = [...items];
            updatedItems.forEach((item, index) => {
              if (item.type === 'variable' && !item.isLocked && item.tags.length > 0) {
                const currentIndex = item.tags.indexOf(item.selectedTag);
                let newTag;
                if (currentIndex < item.tags.length - 1) {
                  newTag = item.tags[currentIndex + 1];
                } else {
                  newTag = item.tags[0];
                }
                updatedItems[index] = {
                  ...item,
                  selectedTag: newTag,
                  value: newTag
                };
              }
            });
            onItemsChange(updatedItems);
          }}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          title="Next Tags for All"
        >
          <ChevronDown size={16} />
        </button>
        <button
          onClick={() => {
            const updatedItems = [...items];
            updatedItems.forEach((item, index) => {
              if (item.type === 'variable' && !item.isLocked && item.tags?.length > 0) {
                const randomIndex = Math.floor(Math.random() * item.tags.length);
                const newTag = item.tags[randomIndex];
                updatedItems[index] = {
                  ...item,
                  selectedTag: newTag,
                  value: newTag
                };
              }
            });
            onItemsChange(updatedItems);
          }}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          title="Random Tags for All"
        >
          <Dices size={16} />
        </button>
        <button
          onClick={() => document.getElementById('import-template')?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded hover:bg-gray-50"
          title="Import Template"
        >
          <Upload size={16} />
          Import Template
        </button>
        <button
          onClick={handleExportTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded hover:bg-gray-50"
          title="Export Template"
        >
          <Download size={16} />
          Export Template
        </button>
        <input
          type="file"
          id="import-template"
          accept=".json"
          onChange={handleImportTemplate}
          className="hidden"
        />
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
        <div className="grid grid-cols-3 gap-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="relative transition-opacity duration-200"
            >
              {item.type === 'variable' ? (
                <VariableCard
                  variable={item}
                  onUpdate={(updatedVariable: Variable) => {
                    const newItems = [...items];
                    newItems[index] = {
                      ...updatedVariable,
                      id: item.id,
                      type: 'variable'
                    };
                    onItemsChange(newItems);
                  }}
                  onAddToSidebar={() => onAddToSidebar(item)}
                  onRemove={() => onItemRemove(item.id)}
                />
              ) : (
                <ConnectorCard
                  connector={item}
                  onChange={(value: string) => onConnectorChange(item.id, value)}
                  onRemove={() => onItemRemove(item.id)}
                />
              )}
              <div className="absolute top-0 right-0 flex flex-col">
                <button
                  onClick={() => {
                    if (index > 0) {
                      const newItems = [...items];
                      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
                      onItemsChange(newItems);
                    }
                  }}
                  disabled={index === 0}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50"
                  title="Move Up"
                >
                  ↑
                </button>
                <button
                  onClick={() => {
                    if (index < items.length - 1) {
                      const newItems = [...items];
                      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
                      onItemsChange(newItems);
                    }
                  }}
                  disabled={index === items.length - 1}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50"
                  title="Move Down"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50"
          >
            <span className="text-4xl text-gray-400">+</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded">
            <h2 className="text-lg font-bold">Enter Variable Name</h2>
            <input
              type="text"
              value={newVariableName}
              onChange={(e) => setNewVariableName(e.target.value)}
              className="border p-2 mt-2 mb-4 w-full"
            />
            <button onClick={handleAddVariable} className="bg-blue-500 text-white p-2 rounded mr-2">Add</button>
            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 p-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}