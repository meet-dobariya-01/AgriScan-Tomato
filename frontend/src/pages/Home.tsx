import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, BrainCircuit, ScanLine, Sparkles, Leaf } from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";
import { PredictionCard } from "../components/PredictionCard";
import { Top3Predictions } from "../components/Top3Predictions";
import { GradCAM } from "../components/GradCAM";
import { DiseaseInfo } from "../components/DiseaseInfo";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";

const API_BASE = ((import.meta as any).env?.VITE_API_BASE as string) || "https://tomato-disease-api.onrender.com/api/v1";

interface GradCAMResponse {
  predicted_disease: string; confidence: number; confidence_percentage: number;
  top_predictions: Array<{ disease: string; probability: number; percentage: number }>;
  inference_time: number; original_image: string; heatmap_image: string; overlay_image: string;
}

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22,1,0.36,1] } } };

interface HomeProps {
  addEntry: (result: { predicted_disease: string; confidence_percentage: number; inference_time: number }, previewUrl: string | null) => void;
}

const Home: React.FC<HomeProps> = ({ addEntry }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<GradCAMResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleImageSelect = (f: File) => { setFile(f); setResult(null); setError(null); };
  const handleClear = () => { setFile(null); setPreview(null); setResult(null); setError(null); };

  const handlePredict = async () => {
    if (!file) { setError("Please upload an image first"); return; }
    setLoading(true); setResult(null); setError(null);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await axios.post<GradCAMResponse>(`${API_BASE}/gradcam`, fd, {
        headers: { "Content-Type": "multipart/form-data" }, timeout: 300000,
      });
      setResult(res.data);
      addEntry(res.data, preview);
    } catch (err: any) {
      if (err.code === "ECONNABORTED") setError("Request timed out.");
      else if (err.response?.status === 400) setError(err.response.data.detail || "Invalid image");
      else if (err.response?.status === 500) setError("Server error. Please try again.");
      else if (!err.response) setError("Backend is temporarily unavailable. Please try again.");
      else setError(err?.response?.data?.detail ?? "Prediction failed.");
    } finally { setLoading(false); }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Page header */}
      <motion.div variants={fadeUp} className="card rounded-2xl px-6 py-5 border-l-4 border-l-[#16A34A] flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={13} className="text-[#16A34A]" />
            <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-widest">AtliQ Agriculture · EfficientNet-B0</span>
          </div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "Poppins, sans-serif" }}>
            Tomato Leaf Disease Diagnosis
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Upload a leaf image for instant classification with Grad-CAM explainability</p>
        </div>
        <div className="hidden sm:flex items-center gap-5 shrink-0">
          {[["11", "Diseases"], ["224×224", "Input"], ["Grad-CAM", "XAI"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-base font-bold text-[#111827]">{v}</p>
              <p className="text-[10px] text-[#6B7280] font-medium">{l}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main 2-col grid */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1.05fr]">

        {/* LEFT — Upload + Supported Diseases */}
        <motion.div variants={fadeUp} className="flex flex-col gap-5">
          {/* Upload card */}
          <div className="card rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
              <ScanLine size={14} className="text-[#6B7280]" strokeWidth={2} />
            </div>
            <p className="text-sm font-semibold text-[#111827]">Upload Image</p>
          </div>

          <ImageUpload onImageSelect={handleImageSelect} preview={preview} onClear={handleClear} disabled={loading} />

          <AnimatePresence>
            {error && <motion.div className="mt-3"><ErrorMessage message={error} onClose={() => setError(null)} /></motion.div>}
          </AnimatePresence>

          <motion.button onClick={handlePredict} disabled={loading || !file}
            whileHover={file && !loading ? { scale: 1.01 } : {}}
            whileTap={file && !loading ? { scale: 0.99 } : {}}
            className={`mt-4 w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold transition-all duration-200 ${
              file && !loading
                ? "bg-[#16A34A] text-white shadow-lg shadow-[#16A34A]/20 hover:bg-[#15803D]"
                : "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed border border-[#E5E7EB]"
            }`}>
            {loading ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
                <Scan size={16} strokeWidth={2.5} /></motion.div><span>Analyzing...</span></>
            ) : (
              <><BrainCircuit size={16} strokeWidth={2.5} /><span>Run Diagnosis</span></>
            )}
          </motion.button>
          </div>

          {/* Supported Diseases card */}
          <div className="card rounded-2xl p-5 bg-[#F0FDF4]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
                <Leaf size={14} className="text-[#16A34A]" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-semibold text-[#15803D]">Supported Diseases</p>
            </div>
            <ul className="space-y-2">
              {[
                "Bacterial Spot","Early Blight","Late Blight","Leaf Mold",
                "Powdery Mildew","Septoria Leaf Spot",
                "Spider Mites (Two-Spotted)","Target Spot",
                "Tomato Mosaic Virus","Tomato Yellow Leaf Curl Virus","Healthy"
              ].map((d) => (
                <li key={d} className="flex items-center gap-2.5 text-sm text-[#166534]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* RIGHT — Results */}
        <motion.div variants={fadeUp} className="card rounded-2xl p-5 min-h-[360px]">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
              <BrainCircuit size={14} className="text-[#6B7280]" strokeWidth={2} />
            </div>
            <p className="text-sm font-semibold text-[#111827]">Diagnosis Results</p>
            {result && (
              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="ml-auto badge badge-green">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />Complete
              </motion.span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Loader /></motion.div>
            ) : result ? (
              <motion.div key="res" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <PredictionCard prediction={result} />
                <Top3Predictions predictions={result.top_predictions} />
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-56 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#F0FDF4] flex items-center justify-center">
                  <Leaf size={28} className="text-[#86EFAC]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#374151]">No image uploaded yet</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">Upload a tomato leaf photo to begin</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Grad-CAM */}
      <AnimatePresence>
        {result && (
          <motion.div key="gc" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <GradCAM originalImage={result.original_image} heatmapImage={result.heatmap_image} overlayImage={result.overlay_image} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disease Info */}
      <AnimatePresence>
        {result && (
          <motion.div key="di" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-[#E5E7EB]" />
              <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest px-2">Disease Intelligence</span>
              <div className="h-px flex-1 bg-[#E5E7EB]" />
            </div>
            {/* Normalize predicted disease (spaces/hyphens -> underscores) before passing */}
            <DiseaseInfo diseaseName={result.predicted_disease.replace(/\s+/g, "_").replace(/-+/g, "_")} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
