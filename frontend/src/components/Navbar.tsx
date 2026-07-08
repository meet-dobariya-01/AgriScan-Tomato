import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

interface NavbarProps { onMenuClick: () => void; }

const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,10 15,85 38,85 60,35" fill="#71B950" />
    <polygon points="50,10 60,35 85,85 62,85" fill="#2E6931" />
    <path d="M 42 78 C 35 50, 75 45, 75 45 C 75 45, 65 75, 42 78 Z" fill="#428637" stroke="white" strokeWidth="3" strokeLinejoin="round" />
    <path d="M 42 78 L 38 86" stroke="#428637" strokeWidth="3" strokeLinecap="round" />
    <path d="M 42 78 Q 55 65 70 55" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/model", label: "Model Info" },
  ];

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-white border-b border-[#E5E7EB]"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center h-full px-4 gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#6B7280] transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        <Link to="/" className="flex items-center gap-2.5">
          <Logo />
          <div className="hidden sm:block leading-tight">
            <span className="font-bold text-[15px] text-[#111827] tracking-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              AtliQ
            </span>
            <span className="font-bold text-[15px] text-[#15803D] tracking-tight ml-1"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              Agriculture
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.to
                  ? "bg-[#DCFCE7] text-[#15803D]"
                  : "text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#111827]"
                }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </motion.header>
  );
};
