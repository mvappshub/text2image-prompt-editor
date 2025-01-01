import { useState } from 'react';
import { Copy, Save, X, History } from 'lucide-react';

interface PromptHistoryEntry {
  id: number;
  prompt: string;
  timestamp: string;
}

interface PromptOutputProps {
  items: { type: string; value: string }[];
  onSavePrompt: (prompt: string) => void;
  promptHistory?: PromptHistoryEntry[];
  onExportHistory?: () => void;
  onDeletePrompt?: (index: number) => void;
  onHistoryClose?: () => void;
  onHistoryToggle?: () => void;
  showHistory?: boolean;
}

export function PromptOutput({
  items,
  onSavePrompt,
  promptHistory = [],
  onExportHistory,
  onDeletePrompt,
  onHistoryClose,
  onHistoryToggle,
  showHistory = false
}: PromptOutputProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const generatePrompt = () => {
    return items
      .map(item => {
        if (item.type === 'variable') {
          return item.value;
        } else if (item.type === 'connector') {
          return item.value;
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = () => {
    onSavePrompt(currentPrompt);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const currentPrompt = generatePrompt();

  if (showHistory) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Prompt History</h2>
            <div className="flex gap-2">
              <button
                onClick={onExportHistory}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Export
              </button>
              <button
                onClick={onHistoryClose}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {promptHistory.map((entry, index) => (
                <div key={entry.id} className="p-2 bg-white rounded border group relative">
                  <div className="text-xs text-gray-500 mb-1">{new Date(entry.timestamp).toLocaleString()}</div>
                  {entry.prompt}
                  <button
                    onClick={() => onDeletePrompt?.(index)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete prompt"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-100 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Generated Prompt</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {currentPrompt.length} characters
          </span>
          <button
            onClick={onHistoryToggle}
            className="p-2 text-gray-600 hover:bg-yellow-200 rounded"
            title="Show History"
          >
            <History size={20} />
          </button>
          <button
            onClick={handleSave}
            className="p-2 text-gray-600 hover:bg-yellow-200 rounded"
            title="Save to history"
          >
            <Save size={20} />
            {saved && (
              <div className="fixed top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded shadow-lg z-50">
                Saved to history
              </div>
            )}
          </button>
          <div className="relative">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-600 hover:bg-yellow-200 active:bg-yellow-300 rounded transition-transform active:scale-95"
              title="Copy to clipboard"
            >
              <Copy size={20} />
            </button>
            {copied && (
              <div className="fixed top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded shadow-lg z-50">
                Copied to clipboard
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative">
        <div 
          className="w-full p-2 bg-gray-50 rounded border border-gray-200 text-sm overflow-y-auto whitespace-pre-wrap break-words"
          style={{ height: '6rem', maxHeight: '6rem', overflowY: 'auto' }}
        >
          {currentPrompt || 'Add variables and connectors to generate your prompt'}
        </div>
      </div>
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -2px); }
            15% { opacity: 1; transform: translate(-50%, 0); }
            85% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -2px); }
          }
        `}
      </style>
    </div>
  );
}