import { Download, Upload, X, Plus } from 'lucide-react';

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

interface SidebarProps {
  variables: Variable[];
  onVariableCreate: (variable: Variable) => void;
  onVariableRemove: (id: string) => void;
}

export function Sidebar({
  variables,
  onVariableCreate,
  onVariableRemove,
}: SidebarProps) {
  const handleExport = () => {
    if (variables.length === 0) return;

    const csvContent = variables
      .map(variable => {
        const name = variable.name.includes(',') ? `"${variable.name}"` : variable.name;
        const tags = variable.tags
          .map((tag: string) => tag.includes(',') ? `"${tag}"` : tag)
          .join(',');
        return `${name},${tags}`;
      })
      .join('\n');

    const blob = new Blob([`Name,Tags\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `variables-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full w-64 flex-shrink-0 p-4 overflow-y-auto border-r border-gray-200 bg-white">
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

      <input
        type="file"
        id="import-csv"
        accept=".csv,.txt"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const text = await file.text();
            const isTsv = file.name.toLowerCase().endsWith('.txt');
            const separator = isTsv ? '\t' : ',';
            
            const rows = text.split('\n')
              .map(row => row.split(separator)
                .map(cell => cell.trim().replace(/^"(.*)"$/, '$1'))
              )
              .filter(row => row.length > 0 && row.some(cell => cell !== ''));

            if (rows.length > 0) {
              // První řádek obsahuje názvy proměnných
              const variableNames = rows[0].filter(name => name.trim() !== '');
              
              // Pro každý sloupec vytvoříme proměnnou
              variableNames.forEach((name, columnIndex) => {
                const tags = rows.slice(1)
                  .map(row => row[columnIndex])
                  .filter(tag => tag && tag.trim() !== '');

                if (tags.length > 0) {
                  const newVariable = {
                    id: `var-${Date.now()}-${columnIndex}`,
                    name: name.trim(),
                    tags: tags,
                    type: 'variable' as const,
                    selectedTag: tags[0] || '',
                    separator: ',',
                    isLocked: false,
                    weight: 1.0,
                    value: tags[0] || ''
                  };
                  onVariableCreate(newVariable);
                }
              });
            }
          }
        }}
      />

      {/* Variables List */}
      <div className="space-y-2">
        {variables.map((variable) => (
          <div
            key={variable.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
          >
            <div>
              <div className="font-medium">{variable.name}</div>
              <div className="text-sm text-gray-500">{variable.tags.length} tags</div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  const newVariable = {
                    ...variable,
                    id: `var-${Date.now()}`,
                  };
                  onVariableCreate(newVariable);
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Add to Canvas"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => onVariableRemove(variable.id)}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Remove Variable"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}