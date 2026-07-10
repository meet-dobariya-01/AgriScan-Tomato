import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Brain, Layers, LayoutGrid, HardDrive, GitBranch, Zap, Server, FlaskConical, Cpu } from "lucide-react";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";

const API_BASE = ((import.meta as any).env?.VITE_API_BASE as string) || "https://tomato-disease-api.onrender.com/api/v1";
interface ModelData { model_name: string; input_shape: number[]; num_classes: number; model_size_mb: number; total_params: number | null; }

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22,1,0.36,1] } } };

const ModelInfo = () => {
  const [data, setData] = useState<ModelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<ModelData>(`${API_BASE}/model`)
      .then(r => setData(r.data))
      .catch(e => setError(e?.response?.data?.detail || "Failed to load model info"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card rounded-2xl p-8"><Loader message="Fetching model metadata..." /></div>;
  if (error) return <div className="card rounded-2xl p-6"><ErrorMessage message={error} /></div>;
  if (!data) return null;

  const stats = [
    { icon: Brain,       label: "Architecture",    value: data.model_name,                       bg: "bg-[#F5F3FF]", iconColor: "text-[#8B5CF6]" },
    { icon: Layers,      label: "Input Shape",     value: data.input_shape.join(" × "),           bg: "bg-[#EFF6FF]", iconColor: "text-[#0EA5E9]" },
    { icon: LayoutGrid,  label: "Disease Classes", value: String(data.num_classes),               bg: "bg-[#F0FDF4]", iconColor: "text-[#16A34A]" },
    { icon: HardDrive,   label: "Model Size",      value: `${data.model_size_mb.toFixed(1)} MB`,  bg: "bg-[#FFF7ED]", iconColor: "text-[#F97316]" },
  ];

  const endpoints = [
    { method: "POST", path: "/api/v1/predict",       desc: "Disease prediction",         mc: "badge-green" },
    { method: "POST", path: "/api/v1/gradcam",        desc: "Grad-CAM visualization",    mc: "badge-green" },
    { method: "GET",  path: "/api/v1/disease/{name}", desc: "Disease info",              mc: "badge-blue" },
    { method: "GET",  path: "/api/v1/model",          desc: "Model metadata",            mc: "badge-blue" },
    { method: "GET",  path: "/api/v1/health",         desc: "Health check",              mc: "badge-blue" },
  ];

  const stack = [
    { icon: Server,      label: "Backend",     value: "FastAPI + Uvicorn",   sub: "Port 8000",           color: "text-[#8B5CF6]", bg: "bg-[#F5F3FF]" },
    { icon: FlaskConical,label: "Frontend",    value: "React + Vite + TS",   sub: "Port 5173",           color: "text-[#0EA5E9]", bg: "bg-[#EFF6FF]" },
    { icon: Brain,       label: "Model",       value: "TensorFlow 2.x",      sub: "EfficientNet-B0",     color: "text-[#F97316]", bg: "bg-[#FFF7ED]" },
    { icon: Zap,         label: "XAI",         value: "Grad-CAM",            sub: "Visual explainability", color: "text-[#16A34A]", bg: "bg-[#F0FDF4]" },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Header */}
      <motion.div variants={fadeUp} className="card rounded-2xl px-6 py-5 border-l-4 border-l-[#8B5CF6]">
        <h2 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: "Poppins, sans-serif" }}>Model Intelligence</h2>
        <p className="text-sm text-[#6B7280] leading-relaxed mt-1">
          EfficientNet-B0 transfer learning on 11 tomato disease classes with frozen ImageNet backbone and Grad-CAM explainability.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, bg, iconColor }) => (
          <div key={label} className="card card-lift rounded-2xl p-5 flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon size={17} className={iconColor} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">{label}</p>
              <p className="text-xl font-bold text-[#111827]">{value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Architecture */}
      <motion.div variants={fadeUp} className="card rounded-2xl p-5">
        <p className="text-sm font-semibold text-[#111827] mb-4">Architecture Pipeline</p>
        <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
          {["Input 224×224×3","→","Augmentation","→","EfficientNet-B0 (frozen)","→","GlobalAvgPool","→","Dense(256, ReLU)","→","Dropout(0.3)","→","Dense(11, Softmax)"].map((s, i) => (
            s === "→"
              ? <span key={i} className="text-[#9CA3AF] font-bold">{s}</span>
              : <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] font-medium">{s}</span>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] p-4">
            <p className="text-xs font-semibold text-[#374151] mb-2">Training Config</p>
            {[["Optimizer","Adam"],["Loss","Sparse Cat. CE"],["Image Size","224 × 224"],["Augmentation","Enabled"]].map(([k,v]) => (
              <div key={k} className="flex justify-between py-1 border-b border-[#F3F4F6] last:border-0">
                <span className="text-xs text-[#9CA3AF]">{k}</span>
                <span className="text-xs font-semibold text-[#374151]">{v}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] p-4">
            <p className="text-xs font-semibold text-[#374151] mb-2">Disease Classes ({data.num_classes})</p>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Bacterial spot · Early blight · Late blight · Leaf mold · Septoria · Spider mites · Target spot · Yellow leaf curl virus · Mosaic virus · Healthy · Powdery mildew
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModelInfo;
