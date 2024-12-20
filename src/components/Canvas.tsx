import React from 'react';
import { VariableCard } from './VariableCard';
import { ConnectorCard } from './ConnectorCard';
import { Download, Upload } from 'lucide-react';

interface CanvasProps {
  items: any[];
  onItemsChange: (items: any[]) => void;
  onItemRemove: (id: string) => void;
  onConnectorChange: (id: string, value: string) => void;
}

export function Canvas({
  items,
  onItemsChange,
  onItemRemove,
  onConnectorChange,
}: CanvasProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDrop = (dragIndex: number, dropIndex: number) => {
    if (dragIndex === dropIndex) return;
    
    const newItems = [...items];
    const [removed] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, removed);
    onItemsChange(newItems);
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

  const isVariable = (item: any): boolean => {
    return item.type === 'variable';
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
            id: `${isVariable(item) ? 'var' : 'conn'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'tags' in item ? 'variable' : 'connector'
          })) as any[];
          
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
              draggable
              className="relative transition-opacity duration-200"
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.opacity = '1';
                const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                if (!isNaN(dragIndex)) {
                  handleDrop(dragIndex, index);
                }
              }}
            >
              {isVariable(item) ? (
                <VariableCard
                  variable={item}
                  index={index}
                  onUpdate={(updatedVariable) => {
                    const newItems = [...items];
                    newItems[index] = {
                      ...updatedVariable,
                      id: item.id,
                      type: 'variable'
                    } as any;
                    onItemsChange(newItems);
                  }}
                  onRemove={() => onItemRemove(item.id)}
                  onDragStart={(e) => handleDragStart(e, index)}
                />
              ) : (
                <ConnectorCard
                  connector={item}
                  onChange={(value) => onConnectorChange(item.id, value)}
                  onRemove={() => onItemRemove(item.id)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}