import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const DISEASES = [
  {
    name: "Bacterial Spot",
    type: "Bacterial",
    severity: "High",
    description: "Caused by Xanthomonas bacteria. Appears as small, water-soaked spots on leaves that turn dark brown with yellow halos.",
    symptoms: ["Small dark water-soaked spots", "Yellow halos around spots", "Leaf yellowing and drop", "Spots may coalesce"],
    color: "border-l-[#EF4444]",
    badge: "badge-red",
  },
  {
    name: "Early Blight",
    type: "Fungal",
    severity: "Medium",
    description: "Caused by Alternaria solani. Produces dark concentric ring lesions on older leaves first.",
    symptoms: ["Dark brown concentric rings", "Yellow halo around lesion", "Lower leaves affected first", "Fruit lesions possible"],
    color: "border-l-[#F59E0B]",
    badge: "badge-yellow",
  },
  {
    name: "Late Blight",
    type: "Oomycete",
    severity: "High",
    description: "Caused by Phytophthora infestans. Rapid spread in cool, wet conditions. Can destroy entire crop.",
    symptoms: ["Large water-soaked lesions", "White mold on leaf underside", "Brown-black lesions", "Fast spreading"],
    color: "border-l-[#EF4444]",
    badge: "badge-red",
  },
  {
    name: "Leaf Mold",
    type: "Fungal",
    severity: "Medium",
    description: "Caused by Passalora fulva. Common in high-humidity greenhouse environments.",
    symptoms: ["Pale yellow spots on upper surface", "Olive-green mold below", "Leaves curl and dry", "Affects upper canopy"],
    color: "border-l-[#F59E0B]",
    badge: "badge-yellow",
  },
  {
    name: "Powdery Mildew",
    type: "Fungal",
    severity: "Low",
    description: "Caused by Oidium neolycopersici. White powdery coating on leaf surfaces.",
    symptoms: ["White powdery patches", "Yellowing of affected areas", "Distorted new growth", "Leaves may drop"],
    color: "border-l-[#10B981]",
    badge: "badge-green",
  },
  {
    name: "Septoria Leaf Spot",
    type: "Fungal",
    severity: "Medium",
    description: "Caused by Septoria lycopersici. Small circular spots with dark borders and gray centers.",
    symptoms: ["Small circular spots", "Dark border with gray center", "Tiny black dots in center", "Starts on lower leaves"],
    color: "border-l-[#F59E0B]",
    badge: "badge-yellow",
  },
  {
    name: "Spider Mites",
    type: "Pest",
    severity: "Medium",
    description: "Two-spotted spider mite infestation. Thrives in hot, dry conditions causing stippling and bronzing.",
    symptoms: ["Yellow stippling on leaves", "Fine webbing visible", "Bronzing of leaf surface", "Leaf drop in severe cases"],
    color: "border-l-[#F59E0B]",
    badge: "badge-yellow",
  },
  {
    name: "Target Spot",
    type: "Fungal",
    severity: "Medium",
    description: "Caused by Corynespora cassiicola. Produces target-like concentric ring patterns on leaves.",
    symptoms: ["Circular target-like rings", "Brown lesions with rings", "Leaf yellowing around spots", "Affects all growth stages"],
    color: "border-l-[#F59E0B]",
    badge: "badge-yellow",
  },
  {
    name: "Tomato Mosaic Virus",
    type: "Viral",
    severity: "High",
    description: "ToMV causes mottled green-yellow mosaic patterns. Spread through contact and infected seed.",
    symptoms: ["Mosaic yellowing pattern", "Leaf distortion", "Stunted growth", "Reduced fruit quality"],
    color: "border-l-[#EF4444]",
    badge: "badge-red",
  },
  {
    name: "Yellow Leaf Curl Virus",
    type: "Viral",
    severity: "High",
    description: "TYLCV transmitted by whiteflies. Causes severe stunting and yield loss.",
    symptoms: ["Leaf curling upward", "Yellow leaf margins", "Stunted plant growth", "Low fruit set"],
    color: "border-l-[#EF4444]",
    badge: "badge-red",
  },
  {
    name: "Healthy",
    type: "Normal",
    severity: "None",
    description: "No disease detected. The tomato leaf shows normal healthy growth patterns.",
    symptoms: ["Deep green uniform color", "No spots or lesions", "Normal leaf structure", "Vigorous growth"],
    color: "border-l-[#16A34A]",
    badge: "badge-green",
  },
];

const Diseases = () => (
  <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

    {/* Header */}
    <motion.div variants={fadeUp} className="card rounded-2xl px-6 py-5 border-l-4 border-l-[#16A34A] flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Leaf size={13} className="text-[#16A34A]" strokeWidth={2.5} />
          <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-widest">Disease Library</span>
        </div>
        <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "Poppins, sans-serif" }}>
          Supported Diseases
        </h1>
        <p className="text-sm text-[#6B7280] mt-0.5">11 tomato disease classes the model can detect and classify</p>
      </div>

    </motion.div>

    {/* Disease cards */}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {DISEASES.map((d) => (
        <motion.div key={d.name} variants={fadeUp}
          className={`card card-lift rounded-2xl p-5 border-l-4 ${d.color}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">{d.name}</h3>
              <p className="text-[10px] text-[#6B7280]">{d.type}</p>
            </div>
          </div>

          <p className="text-xs text-[#374151] leading-relaxed mb-3">{d.description}</p>

          <div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Symptoms</p>
            <ul className="space-y-1">
              {d.symptoms.map(s => (
                <li key={s} className="flex items-start gap-2 text-[11px] text-[#374151]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-1 shrink-0" />{s}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default Diseases;
