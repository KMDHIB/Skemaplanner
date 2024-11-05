import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface DraggableItemProps {
  id: number;
  text: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, text }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: { id, text },
    collect: (monitor: { isDragging: () => boolean }) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, padding: '8px', border: '1px solid black', marginBottom: '4px' }}>
      {text}
    </div>
  );
};

interface DroppableFieldProps {
  hour: number;
  onDrop: (item: DraggableItemProps, hour: number) => void;
  droppedItem?: DraggableItemProps;
}

const DroppableField: React.FC<DroppableFieldProps> = ({ hour, onDrop, droppedItem }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item: DraggableItemProps) => onDrop(item, hour),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} style={{ padding: '16px', border: '1px solid black', marginBottom: '4px', backgroundColor: isOver ? 'lightgreen' : 'white' }}>
      {hour}:00
      {droppedItem && <div style={{ marginTop: '8px' }}>{droppedItem.text}</div>}
    </div>
  );
};

const Timetable: React.FC = () => {
  const [items, setItems] = useState<DraggableItemProps[]>([]);
  const [droppedItems, setDroppedItems] = useState<{ [key: number]: DraggableItemProps }>({});

  const addItem = () => {
    const newItem = { id: items.length, text: `Event ${items.length + 1}` };
    setItems([...items, newItem]);
  };

  const handleDrop = (item: DraggableItemProps, hour: number) => {
    setDroppedItems({ ...droppedItems, [hour]: item });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <button onClick={addItem}>Add Event</button>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
          {Array.from({ length: 9 }, (_, i) => 8 + i).map((hour) => (
            <DroppableField key={hour} hour={hour} onDrop={handleDrop} droppedItem={droppedItems[hour]} />
          ))}
        </div>
        <div style={{ marginTop: '16px' }}>
          {items.map((item) => (
            <DraggableItem key={item.id} id={item.id} text={item.text} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Timetable;
