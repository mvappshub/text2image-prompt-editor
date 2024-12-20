import { useState } from 'react';
import { variables as defaultVariables } from './data/variables';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PromptOutput } from './components/PromptOutput';

function App() {
  const [variables, setVariables] = useState<any[]>(() => defaultVariables);
  const [items, setItems] = useState<any[]>([]);

  const handleVariableCreate = (variable: any) => {
    const newVariable: any = {
      ...variable,
      id: `var-${Date.now()}`,
    };
    setVariables(prev => [...prev, newVariable]);
  };

  const handleVariableDelete = (variableId: string) => {
    setVariables(variables.filter((variable: any) => variable.id !== variableId));
  };

  const handleItemRemove = (id: string) => {
    setItems(prevItems => prevItems.filter((item: any) => item.id !== id));
  };

  const handleImportVariables = (importedVariables: any[]) => {
    const newVariables = importedVariables.map((variable: any) => ({
      ...variable,
      id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    setVariables(prev => [...prev, ...newVariables]);
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-white">
        <Sidebar
          variables={variables}
          onVariableCreate={handleVariableCreate}
          onVariableDelete={handleVariableDelete}
          onImportVariables={handleImportVariables}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white">
          <PromptOutput items={items} />
        </div>
        <div className="p-4 border-b bg-white">
          <button
            onClick={() => {
              const newId = `connector-${Date.now()}`;
              setItems(prevItems => [...prevItems, { id: newId, type: 'connector', value: '' }]);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Connector
          </button>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <Canvas
              items={items}
              onItemsChange={setItems}
              onItemRemove={handleItemRemove}
              onConnectorChange={(id: string, value: string) => {
                setItems(prevItems =>
                  prevItems.map((item: any) =>
                    item.id === id && !('tags' in item)
                      ? { ...item, value }
                      : item
                  )
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
