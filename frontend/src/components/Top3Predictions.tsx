import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

interface Prediction { disease: string; probability: number; percentage: number; }

const fmt = (n: string) => n.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

const BARS = [
  { gradient: "from-[#16A34A] to-[#22C55E]", bg: "bg-[#F0FDF4]", text: "text-[#16A34A]" },
  { gradient: "from-[#0EA5E9] to-[#38BDF8]", bg: "bg-[#EFF6FF]", text: "text-[#0EA5E9]" },
  { gradient: "from-[#8B5CF6] to-[#A78BFA]", bg: "bg-[#F5F3FF]", text: "text-[#8B5CF6]" },
];

export const Top3Predictions: React.FC<{ predictions: Prediction[] }> = ({ predictions }) => {
  const max = Math.max(...predictions.map(p => p.percentage), 1);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="card rounded-2xl p-5">

      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
          <BarChart3 size={14} className="text-[#6B7280]" strokeWidth={2} />
        </div>
        <p className="text-sm font-semibold text-[#111827]">Top Predictions</p>
      </div>

      <div className="space-y-4">
        {predictions.map((pred, i) => {
          const bar = BARS[i] || BARS[2];
          return (
            <motion.div key={pred.disease}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.07 }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-md ${bar.bg} flex items-center justify-center text-[10px] font-black ${bar.text}`}>
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-[#374151] truncate max-w-[160px]">{fmt(pred.disease)}</span>
                </div>
                <span className={`text-sm font-bold ${bar.text}`}>{pred.percentage.toFixed(2)}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
                <motion.div className={`h-full rounded-full bg-gradient-to-r ${bar.gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(pred.percentage / max) * 100}%` }}
                  transition={{ duration: 0.9, delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
