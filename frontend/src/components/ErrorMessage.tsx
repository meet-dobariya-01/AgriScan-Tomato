import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ErrorMessageProps { message: string; onClose?: () => void; }

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => (
  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
    className="flex items-start gap-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] px-4 py-3"
    role="alert"
  >
    <div className="w-6 h-6 rounded-lg bg-[#FEE2E2] flex items-center justify-center shrink-0">
      <AlertTriangle size={13} className="text-[#EF4444]" strokeWidth={2.5} />
    </div>
    <p className="flex-1 text-sm text-[#B91C1C]">{message}</p>
    {onClose && (
      <button onClick={onClose} className="text-[#EF4444] hover:text-[#B91C1C] transition-colors" aria-label="Dismiss">
        <X size={14} strokeWidth={2.5} />
      </button>
    )}
  </motion.div>
);
