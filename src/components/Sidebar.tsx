import { Download, Upload } from 'lucide-react';
import { importCsvVariables } from '../utils/csvImport';

interface SidebarProps {
  variables: any[];
  onVariableAdd: (variableId: string) => void;
  onVariableCreate: (variable: any) => void;
  onVariableDelete: (variableId: string) => void;
  onImportVariables?: (variables: any[]) => void;
}

export function Sidebar({
  variables,
  onVariableAdd,
  onVariableCreate,
  onVariableDelete,
  onImportVariables,
}: SidebarProps) {
  const handleExport = () => {
    // Implement the CSV export functionality
    console.log('Exporting variables as CSV...');
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

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Variables</h2>
        <div className="flex gap-2">
          <button
            onClick={() => document.getElementById('import-csv')?.click()}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Import Variables (CSV)"
          >
            <Upload size={20} />
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Export Variables (CSV)"
          >
            <Download size={20} />
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <button
          onClick={() => onVariableCreate({ name: 'New Variable', tags: [], type: 'variable', value: '' })}
          className="w-full px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
        >
          Create Variable
        </button>
        <input
          type="file"
          id="import-csv"
          accept=".csv"
          onChange={handleImport}
          className="hidden"
        />
        {variables.map((variable) => (
          <div key={variable.id} className="flex gap-2">
            <button
              onClick={() => onVariableAdd(variable.id)}
              className="flex-1 px-4 py-2 text-left text-sm bg-white hover:bg-gray-50 rounded-lg border"
            >
              {variable.name}
            </button>
            <button
              onClick={() => onVariableDelete(variable.id)}
              className="px-2 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded-lg"
              aria-label="Delete variable"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}