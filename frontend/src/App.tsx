import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { useHistory } from "./hooks/useHistory";
import Home from "./pages/Home";
import ModelInfo from "./pages/ModelInfo";
import History from "./pages/History";
import About from "./pages/About";
import Diseases from "./pages/Diseases";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { history, addEntry, deleteEntry, clearHistory } = useHistory();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
      <div className="flex pt-[60px]">
        <Sidebar open={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-56" : "lg:ml-16"} min-h-[calc(100vh-60px)]`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <Routes>
              <Route path="/"         element={<Home addEntry={addEntry} />} />
              <Route path="/model"    element={<ModelInfo />} />
              <Route path="/history"  element={<History history={history} deleteEntry={deleteEntry} clearHistory={clearHistory} />} />
              <Route path="/diseases" element={<Diseases />} />
              <Route path="/about"    element={<About />} />
              <Route path="*"         element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
