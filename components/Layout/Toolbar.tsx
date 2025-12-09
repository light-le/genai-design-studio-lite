import React, { useState } from 'react';
import { Download, Share2, Undo, Redo, FileImage, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { exportAsImage, exportAsPDF } from '../../utils/exportUtils';

interface Props {
  onExportImage: () => void;
  onExportPDF: () => void;
}

export const Toolbar: React.FC<Props> = ({ onExportImage, onExportPDF }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-30">
      <div className="flex items-center gap-4">
        {/* Placeholder for Undo/Redo - Logic not implemented in MVP but UI is here */}
        <div className="flex items-center gap-1 border-r border-slate-200 pr-4">
           <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100" disabled>
             <Undo size={18} />
           </button>
           <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100" disabled>
             <Redo size={18} />
           </button>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Untitled Design - <span className="text-slate-400">Autosaved</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="primary" className="flex items-center gap-2">
            <Download size={18} />
            Export
          </Button>
          
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 animate-in fade-in slide-in-from-top-2">
              <button 
                onClick={() => { onExportImage(); setIsMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <FileImage size={14} className="text-indigo-600"/>
                Download PNG
              </button>
              <button 
                 onClick={() => { onExportPDF(); setIsMenuOpen(false); }}
                 className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <FileText size={14} className="text-red-600"/>
                Download PDF
              </button>
            </div>
          )}
        </div>
        
        <Button variant="secondary" size="icon">
           <Share2 size={18} />
        </Button>
      </div>
    </div>
  );
};
