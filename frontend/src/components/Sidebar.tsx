import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Cpu, History, Leaf, Info } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/model", icon: Cpu, label: "Model Info" },
  { to: "/history", icon: History, label: "History" },
  { to: "/diseases", icon: Leaf, label: "Diseases" },
  { to: "/about", icon: Info, label: "About" },
];

const BrandLogo = () => (
  <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,10 15,85 38,85 60,35" fill="#71B950" />
    <polygon points="50,10 60,35 85,85 62,85" fill="#2E6931" />
    <path d="M 42 78 C 35 50, 75 45, 75 45 C 75 45, 65 75, 42 78 Z" fill="#428637" stroke="white" strokeWidth="3" strokeLinejoin="round" />
    <path d="M 42 78 L 38 86" stroke="#428637" strokeWidth="3" strokeLinecap="round" />
    <path d="M 42 78 Q 55 65 70 55" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

interface SidebarProps { open: boolean; }

export const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: open ? 224 : 60 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-[60px] bottom-0 z-40 hidden lg:flex flex-col bg-white border-r border-[#E5E7EB] overflow-hidden"
      style={{ boxShadow: "1px 0 8px rgba(0,0,0,0.04)" }}
    >
      {/* Nav links */}
      <div className="flex-1 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3.5 py-2.5 mx-2 rounded-xl transition-all duration-150
                ${active
                  ? "bg-[#DCFCE7] text-[#15803D]"
                  : "text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#111827]"
                }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }} transition={{ duration: 0.15 }}
                    className="text-sm font-medium whitespace-nowrap flex-1"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {active && open && (
                <motion.div layoutId="sidebarActive"
                  className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom brand badge */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="px-3 pb-4 shrink-0">
            <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-3">
              <div className="flex items-center gap-2 mb-1">
                <BrandLogo />
                <span className="text-xs font-semibold text-[#15803D]">AtliQ Agriculture</span>
              </div>
              <p className="text-[10px] text-[#6B7280]">EfficientNet-B0 · 11 disease classes</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <div className="pb-4 flex justify-center shrink-0">
          <BrandLogo />
        </div>
      )}
    </motion.aside>
  );
};
