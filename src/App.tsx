import { useState } from 'react';
import { variables as defaultVariables } from './data/variables';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PromptOutput } from './components/PromptOutput';

function App() {
  const [variables, setVariables] = useState<any[]>(() => defaultVariables);
  const [items, setItems] = useState<any[]>([]);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);

  const handleVariableCreate = (variable: any) => {
    const newVariable: any = {
      ...variable,
      id: `var-${Date.now()}`,
    };
    setItems(prevItems => [...prevItems, newVariable]);
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

  const handleSavePrompt = (prompt: string) => {
    setPromptHistory(prev => [...prev, prompt]);
  };

  const handleDeletePrompt = (index: number) => {
    setPromptHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleExportHistory = () => {
    const text = promptHistory.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddToSidebar = (variable: any) => {
    const newVariable = {
      ...variable,
      id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setVariables(prev => [...prev, newVariable]);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          variables={variables}
          onVariableCreate={handleVariableCreate}
          onVariableDelete={handleVariableDelete}
          onImportVariables={handleImportVariables}
        />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-4 border-b bg-white">
            <PromptOutput 
              items={items} 
              onSavePrompt={handleSavePrompt}
              showHistory={false}
            />
          </div>
          <div className="flex-1 min-h-0">
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
              onAddToSidebar={handleAddToSidebar}
            />
          </div>
          {promptHistory.length > 0 && (
            <div className="p-4 border-t bg-white max-h-48 overflow-y-auto">
              <PromptOutput 
                items={[]}
                onSavePrompt={handleSavePrompt}
                promptHistory={promptHistory}
                onExportHistory={handleExportHistory}
                onDeletePrompt={handleDeletePrompt}
                showHistory={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
