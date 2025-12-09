import React, { useRef, useState, useEffect } from 'react';
import { CanvasElement } from '../../types';
import { Move, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (id: string, updates: Partial<CanvasElement>) => void;
  onRemove: (id: string) => void;
}

export const CanvasElementWrapper: React.FC<Props> = ({
  element,
  isSelected,
  onSelect,
  onChange,
  onRemove
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Helper to handle drag start
  const handleDragStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect(element.id);
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = element.x;
    const initialY = element.y;

    const onMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      onChange(element.id, {
        x: initialX + dx,
        y: initialY + dy
      });
    };

    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Helper for resizing (Bottom Right Handle)
  const handleResizeStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width;
    const startHeight = element.height;
    const rotationRad = (element.rotation * Math.PI) / 180;

    const onMove = (moveEvent: PointerEvent) => {
      const dxGlobal = moveEvent.clientX - startX;
      const dyGlobal = moveEvent.clientY - startY;

      // Project global delta onto local axes to handle rotation correctly
      const dxLocal = dxGlobal * Math.cos(rotationRad) + dyGlobal * Math.sin(rotationRad);
      const dyLocal = -dxGlobal * Math.sin(rotationRad) + dyGlobal * Math.cos(rotationRad);

      onChange(element.id, {
        width: Math.max(50, startWidth + dxLocal),
        height: Math.max(20, startHeight + dyLocal)
      });
    };

    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Helper for rotation (Top Handle)
  const handleRotateStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    
    // Center of element
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const onMove = (moveEvent: PointerEvent) => {
      const mx = moveEvent.clientX;
      const my = moveEvent.clientY;
      
      // Calculate angle
      const angleRad = Math.atan2(my - centerY, mx - centerX);
      let angleDeg = (angleRad * 180) / Math.PI;
      
      // Offset by 90 degrees because 0 is right (3 o'clock) in math, but our handle is at top (12 o'clock)
      angleDeg += 90;

      onChange(element.id, {
        rotation: angleDeg
      });
    };

    const onUp = () => {
      setIsRotating(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      ref={elementRef}
      className={`absolute group select-none`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: isSelected ? 50 : 10,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onPointerDown={handleDragStart}
    >
      {/* Content Rendering */}
      <div 
        className={`w-full h-full overflow-hidden ${isSelected ? 'ring-2 ring-indigo-500' : 'hover:ring-1 hover:ring-indigo-300'}`}
        style={{
          ...element.style,
          // If image, use background image style, if text use simple text style
          backgroundImage: element.type === 'image' ? `url(${element.content})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {element.type === 'text' && (
           <div className="w-full h-full p-2 flex items-center justify-center text-center break-words pointer-events-none">
             {element.content}
           </div>
        )}
      </div>

      {/* Selection UI (Handles) */}
      {isSelected && (
        <>
          {/* Rotate Handle */}
          <div 
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-indigo-500 rounded-full flex items-center justify-center cursor-grab shadow-sm"
            onPointerDown={handleRotateStart}
          >
            <RefreshCw size={12} className="text-indigo-600" />
          </div>
          
          {/* Connector Line for Rotate */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-px bg-indigo-500" />

          {/* Resize Handle (Bottom Right only for MVP stability) */}
          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full cursor-nwse-resize z-50 shadow-sm"
            onPointerDown={handleResizeStart}
          />
          
          {/* Delete Button (Floating Action) */}
          <button
             onClick={(e) => { e.stopPropagation(); onRemove(element.id); }}
             className="absolute -top-3 -right-3 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-50"
             title="Remove Element"
          >
            <Trash2 size={12} />
          </button>
        </>
      )}
    </div>
  );
};
