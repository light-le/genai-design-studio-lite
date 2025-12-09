export type ElementType = 'text' | 'image';

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string; // Text content or Image URL
  style: {
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    opacity?: number;
    borderRadius?: number;
  };
}

export interface CanvasState {
  elements: CanvasElement[];
  selectedId: string | null;
  backgroundImage: string | null;
  backgroundColor: string;
  width: number;
  height: number;
}

export type DragHandleType = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 'e' | 's' | 'w' | 'rotate';
