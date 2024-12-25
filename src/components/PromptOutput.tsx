import { Copy, Save, Download, X } from 'lucide-react';
import { useState } from 'react';

interface PromptOutputProps {
  items: ({ value: string; separator?: string } | { selectedTag?: string; separator?: string })[];
  onSavePrompt: (prompt: string) => void;
  promptHistory?: string[];
  onExportHistory?: () => void;
  onDeletePrompt?: (index: number) => void;
  showHistory?: boolean;
}

export function PromptOutput({ 
  items, 
  onSavePrompt, 
  promptHistory = [], 
  onExportHistory,
  onDeletePrompt,
  showHistory = false
}: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    return items
      .map((item) => {
        if ('value' in item) {
          return item.value ? item.value + (item.separator || '') : '';
        }
        if ('selectedTag' in item && item.selectedTag) {
          return item.selectedTag + (item.separator || '');
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

  const currentPrompt = generatePrompt();

  if (showHistory) {
    return (
      <div className="bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Prompt History</h3>
          <button
            onClick={onExportHistory}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1"
            title="Export history"
          >
            <Download size={20} />
            Export
          </button>
        </div>
        <div className="space-y-2">
          {promptHistory.map((prompt, index) => (
            <div key={index} className="p-2 bg-white rounded border group relative">
              {prompt}
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
            onClick={() => onSavePrompt(currentPrompt)}
            className="p-2 text-gray-600 hover:bg-yellow-200 rounded"
            title="Save to history"
          >
            <Save size={20} />
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
              <span 
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-base text-gray-500 bg-gray-100 bg-opacity-75 rounded px-2 py-1"
                style={{
                  animation: 'fadeInOut 1500ms ease-in-out'
                }}
              >
                Copied
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="p-3 bg-white rounded min-h-[60px] whitespace-pre-wrap">
        {currentPrompt || 'Add variables and connectors to generate your prompt'}
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