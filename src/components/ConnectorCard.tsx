export interface ConnectorCardProps {
  connector: any;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export function ConnectorCard({ connector, onChange, onRemove }: ConnectorCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <input
        type="text"
        value={connector.value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1 border rounded"
      />
      <button
        onClick={onRemove}
        className="mt-2 px-4 py-1 bg-red-500 text-white rounded"
      >
        Remove
      </button>
    </div>
  );
}