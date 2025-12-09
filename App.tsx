import React, { useState, useRef } from 'react';
import { CanvasElement, CanvasState } from './types';
import { Sidebar } from './components/Layout/Sidebar';
import { Toolbar } from './components/Layout/Toolbar';
import { PropertiesPanel } from './components/Layout/PropertiesPanel';
import { CanvasElementWrapper } from './components/Editor/CanvasElement';
import { DEFAULT_ELEMENT_SIZE, INITIAL_CANVAS_SIZE } from './constants';
import { exportAsImage, exportAsPDF } from './utils/exportUtils';
import { v4 as uuidv4 } from 'uuid'; // Usually requires library, using random string fallback here for zero-dep simplicity

// Simple ID generator if uuid not available
const generateId = () => Math.random().toString(36).substring(2, 9);

function App() {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    elements: [],
    selectedId: null,
    backgroundImage: null,
    backgroundColor: '#ffffff',
    width: INITIAL_CANVAS_SIZE.width,
    height: INITIAL_CANVAS_SIZE.height
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Actions
  const addElement = (type: 'text' | 'image', content: string = '') => {
    const id = generateId();
    const newElement: CanvasElement = {
      id,
      type,
      x: canvasState.width / 2 - (DEFAULT_ELEMENT_SIZE[type].width / 2),
      y: canvasState.height / 2 - (DEFAULT_ELEMENT_SIZE[type].height / 2),
      width: DEFAULT_ELEMENT_SIZE[type].width,
      height: DEFAULT_ELEMENT_SIZE[type].height,
      rotation: 0,
      content: type === 'text' ? 'Double click to edit' : content,
      style: type === 'text' ? {
        color: '#334155',
        fontSize: 24,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'normal',
      } : {
        borderRadius: 0
      }
    };

    setCanvasState(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
      selectedId: id
    }));
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.map(el => el.id === id ? { ...el, ...updates } : el)
    }));
  };

  const removeElement = (id: string) => {
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id),
      selectedId: prev.selectedId === id ? null : prev.selectedId
    }));
  };

  const setBackground = (url: string) => {
    setCanvasState(prev => ({ ...prev, backgroundImage: url }));
  };

  // Handlers for Toolbar
  const handleExportImage = () => {
    if (canvasState.selectedId) setCanvasState(s => ({...s, selectedId: null})); // Deselect for clean screenshot
    setTimeout(() => exportAsImage('canvas-area', 'png'), 100);
  };

  const handleExportPDF = () => {
    if (canvasState.selectedId) setCanvasState(s => ({...s, selectedId: null}));
    setTimeout(() => exportAsPDF('canvas-area'), 100);
  };

  const selectedElement = canvasState.elements.find(el => el.id === canvasState.selectedId);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      <Toolbar onExportImage={handleExportImage} onExportPDF={handleExportPDF} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          onAddText={() => addElement('text')} 
          onAddImage={(url) => addElement('image', url)}
          onSetBackground={setBackground}
        />
        
        {/* Main Workspace Area */}
        <div 
          className="flex-1 overflow-auto bg-slate-100 flex items-center justify-center p-12 relative cursor-default"
          onClick={() => setCanvasState(s => ({ ...s, selectedId: null }))}
        >
          {/* Canvas Board */}
          <div 
            id="canvas-area"
            ref={canvasRef}
            className="bg-white shadow-2xl relative transition-all"
            style={{
              width: canvasState.width,
              height: canvasState.height,
              backgroundImage: canvasState.backgroundImage ? `url(${canvasState.backgroundImage})` : 'none',
              backgroundColor: canvasState.backgroundColor,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent deselecting when clicking canvas background
          >
             {canvasState.elements.map(el => (
               <CanvasElementWrapper
                 key={el.id}
                 element={el}
                 isSelected={el.id === canvasState.selectedId}
                 onSelect={(id) => setCanvasState(s => ({ ...s, selectedId: id }))}
                 onChange={updateElement}
                 onRemove={removeElement}
               />
             ))}
          </div>
        </div>

        <PropertiesPanel 
          element={selectedElement} 
          onChange={updateElement} 
        />
      </div>
    </div>
  );
}

export default App;
