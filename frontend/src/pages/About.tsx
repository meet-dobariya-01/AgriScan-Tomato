import { motion } from "framer-motion";

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const About = () => (
  <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

    {/* Header */}
    <motion.div variants={fadeUp} className="card rounded-2xl px-6 py-5 border-l-4 border-l-[#0EA5E9]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold text-[#0EA5E9] uppercase tracking-widest">About</span>
      </div>
      <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "Poppins, sans-serif" }}>
        About This Application
      </h1>
      <p className="text-sm text-[#374151] mt-2 leading-relaxed max-w-2xl">
        A <span className="font-semibold text-[#15803D]">production-ready application</span> built by{" "}
        <span className="font-semibold">AtliQ Agriculture</span> for detecting tomato leaf diseases using deep learning.
        Upload a tomato leaf image and get instant diagnosis.
      </p>
    </motion.div>

    <div className="grid gap-5 lg:grid-cols-2">

      {/* Key Features */}
      <motion.div variants={fadeUp} className="card rounded-2xl p-5">
        <p className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
          Key Features
        </p>
        <div className="space-y-3">
          {[
            { text: "Accurate disease classification using EfficientNet-B0", sub: "Transfer learning on 25,000+ images" },
            // { text: "Grad-CAM visualization for model interpretability", sub: "Visual heatmaps showing decision regions" },
            { text: "Detailed disease information & treatment", sub: "Symptoms, causes, prevention guides" },
          ].map(({ text, sub }) => (
            <div key={text} className="flex items-start gap-3 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <div>
                <p className="text-xs font-semibold text-[#111827]">{text}</p>
                <p className="text-[10px] text-[#6B7280] mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div variants={fadeUp} className="card rounded-2xl p-5">
        <p className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
          Technology Stack
        </p>
        <div className="space-y-2.5">
          {[
            { label: "Deep Learning",    value: "TensorFlow / Keras" },
            { label: "Architecture",     value: "EfficientNet-B0 (Transfer Learning)" },
            // { label: "Visualization",    value: "Grad-CAM, OpenCV" },
            { label: "Backend",          value: "FastAPI + Uvicorn" },
            { label: "Image Processing", value: "PIL, NumPy" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#6B7280] font-medium">{label}</p>
                <p className="text-xs font-semibold text-[#111827]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Model Performance */}
      <motion.div variants={fadeUp} className="card rounded-2xl p-5">
        <p className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
          Model Performance
        </p>
        <div className="space-y-3">
          {[
            { label: "Training Dataset",  value: "25,000+ images" },
            { label: "Disease Classes",   value: "11 classes" },
            { label: "Base Model",        value: "EfficientNet-B0 (ImageNet)" },
            { label: "Input Resolution",  value: "224 × 224 px" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-[#6B7280]">{label}</span>
              </div>
              <span className="text-xs font-bold text-[#111827]">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Use Cases */}
      <motion.div variants={fadeUp} className="card rounded-2xl p-5">
        <p className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
          Use Cases
        </p>
        <div className="space-y-3">
          {[
            { title: "Early Disease Detection",      desc: "Identify diseases before they spread across crops" },
          ].map(({ title, desc }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <div>
                <p className="text-xs font-semibold text-[#111827]">{title}</p>
                <p className="text-[10px] text-[#6B7280] mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export default About;
