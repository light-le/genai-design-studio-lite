import React from 'react';
import { Type, Image as ImageIcon, Box } from 'lucide-react';

interface SidebarProps {
  onAddText: () => void;
  onAddImage: (url: string) => void;
  onSetBackground: (url: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddText, onAddImage, onSetBackground }) => {
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isBg: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (isBg) {
            onSetBackground(event.target.result as string);
          } else {
            onAddImage(event.target.result as string);
          }
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset value to allow re-uploading same file
    e.target.value = '';
  };

  const sampleImages = [
    'https://picsum.photos/300/300?random=1',
    'https://picsum.photos/300/300?random=2',
    'https://picsum.photos/300/300?random=3',
    'https://picsum.photos/300/300?random=4',
  ];

  return (
    <div className="w-72 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shadow-xl z-20 overflow-y-auto no-scrollbar">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">DS</div>
          DesignLite
        </h1>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Text Tool */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Insert</h3>
          <button 
            onClick={onAddText}
            className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all group"
          >
            <div className="p-2 bg-slate-700 group-hover:bg-slate-600 rounded-md">
              <Type size={20} className="text-indigo-400" />
            </div>
            <span className="font-medium text-slate-200">Add Text Box</span>
          </button>
        </div>

        {/* Image Tool */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Images</h3>
          <label className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all cursor-pointer group mb-4">
             <div className="p-2 bg-slate-700 group-hover:bg-slate-600 rounded-md">
                <ImageIcon size={20} className="text-emerald-400" />
             </div>
             <span className="font-medium text-slate-200">Upload Image</span>
             <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e)} />
          </label>

          <div className="grid grid-cols-2 gap-2">
             {sampleImages.map((src, idx) => (
               <button 
                 key={idx} 
                 onClick={() => onAddImage(src)}
                 className="relative aspect-square rounded-md overflow-hidden hover:opacity-80 transition-opacity border border-slate-700"
               >
                 <img src={src} alt="Sample" className="w-full h-full object-cover" crossOrigin="anonymous" />
               </button>
             ))}
          </div>
        </div>

        {/* Background Tool */}
        <div>
           <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Background</h3>
           <label className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all cursor-pointer group">
             <div className="p-2 bg-slate-700 group-hover:bg-slate-600 rounded-md">
                <Box size={20} className="text-rose-400" />
             </div>
             <span className="font-medium text-slate-200">Set Background</span>
             <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, true)} />
          </label>
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t border-slate-800 text-xs text-slate-600 text-center">
        Powered by Gemini & React
      </div>
    </div>
  );
};
