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
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'variable', data: items[index] }));
    if (items[index].type === 'variable') {
      e.dataTransfer.setData('variableId', items[index].id);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '#f3f4f6';
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '';
    const data = e.dataTransfer.getData('text/plain');
    
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.type === 'variable') {
        const newId = `${parsedData.data.id}-${Date.now()}`;
        onItemsChange([...items, { ...parsedData.data, id: newId }]);
      }
    } catch (error) {
      console.error('Failed to parse dropped data:', error);
    }
  };

  const handleDropSidebar = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const variableId = e.dataTransfer.getData('variableId');
    if (variableId) {
      onItemRemove(variableId);
    }
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
    <div className="flex flex-col h-full" onDrop={handleDropSidebar} onDragOver={(e) => e.preventDefault()}>
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
      <div 
        className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="grid grid-cols-3 gap-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable
              className="relative transition-opacity duration-200"
              onDragStart={(e) => handleDragStart(e, index)}
            >
              {isVariable(item) ? (
                <VariableCard
                  variable={item}
                  index={index}
                  onDragStart={handleDragStart}
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