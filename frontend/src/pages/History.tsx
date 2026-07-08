import { motion, AnimatePresence } from "framer-motion";
import { History as HistoryIcon, Trash2, ImageIcon, Clock, ShieldCheck } from "lucide-react";
import { HistoryEntry } from "../hooks/useHistory";

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp  = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const fmt = (n: string) => n.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
const badgeCls = (c: number) => c >= 90 ? "badge-green" : c >= 75 ? "badge-yellow" : "badge badge-red";

const HistoryCard: React.FC<{ entry: HistoryEntry; onDelete: (id: string) => void }> = ({ entry, onDelete }) => (
  <motion.div variants={fadeUp} className="card card-lift rounded-2xl overflow-hidden flex flex-col sm:flex-row">
    <div className="w-full sm:w-36 h-36 sm:h-auto bg-[#F3F4F6] shrink-0">
      {entry.previewUrl
        ? <img src={entry.previewUrl} alt="leaf scan" className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={28} className="text-[#D1D5DB]" strokeWidth={1.5} />
          </div>
      }
    </div>
    <div className="flex-1 p-4 flex flex-col justify-between gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={13} className="text-[#16A34A]" strokeWidth={2.5} />
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Diagnosis</span>
          </div>
          <h3 className="text-sm font-bold text-[#111827]">{fmt(entry.predicted_disease)}</h3>
        </div>
        <button onClick={() => onDelete(entry.id)}
          className="p-1.5 rounded-lg hover:bg-[#FEF2F2] text-[#9CA3AF] hover:text-[#EF4444] transition-colors shrink-0"
          aria-label="Delete">
          <Trash2 size={14} strokeWidth={2} />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`badge ${badgeCls(entry.confidence_percentage)}`}>
          {entry.confidence_percentage.toFixed(1)}% confidence
        </span>
        <div className="flex items-center gap-1 text-[11px] text-[#9CA3AF]">
          <Clock size={11} strokeWidth={2} /><span>{entry.timestamp}</span>
        </div>
        <span className="text-[11px] text-[#9CA3AF]">{entry.inference_time.toFixed(3)}s inference</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E]"
          style={{ width: `${entry.confidence_percentage}%` }} />
      </div>
    </div>
  </motion.div>
);

interface HistoryPageProps {
  history: HistoryEntry[];
  deleteEntry: (id: string) => void;
  clearHistory: () => void;
}

const History: React.FC<HistoryPageProps> = ({ history, deleteEntry, clearHistory }) => (
  <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
    <motion.div variants={fadeUp} className="card rounded-2xl px-6 py-5 border-l-4 border-l-[#0EA5E9] flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HistoryIcon size={13} className="text-[#0EA5E9]" strokeWidth={2.5} />
          <span className="text-[10px] font-bold text-[#0EA5E9] uppercase tracking-widest">Scan History</span>
        </div>
        <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "Poppins, sans-serif" }}>
          Previous Diagnoses
        </h1>
        <p className="text-sm text-[#6B7280] mt-0.5">{history.length} scan{history.length !== 1 ? "s" : ""} stored locally</p>
      </div>
      {history.length > 0 && (
        <button onClick={clearHistory}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#FECACA] text-[#EF4444] text-xs font-semibold hover:bg-[#FEF2F2] transition-colors shrink-0">
          <Trash2 size={13} strokeWidth={2.5} /> Clear All
        </button>
      )}
    </motion.div>

    <AnimatePresence>
      {history.length === 0 ? (
        <motion.div variants={fadeUp} className="card rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center">
            <HistoryIcon size={28} className="text-[#D1D5DB]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#374151]">No history yet</p>
            <p className="text-xs text-[#9CA3AF] mt-1">Run a diagnosis on the Dashboard to see results here</p>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={stagger} className="space-y-3">
          {history.map(entry => (
            <HistoryCard key={entry.id} entry={entry} onDelete={deleteEntry} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default History;
