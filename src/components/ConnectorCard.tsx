import { X } from 'lucide-react';

export interface ConnectorCardProps {
  connector: any;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export function ConnectorCard({ connector, onChange, onRemove }: ConnectorCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="relative flex items-center">
        <input
          type="text"
          value={connector.value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-grow px-2 py-1 border rounded mr-8"
        />
        <button
          onClick={onRemove}
          className="absolute right-2 p-1 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded"
          title="Remove"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}