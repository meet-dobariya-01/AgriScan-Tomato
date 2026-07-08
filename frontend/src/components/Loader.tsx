import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

const STEPS = [
  "Preparing image...",
  "Running AI model...",
  "Analyzing disease pattern...",
  "Generating explainability...",
];

export const Loader: React.FC<{ message?: string }> = ({ message }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
      setProgress((p) => Math.min(p + 14, 92));
    }, 1100);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-14 gap-6">
      {/* Spinning ring */}
      <div className="relative w-20 h-20">
        <svg className="absolute inset-0 -rotate-90 w-full h-full" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#E5E7EB" strokeWidth="5" />
          <motion.circle cx="40" cy="40" r="34" fill="none"
            stroke="url(#loaderGrad)" strokeWidth="5" strokeLinecap="round"
            strokeDasharray="213"
            animate={{ strokeDashoffset: [213, 40, 213] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Leaf size={22} className="text-[#16A34A]" strokeWidth={2} />
          </motion.div>
        </div>
      </div>

      {/* Step text */}
      <div className="text-center space-y-1">
        <AnimatePresence mode="wait">
          <motion.p key={step}
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            className="text-sm font-semibold text-[#111827]">
            {message || STEPS[step]}
          </motion.p>
        </AnimatePresence>
        <p className="text-xs text-[#6B7280]">Deep learning inference in progress</p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-[#16A34A] to-[#0EA5E9]"
          animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} />
      </div>
    </div>
  );
};

export const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
    <div className="card p-10 max-w-xs w-full text-center">
      <Loader message={message} />
    </div>
  </motion.div>
);
