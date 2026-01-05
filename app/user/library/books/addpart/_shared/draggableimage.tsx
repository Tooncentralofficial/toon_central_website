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
  isLocked,
  onToggleLock,
  canLockOrMonetize = true,
}: {
  value: any;
  removeImage: (i: number) => void;
  i: number;
  moveImage: (fromIndex: number, toIndex: number) => void;
  isLocked: boolean;
  onToggleLock: (index: number) => void;
  canLockOrMonetize?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Handle drop logic
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: string | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor: any) {
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
      className={`relative h-[260px] md:h-[312px] w-full rounded-[8px] overflow-hidden ${
        isLocked ? "border-2 border-[#FFA500]" : ""
      }`}
    >
      <img src={value} alt="" className="w-full h-full object-cover" />

      {/* Lock overlay when locked */}
      {isLocked && (
        <div className="absolute inset-0 bg-[#000000]/80 flex items-center justify-center z-10">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      )}

      {/* Lock toggle button - top-left */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (canLockOrMonetize) {
            onToggleLock(i);
          }
        }}
        className={`absolute top-2 left-2 bg-[#ffffff] rounded-[50%] p-2 w-[28px] h-[28px] flex items-center justify-center text-[#000000] transition-colors z-20 ${
          canLockOrMonetize
            ? "cursor-pointer hover:bg-[#f0f0f0]"
            : "cursor-not-allowed opacity-50"
        }`}
        title={
          !canLockOrMonetize
            ? "You need at least 4 chapters to lock panels"
            : isLocked
            ? "Unlock panel"
            : "Lock panel"
        }
      >
        {isLocked ? (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>

      {/* Remove button - top-right */}
      <div
        onClick={() => removeImage(i)}
        className="cursor-pointer absolute top-0 right-0 bg-[#ffffff] rounded-[50%] p-2 w-[20px] h-[20px] flex items-center justify-center text-[#000000] z-20"
      >
        x
      </div>
    </div>
  );
};

export default DraggableImage;
