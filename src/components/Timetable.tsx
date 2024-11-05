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
  day: string;
  hour: number;
  onDrop: (item: DraggableItemProps, day: string, hour: number) => void;
  droppedItems: DraggableItemProps[];
}

const DroppableField: React.FC<DroppableFieldProps> = ({ day, hour, onDrop, droppedItems }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item: DraggableItemProps) => onDrop(item, day, hour),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} style={{ padding: '16px', border: '1px solid black', marginBottom: '4px', backgroundColor: isOver ? 'lightgreen' : 'white' }}>
      {day} {hour}:00
      {droppedItems.map((item) => (
        <div key={item.id} style={{ marginTop: '8px' }}>{item.text}</div>
      ))}
    </div>
  );
};

const Timetable: React.FC = () => {
  const [items, setItems] = useState<DraggableItemProps[]>([]);
  const [droppedItems, setDroppedItems] = useState<{ [key: string]: DraggableItemProps[] }>({});

  const addItem = () => {
    const newItem = { id: items.length, text: `Event ${items.length + 1}` };
    setItems([...items, newItem]);
  };

  const handleDrop = (item: DraggableItemProps, day: string, hour: number) => {
    const key = `${day}-${hour}`;
    const currentItems = droppedItems[key] || [];
    setDroppedItems({ ...droppedItems, [key]: [...currentItems, item] });
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <button onClick={addItem}>Add Event</button>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
          {days.map((day) =>
            Array.from({ length: 9 }, (_, i) => 8 + i).map((hour) => (
              <DroppableField
                key={`${day}-${hour}`}
                day={day}
                hour={hour}
                onDrop={handleDrop}
                droppedItems={droppedItems[`${day}-${hour}`] || []}
              />
            ))
          )}
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
