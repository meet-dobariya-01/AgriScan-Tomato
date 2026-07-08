import { motion } from "framer-motion";
import { ShieldCheck, Clock, Zap, CheckCircle2 } from "lucide-react";

interface PredictionData {
  predicted_disease: string;
  confidence: number;
  confidence_percentage: number;
  inference_time: number;
}

const Ring: React.FC<{ value: number; color: string }> = ({ value, color }) => {
  const r = 32; const c = 2 * Math.PI * r; const offset = c - (value / 100) * c;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
      <svg className="-rotate-90 absolute inset-0" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#F3F4F6" strokeWidth="6" />
        <motion.circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} />
      </svg>
      <div className="text-center">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-lg font-black leading-none" style={{ color }}>
          {value.toFixed(0)}
        </motion.span>
        <span className="text-[9px] font-bold text-[#9CA3AF] block">%</span>
      </div>
    </div>
  );
};

export const PredictionCard: React.FC<{ prediction: PredictionData }> = ({ prediction }) => {
  const fmt = (n: string) => n.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const c = prediction.confidence_percentage;
  const isHealthy = prediction.predicted_disease.toLowerCase().includes("healthy");
  const color = isHealthy ? "#16A34A" : c >= 90 ? "#16A34A" : c >= 75 ? "#F59E0B" : "#EF4444";
  const badgeCls = isHealthy || c >= 90 ? "badge-green" : c >= 75 ? "badge-yellow" : "badge badge-red";
  const label = isHealthy ? "Healthy" : c >= 90 ? "High Confidence" : c >= 75 ? "Moderate" : "Low Confidence";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="space-y-3">

      {/* Main result */}
      <div className="card p-5 rounded-2xl">
        <div className="flex items-center gap-4">
          <Ring value={c} color={color} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <ShieldCheck size={13} className="text-[#16A34A]" strokeWidth={2.5} />
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">AI Diagnosis</span>
            </div>
            <h3 className="text-base font-bold text-[#111827] truncate mb-2">{fmt(prediction.predicted_disease)}</h3>
            <span className={`badge ${badgeCls}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />{label}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">Confidence</span>
            <span className="text-[10px] font-bold" style={{ color }}>{c.toFixed(2)}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
              initial={{ width: 0 }} animate={{ width: `${c}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
            <Clock size={16} className="text-[#0EA5E9]" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Inference</p>
            <p className="text-base font-bold text-[#111827]">{prediction.inference_time.toFixed(3)}<span className="text-xs font-normal text-[#6B7280] ml-0.5">s</span></p>
          </div>
        </div>
        <div className="card rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} className="text-[#16A34A]" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Status</p>
            <p className="text-sm font-bold text-[#16A34A]">Complete</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
