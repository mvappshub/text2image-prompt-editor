import { Copy } from 'lucide-react';

interface PromptOutputProps {
  items: ({ value: string; separator?: string } | { selectedTag?: string; separator?: string })[];
}

export function PromptOutput({ items }: PromptOutputProps) {
  const generatePrompt = () => {
    return items
      .map((item) => {
        if ('value' in item) {
          return item.value + (item.separator || ',');
        }
        if ('selectedTag' in item && item.selectedTag) {
          return item.selectedTag + (item.separator || ',');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePrompt());
  };

  return (
    <div className="mb-6 mt-4 bg-yellow-100 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Generated Prompt</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {generatePrompt().length} characters
          </span>
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 hover:bg-yellow-200 rounded"
            title="Copy to clipboard"
          >
            <Copy size={20} />
          </button>
        </div>
      </div>
      <div className="p-3 bg-white rounded min-h-[60px] whitespace-pre-wrap">
        {generatePrompt() || 'Add variables and connectors to generate your prompt'}
      </div>
    </div>
  );
}