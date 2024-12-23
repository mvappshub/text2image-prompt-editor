import { Download, Upload } from 'lucide-react';
import { importCsvVariables } from '../utils/csvImport';

interface SidebarProps {
  variables: any[];
  onVariableCreate: (variable: any) => void;
  onVariableDelete: (variableId: string) => void;
  onImportVariables?: (variables: any[]) => void;
}

export function Sidebar({
  variables,
  onVariableCreate,
  onVariableDelete,
  onImportVariables,
}: SidebarProps) {
  const escapeCSVCell = (cell: string): string => {
    if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
      return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
  };

  const handleExport = () => {
    if (variables.length === 0) return;

    // First row: variable names
    const csvRows = [variables.map(v => escapeCSVCell(v.name)).join(',')];
    
    // Find the maximum number of tags across all variables
    const maxTags = Math.max(...variables.map(v => v.tags.length));
    
    // Create rows for each tag
    for (let i = 0; i < maxTags; i++) {
      const row = variables.map(variable => {
        const tag = variable.tags[i] || '';
        return escapeCSVCell(tag);
      });
      csvRows.push(row.join(','));
    }

    // Create and download the file
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'variables.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onImportVariables) return;

    const reader = new FileReader();
    reader.onload = async (_e) => {
      try {
        const csvVariables = await importCsvVariables(file);
        onImportVariables(csvVariables);
      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import variables');
      }
    };
    reader.readAsText(file);
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
    const variableId = e.dataTransfer.getData('text/plain');
    if (variableId) {
      onVariableDelete(variableId);
    }
  };

  return (
    <div 
      className="h-full p-4 overflow-y-auto"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Variables</h2>
        <div className="flex gap-2">
          <button
            onClick={() => document.getElementById('import-csv')?.click()}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Import Variables (CSV)"
          >
            <Download size={20} />
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Export Variables (CSV)"
          >
            <Upload size={20} />
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {/* Removed only the Create Variable button, keeping all other functionality intact */}
        <input
          type="file"
          id="import-csv"
          accept=".csv"
          onChange={handleImport}
          className="hidden"
        />
        {variables.map((variable) => (
          <div
            key={variable.id}
            className="flex gap-2"
          >
            <button
              className="flex-1 px-4 py-2 text-left text-sm bg-white hover:bg-gray-50 rounded-lg border"
            >
              {variable.name}
            </button>
            <button
              onClick={() => {
                const newVariable = {
                  ...variable,
                  id: `${variable.id}-${Date.now()}`
                };
                onVariableCreate(newVariable);
              }}
              className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded-lg"
              title="Add to canvas"
            >
              +
            </button>
            <button
              onClick={() => onVariableDelete(variable.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"
              title="Delete variable"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}