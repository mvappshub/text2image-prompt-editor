import React, { useState, useEffect } from 'react';
import { Folder, FileIcon, ChevronUp, ArrowRight } from 'lucide-react';

interface FileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
}

interface RightSidebarProps {
  onFileSelect: (filePath: string, fileName: string) => void;
}

export function RightSidebar({ onFileSelect }: RightSidebarProps) {
  const [currentPath, setCurrentPath] = useState('');
  const [fileList, setFileList] = useState<FileEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [manualPath, setManualPath] = useState('');

  const loadDirectory = async (path: string) => {
    setIsLoading(true);
    try {
      const files = await window.electron.invoke('readDirectory', path);
      setFileList(files);
      setCurrentPath(path);
      setManualPath(path); // Aktualizujeme i manuální cestu
    } catch (error) {
      console.error('Failed to read directory:', error);
      setFileList([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadDirectory('');
  }, []);

  const handleFileClick = async (entry: FileEntry) => {
    if (entry.isDirectory) {
      loadDirectory(entry.path);
    } else if (entry.path.toLowerCase().endsWith('.txt')) {
      onFileSelect(entry.path, entry.name);
    }
  };

  const handleNavigateUp = () => {
    if (!currentPath) return;
    const parentPath = currentPath.split('\\').slice(0, -1).join('\\');
    loadDirectory(parentPath);
  };

  const handleManualPathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualPath) {
      loadDirectory(manualPath);
    }
  };

  const handleManualPathKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (manualPath) {
        loadDirectory(manualPath);
      }
    }
  };

  return (
    <div className="h-full w-64 flex-shrink-0 p-4 overflow-y-auto border-l border-gray-200 bg-white">
      <h2 className="text-lg font-semibold mb-4">File Browser</h2>
      
      {/* Manual Path Input */}
      <form onSubmit={handleManualPathSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={manualPath}
            onChange={(e) => setManualPath(e.target.value)}
            onKeyDown={handleManualPathKeyDown}
            placeholder="Enter path..."
            className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded"
            title="Navigate to path"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </form>

      {/* Current Path Display */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600 truncate flex-1">
          {currentPath || 'Root'}
        </div>
        {currentPath && (
          <button
            onClick={handleNavigateUp}
            className="p-1 hover:bg-gray-100 rounded"
            title="Up"
          >
            <ChevronUp size={16} />
          </button>
        )}
      </div>

      {/* File List */}
      <div className="border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="divide-y">
            {fileList.map((entry) => (
              <button
                key={entry.path}
                onClick={() => handleFileClick(entry)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
              >
                {entry.isDirectory ? (
                  <Folder size={16} className="text-gray-500" />
                ) : (
                  <FileIcon size={16} className="text-gray-500" />
                )}
                <span className="truncate text-sm">{entry.name}</span>
              </button>
            ))}
            {fileList.length === 0 && !isLoading && (
              <div className="p-4 text-center text-gray-500">
                No files found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
