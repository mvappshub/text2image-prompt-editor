import { useState } from 'react';
import { Canvas } from './components/Canvas';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { PromptOutput } from './components/PromptOutput';

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

interface PromptHistoryEntry {
  id: number;
  prompt: string;
  timestamp: string;
}

function App() {
  const [items, setItems] = useState<(Variable | Connector)[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [promptHistory, setPromptHistory] = useState<PromptHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleVariableCreate = (variable: Variable) => {
    // Kontrola, zda proměnná již neexistuje v items
    const existingVariable = items.find(item => 
      item.type === 'variable' && item.name === variable.name
    );
    
    if (!existingVariable) {
      setItems(prev => [...prev, variable]);
    }
    
    // Přidání do sidebaru pouze pokud tam ještě není
    const existingInSidebar = variables.find(v => v.name === variable.name);
    if (!existingInSidebar) {
      setVariables(prev => [...prev, variable]);
    }
  };

  const handleVariableRemove = (id: string) => {
    setVariables(prev => prev.filter(v => v.id !== id));
  };

  const handleItemRemove = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleHistoryClose = () => {
    setShowHistory(false);
  };

  const handleFileSelect = async (filePath: string, fileName: string) => {
    if (filePath.toLowerCase().endsWith('.txt')) {
      try {
        const content = await window.electron.invoke('readFile', filePath);
        const lines = content.toString()
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line !== '');

        if (lines.length > 0) {
          // Použijeme název souboru (bez přípony .txt) jako název karty
          const cardName = fileName.toLowerCase().endsWith('.txt') 
            ? fileName.slice(0, -4) 
            : fileName;

          // Vytvoříme jednu proměnnou s obsahem souboru jako tagy
          const newVariable: Variable = {
            id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: cardName,
            tags: lines,
            type: 'variable',
            selectedTag: lines[0] || '',
            separator: ',',
            isLocked: false,
            weight: 1.0,
            value: lines[0] || ''
          };

          // Přidáme novou proměnnou na canvas
          setItems(prev => [...prev, newVariable]);
        }
      } catch (error) {
        console.error('Failed to import TXT file:', error);
        alert('Failed to import TXT file');
      }
    }
  };

  const handleSavePrompt = (prompt: string) => {
    const newEntry: PromptHistoryEntry = {
      id: Date.now(),
      prompt,
      timestamp: new Date().toISOString()
    };
    setPromptHistory(prev => [...prev, newEntry]);
  };

  const handleHistoryToggle = () => {
    setShowHistory(prev => !prev);
  };

  const handleExportHistory = () => {
    const historyText = promptHistory
      .map(entry => `${entry.timestamp}\n${entry.prompt}\n---\n`)
      .join('\n');
    
    const blob = new Blob([historyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeletePrompt = (index: number) => {
    setPromptHistory(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-screen flex">
      <Sidebar
        variables={variables}
        onVariableCreate={handleVariableCreate}
        onVariableRemove={handleVariableRemove}
      />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white">
          <PromptOutput 
            items={items} 
            onSavePrompt={handleSavePrompt}
            showHistory={showHistory}
            promptHistory={promptHistory}
            onExportHistory={handleExportHistory}
            onDeletePrompt={handleDeletePrompt}
            onHistoryClose={handleHistoryClose}
            onHistoryToggle={handleHistoryToggle}
          />
        </div>
        <div className="flex-1 relative">
          <Canvas
            items={items}
            onItemsChange={setItems}
            onItemRemove={handleItemRemove}
            onConnectorChange={(id: string, value: string) => {
              setItems(prev => prev.map(item => 
                item.id === id ? { ...item, value } : item
              ));
            }}
            onAddToSidebar={(variable: Variable) => {
              handleVariableCreate(variable);
            }}
          />
        </div>
      </div>
      <RightSidebar onFileSelect={handleFileSelect} />
    </div>
  );
}

export default App;
