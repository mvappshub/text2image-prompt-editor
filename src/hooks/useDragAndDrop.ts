import { useCallback } from 'react';

export function useDragAndDrop(
  moveItem: (dragIndex: number, hoverIndex: number) => void
) {
  const handleDragStart = useCallback((event: React.DragEvent, index: number) => {
    event.dataTransfer.setData('text/plain', index.toString());
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((event: React.DragEvent, dropIndex: number) => {
    event.preventDefault();
    const dragIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
    if (dragIndex !== dropIndex) {
      moveItem(dragIndex, dropIndex);
    }
  }, [moveItem]);

  return { handleDragStart, handleDragOver, handleDrop };
}