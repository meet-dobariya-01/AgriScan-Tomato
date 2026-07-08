import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, ImageIcon, CheckCircle2 } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  preview: string | null;
  onClear: () => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, preview, onClear, disabled = false }) => {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ name: string; size: string } | null>(null);

  const validate = (file: File): boolean => {
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("Please upload JPG, JPEG, or PNG"); return false;
    }
    if (file.size > 10 * 1024 * 1024) { setError("File must be under 10 MB"); return false; }
    setError(null);
    setMeta({ name: file.name, size: `${(file.size / 1024).toFixed(0)} KB` });
    return true;
  };

  const onDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!disabled) setDrag(e.type === "dragenter" || e.type === "dragover");
  }, [disabled]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDrag(false);
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f && validate(f)) onImageSelect(f);
  }, [disabled, onImageSelect]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const f = e.target.files?.[0];
    if (f && validate(f)) onImageSelect(f);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div key="drop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
              ${drag ? "border-[#16A34A] bg-[#F0FDF4]" : "border-[#D1D5DB] hover:border-[#16A34A] hover:bg-[#F0FDF4]/50"}
              ${disabled ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            <label className="flex flex-col items-center justify-center py-10 px-6 text-center cursor-pointer">
              <motion.div animate={drag ? { scale: 1.1, rotate: -5 } : { scale: 1, rotate: 0 }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                  ${drag ? "bg-[#DCFCE7]" : "bg-[#F3F4F6]"}`}>
                <UploadCloud size={26} className={drag ? "text-[#16A34A]" : "text-[#9CA3AF]"} strokeWidth={1.5} />
              </motion.div>
              <p className="text-sm font-semibold text-[#111827] mb-1">
                {drag ? "Drop it here" : "Upload leaf image"}
              </p>
              <p className="text-xs text-[#6B7280] mb-4">
                Drag & drop or <span className="text-[#16A34A] font-medium">browse files</span>
              </p>
              <div className="flex gap-2">
                {["JPG", "PNG", "JPEG"].map(f => (
                  <span key={f} className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[10px] font-semibold text-[#6B7280] border border-[#E5E7EB]">{f}</span>
                ))}
                <span className="text-[10px] text-[#D1D5DB]">· max 10 MB</span>
              </div>
              <input type="file" accept="image/*" className="sr-only" onChange={onChange} disabled={disabled} aria-label="Upload image" />
            </label>
          </motion.div>
        ) : (
          <motion.div key="preview"
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm group"
          >
            <img src={preview} alt="Uploaded leaf" className="w-full h-[240px] object-cover group-hover:scale-[1.01] transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <button onClick={onClear} disabled={disabled}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
              aria-label="Remove image">
              <X size={15} strokeWidth={2.5} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ImageIcon size={12} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white truncate max-w-[150px]">{meta?.name}</p>
                  <p className="text-[10px] text-white/70">{meta?.size}</p>
                </div>
              </div>
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#16A34A] text-white text-[10px] font-bold">
                <CheckCircle2 size={10} /> Ready
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-xs text-[#EF4444] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3 py-2 flex items-center gap-2">
            <X size={12} className="shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
