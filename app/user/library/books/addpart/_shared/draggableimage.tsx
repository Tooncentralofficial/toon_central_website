import React, { useRef } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";

// Define ItemTypes
const ItemTypes = { CARD: "card" };

interface DragItem {
  index: number;
  id: string; // Add any other properties for the item being dragged
}

const DraggableImage = ({
  value,
  removeImage,
  i,
  moveImage,
}: {
  value: any;
  removeImage: (i: number) => void;
  i: number;
  moveImage: (fromIndex: number, toIndex: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Handle drop logic
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: string | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor:any) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = i;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY =
        (clientOffset as { x: number; y: number }).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => ({ id: value, index: i }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className="relative h-[260px] md:h-[312px] w-full rounded-[8px] overflow-hidden"
    >
      <img src={value} alt="" className="w-full h-full object-cover" />
      <div
        onClick={() => removeImage(i)}
        className="cursor-pointer absolute top-0 right-0 bg-[#ffffff] rounded-[50%] p-2 w-[20px] h-[20px] flex items-center justify-center text-[#000000]"
      >
        x
      </div>
    </div>
  );
};

export default DraggableImage;
