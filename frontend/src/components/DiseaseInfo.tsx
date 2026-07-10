import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Bug, ShieldCheck, Stethoscope } from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://atliq-agriculture.onrender.com/api/v1";

interface DiseaseData {
  name: string; scientific_name: string; description: string;
  symptoms: string[]; causes: string[]; treatment: string[];
  prevention: string[]; severity: string;
}

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; items: string[]; accent: string; iconBg: string; delay?: number }> =
  ({ icon, title, items, accent, iconBg, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="card card-lift rounded-2xl p-5">
    <div className="flex items-center gap-2.5 mb-4">
      <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center`}>{icon}</div>
      <p className="text-sm font-semibold text-[#111827]">{title}</p>
    </div>
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${accent}`} />
          <span className="text-sm text-[#374151] leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

export const DiseaseInfo: React.FC<{ diseaseName: string }> = ({ diseaseName }) => {
  const [data, setData] = useState<DiseaseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!diseaseName) return;
    setLoading(true); setError(null);
    const nameForApi = encodeURIComponent(diseaseName.replace(/\s+/g, "_"));
    axios.get(`${API_BASE}/disease/${nameForApi}`)
      .then(r => setData(r.data))
      .catch(e => {
        const detail = e?.response?.data?.detail || e?.message || "Disease info unavailable";
        setError(detail);
      })
      .finally(() => setLoading(false));
  }, [diseaseName]);

  if (loading) return (
    <div className="card rounded-2xl p-6 space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="skeleton h-4 w-1/4" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-5/6" />
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="card rounded-2xl p-5 flex items-center gap-3 border-[#FEF9C3] bg-[#FEFCE8]">
      <AlertCircle size={16} className="text-[#CA8A04] shrink-0" />
      <p className="text-sm text-[#92400E]">{error}</p>
    </div>
  );

  if (!data) return null;

  const fmt = (n: string) => n.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const sev = data.severity.toLowerCase();
  const sevBadge = sev.includes("high") || sev.includes("severe") ? "badge-red"
    : sev.includes("med") || sev.includes("mod") ? "badge-yellow" : "badge-green";

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Header card */}
      <div className="card rounded-2xl p-6 border-l-4 border-l-[#16A34A]">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-[#111827]">{fmt(data.name)}</h3>
          {data.scientific_name && data.scientific_name !== "N/A" && (
            <p className="text-xs italic text-[#6B7280]">{data.scientific_name}</p>
          )}
        </div>
        <p className="text-sm text-[#374151] leading-relaxed">{data.description}</p>
      </div>

      {/* Info grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard icon={<AlertCircle size={15} className="text-[#EF4444]" strokeWidth={2.5} />}
          title="Symptoms" items={data.symptoms} accent="bg-[#EF4444]" iconBg="bg-[#FEF2F2]" delay={0.05} />
        <InfoCard icon={<Bug size={15} className="text-[#F97316]" strokeWidth={2.5} />}
          title="Causes" items={data.causes} accent="bg-[#F97316]" iconBg="bg-[#FFF7ED]" delay={0.1} />
        <InfoCard icon={<Stethoscope size={15} className="text-[#16A34A]" strokeWidth={2.5} />}
          title="Treatment" items={data.treatment} accent="bg-[#16A34A]" iconBg="bg-[#F0FDF4]" delay={0.15} />
        <InfoCard icon={<ShieldCheck size={15} className="text-[#0EA5E9]" strokeWidth={2.5} />}
          title="Prevention" items={data.prevention} accent="bg-[#0EA5E9]" iconBg="bg-[#EFF6FF]" delay={0.2} />
      </div>
    </motion.div>
  );
};
