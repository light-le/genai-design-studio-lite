import React, { useState } from 'react';
import { CanvasElement } from '../../types';
import { FONTS, COLORS } from '../../constants';
import { proofreadText } from '../../services/geminiService';
import { Wand2, Loader2, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  element: CanvasElement | undefined;
  onChange: (id: string, updates: Partial<CanvasElement>) => void;
}

export const PropertiesPanel: React.FC<Props> = ({ element, onChange }) => {
  const [isProofreading, setIsProofreading] = useState(false);

  if (!element) {
    return (
      <div className="w-72 bg-white border-l border-slate-200 p-6 flex flex-col items-center justify-center text-center text-slate-400">
        <p>Select an element to edit its properties.</p>
      </div>
    );
  }

  const handleProofread = async () => {
    if (element.type !== 'text') return;
    setIsProofreading(true);
    const improved = await proofreadText(element.content);
    onChange(element.id, { content: improved });
    setIsProofreading(false);
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg z-20 overflow-y-auto">
      <div className="p-5 border-b border-slate-100 bg-slate-50">
        <h2 className="font-bold text-slate-800">{element.type === 'text' ? 'Text Properties' : 'Image Properties'}</h2>
        <p className="text-xs text-slate-500 mt-1">ID: {element.id.slice(0, 8)}...</p>
      </div>

      <div className="p-5 space-y-6">
        {/* Text Content Editor */}
        {element.type === 'text' && (
          <div className="space-y-3">
             <label className="text-xs font-semibold text-slate-500 uppercase">Content</label>
             <textarea
               className="w-full p-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
               rows={4}
               value={element.content}
               onChange={(e) => onChange(element.id, { content: e.target.value })}
             />
             <Button 
                variant="secondary" 
                size="sm" 
                className="w-full flex items-center justify-center gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                onClick={handleProofread}
                disabled={isProofreading}
             >
               {isProofreading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
               {isProofreading ? 'Improving...' : 'AI Proofread'}
             </Button>
          </div>
        )}

        {/* Style Controls */}
        <div className="space-y-4">
           {element.type === 'text' && (
             <>
               <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Typography</label>
                  <select
                    className="w-full p-2 border border-slate-200 rounded-md text-sm mb-2"
                    value={element.style.fontFamily || 'Inter, sans-serif'}
                    onChange={(e) => onChange(element.id, { style: { ...element.style, fontFamily: e.target.value } })}
                  >
                    {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                  </select>
                  
                  <div className="flex items-center gap-2">
                     <input 
                       type="number" 
                       className="w-20 p-2 border border-slate-200 rounded-md text-sm" 
                       value={element.style.fontSize || 16}
                       onChange={(e) => onChange(element.id, { style: { ...element.style, fontSize: Number(e.target.value) } })}
                     />
                     <div className="flex bg-slate-100 rounded-md p-1">
                        <button className="p-1.5 hover:bg-white rounded shadow-sm" onClick={() => onChange(element.id, { style: {...element.style, fontWeight: element.style.fontWeight === 'bold' ? 'normal' : 'bold'}})}>
                           <Bold size={14} className={element.style.fontWeight === 'bold' ? 'text-indigo-600' : 'text-slate-500'} />
                        </button>
                        <button className="p-1.5 hover:bg-white rounded shadow-sm" onClick={() => { /* Toggle Italic logic could go here */ }}>
                           <Italic size={14} className="text-slate-500" />
                        </button>
                     </div>
                  </div>
               </div>

               <div>
                 <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Color</label>
                 <div className="grid grid-cols-7 gap-2">
                    {COLORS.map(c => (
                      <button
                        key={c}
                        className={`w-6 h-6 rounded-full border border-slate-200 shadow-sm ${element.style.color === c ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                        style={{ backgroundColor: c }}
                        onClick={() => onChange(element.id, { style: { ...element.style, color: c } })}
                      />
                    ))}
                 </div>
               </div>
             </>
           )}

           <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Opacity</label>
              <input 
                 type="range" 
                 min="0" 
                 max="1" 
                 step="0.1"
                 className="w-full accent-indigo-600"
                 value={element.style.opacity ?? 1}
                 onChange={(e) => onChange(element.id, { style: { ...element.style, opacity: Number(e.target.value) } })}
              />
           </div>

           {element.type === 'image' && (
             <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Border Radius</label>
                <input 
                   type="range" 
                   min="0" 
                   max="100" 
                   className="w-full accent-indigo-600"
                   value={element.style.borderRadius ?? 0}
                   onChange={(e) => onChange(element.id, { style: { ...element.style, borderRadius: Number(e.target.value) } })}
                />
             </div>
           )}
        </div>
        
        {/* Layer / Position Info */}
        <div className="pt-4 border-t border-slate-100">
           <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
              <div>X: {Math.round(element.x)}</div>
              <div>Y: {Math.round(element.y)}</div>
              <div>W: {Math.round(element.width)}</div>
              <div>H: {Math.round(element.height)}</div>
              <div>Rot: {Math.round(element.rotation)}°</div>
           </div>
        </div>
      </div>
    </div>
  );
};
