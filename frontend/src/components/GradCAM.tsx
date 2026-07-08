import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Flame, Layers, ZoomIn, X, Download } from "lucide-react";

interface GradCAMProps { originalImage: string; heatmapImage: string; overlayImage: string; }
type View = "original" | "heatmap" | "overlay";

export const GradCAM: React.FC<GradCAMProps> = ({ originalImage, heatmapImage, overlayImage }) => {
  const [view, setView] = useState<View>("overlay");
  const [zoom, setZoom] = useState<string | null>(null);

  const modes = [
    { key: "original" as View, label: "Original", icon: <ImageIcon size={13} />, img: originalImage },
    { key: "heatmap"  as View, label: "Heatmap",  icon: <Flame size={13} />,     img: heatmapImage },
    { key: "overlay"  as View, label: "Overlay",  icon: <Layers size={13} />,    img: overlayImage },
  ];

  const download = (src: string, name: string) => {
    const a = document.createElement("a"); a.href = src; a.download = name; a.click();
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] flex items-center justify-center">
              <Flame size={15} className="text-[#F97316]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827]">Grad-CAM Explainability</p>
              <p className="text-[11px] text-[#6B7280]">Gradient-weighted Class Activation Map</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-[#F3F4F6] rounded-xl">
            {modes.map(m => (
              <button key={m.key} onClick={() => setView(m.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  view === m.key ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"
                }`}>
                {m.icon}{m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3 thumbnails */}
        <div className="grid grid-cols-3 gap-3 p-4">
          {modes.map(m => (
            <div key={m.key}
              onClick={() => setView(m.key)}
              className={`relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-200
                ${view === m.key ? "ring-2 ring-[#16A34A] ring-offset-2" : "opacity-70 hover:opacity-100"}`}>
              <div className="aspect-square bg-[#F3F4F6]">
                <img src={m.img} alt={m.key} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={e => { e.stopPropagation(); setZoom(m.img); }}
                  className="w-6 h-6 rounded-lg bg-white/90 flex items-center justify-center shadow-sm hover:bg-white"
                  aria-label={`Zoom ${m.label}`}>
                  <ZoomIn size={11} className="text-[#111827]" />
                </button>
                <button onClick={e => { e.stopPropagation(); download(m.img, `gradcam-${m.key}.png`); }}
                  className="w-6 h-6 rounded-lg bg-white/90 flex items-center justify-center shadow-sm hover:bg-white"
                  aria-label={`Download ${m.label}`}>
                  <Download size={11} className="text-[#111827]" />
                </button>
              </div>
              <p className="absolute bottom-2 left-2.5 text-[10px] font-bold text-white">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="px-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-28 rounded-full" style={{ background: "linear-gradient(90deg,#3B82F6,#22D3EE,#84CC16,#FACC15,#EF4444)" }} />
            <div className="flex justify-between w-20 text-[9px] text-[#9CA3AF] font-medium">
              <span>Low</span><span>High</span>
            </div>
          </div>
          <p className="text-[10px] text-[#9CA3AF]">Activation intensity</p>
        </div>
      </motion.div>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoom && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setZoom(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
              <img src={zoom} alt="Zoomed" className="w-full rounded-2xl shadow-2xl" />
              <button onClick={() => setZoom(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md hover:bg-[#F3F4F6]"
                aria-label="Close zoom">
                <X size={16} strokeWidth={2.5} className="text-[#111827]" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
