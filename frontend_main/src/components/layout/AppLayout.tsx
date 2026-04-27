import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  Settings as SettingsIcon,
  Bell,
  GripHorizontal,
  Search,
  X,
  Plus,
  LogOut,
  ExternalLink,
  User,
} from "lucide-react";

/* ── Navigation items ── */
const topNavItems = [
  { to: "/", label: "Overview" },
  { to: "/messages", label: "Messages" },
  { to: "/portfolio", label: "Portfolio" },
];

const sidebarItems = [
  { to: "/logs", label: "System Logs" },
  { to: "/settings", label: "Settings" },
];

/* ── Top navigation link with pill hover/active state ── */
function TopNavLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `relative px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-colors duration-200 group ${
          isActive ? "text-[#0a0a14]" : "text-text-muted hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="relative z-10">{label}</span>
          {isActive ? (
            <motion.div
              layoutId="nav-pill"
              className="absolute inset-0 bg-white rounded-full z-0"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          ) : (
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-full z-0 transition-colors duration-200" />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString("en-US", { month: "long" })} ${currentDate.getDate()} • ${currentDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  return (
    <div className="flex h-screen bg-bg-root font-body overflow-hidden relative">
      {/* Global Background Video */}
      <img
        src="/dark_green_bg.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-40"
      />
      <div className="absolute inset-0 bg-bg-root/50 z-0 pointer-events-none" />

      {/* ════ Desktop Sidebar ════ */}
      <aside
        className={`hidden lg:flex shrink-0 relative flex-col p-8 z-10 transition-all duration-500 ease-in-out ${sidebarOpen ? "w-[380px]" : "w-[100px] items-center"}`}
      >
        {/* Sidebar Content */}
        <div className="relative z-10 flex flex-col h-full w-full">
          {/* Top Brand & Menu Icon */}
          <div
            className={`flex items-center ${sidebarOpen ? "justify-between" : "justify-center flex-col gap-6"}`}
          >
            <h1 className="font-display font-bold text-3xl tracking-tight text-white flex items-center gap-2">
              <img
                src="/logo-mark.svg"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
              {sidebarOpen && <span>narrative</span>}
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 shrink-0 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md text-white border border-white/10 hover:bg-white/10 transition-colors"
            >
              <GripHorizontal size={18} />
            </button>
          </div>

          {/* Center Titles */}
          {sidebarOpen && (
            <div className="mt-32">
              <h2 className="text-[56px] font-display font-light text-white mb-2 leading-none tracking-tight">
                Workspace
              </h2>
              <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                <Folder size={16} /> My Trading Desk
              </div>
            </div>
          )}

          {/* Bottom Nav Pills */}
          <div className="mt-auto">
            <div
              className={`flex ${sidebarOpen ? "flex-wrap items-center gap-3" : "flex-col items-center gap-4"}`}
            >
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full font-semibold transition-all duration-300 flex items-center justify-center ${
                      sidebarOpen ? "px-6 py-3 text-[13px]" : "w-11 h-11"
                    } ${
                      isActive
                        ? "bg-white text-black shadow-lg shadow-white/10"
                        : "bg-white/5 text-white backdrop-blur-md border border-white/10 hover:bg-white/10"
                    }`
                  }
                >
                  {sidebarOpen ? item.label : item.label[0]}
                </NavLink>
              ))}
              <button className="w-11 h-11 shrink-0 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md text-white border border-white/10 hover:bg-white/10 transition-colors">
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ════ Main Content Area (Rounded floating card) ════ */}
      <main className="flex-1 h-full  flex flex-col relative z-20 min-w-0">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden flex items-center justify-between mb-4 px-2 relative z-10">
          <h1 className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-2">
            <img
              src="/logo-mark.svg"
              alt="Logo"
              className="w-5 h-5 object-contain"
            />
            narrative
          </h1>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-white/70 hover:text-white"
          >
            <GripHorizontal size={24} />
          </button>
        </div>

        {/* The rounded floating panel */}
        <div className="w-full h-full bg-[#0a0a14]/60 backdrop-blur-[30px] rounded-l-[32px] sm:rounded-l-[40px] shadow-2xl shadow-black/50 border border-white/[0.08] flex flex-col overflow-hidden relative z-10">
          {/* Top Navigation inside the card */}
          <header className="flex justify-between items-center px-6 sm:px-10 py-5 border-b border-white/[0.04] bg-[#0a0a14]/40">
            <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
              <div className="relative group hidden sm:block">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors"
                />
                <input
                  type="text"
                  placeholder="Search workspace..."
                  className="bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] focus:bg-white/[0.05] focus:border-accent/50 text-[13px] text-white rounded-full pl-9 pr-12 py-2 w-[200px] focus:w-[280px] transition-all duration-300 outline-none placeholder:text-text-muted"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
                  <span className="text-[10px] font-data text-text-muted bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/10">⌘K</span>
                </div>
              </div>
              <div className="sm:hidden">
                <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/5 text-text-sub hover:text-white transition-colors">
                  <Search size={16} />
                </button>
              </div>

              <nav className="flex gap-6 sm:gap-8 items-center whitespace-nowrap">
                {/* On mobile, show the primary links here too */}
                <div className="flex lg:hidden gap-6 sm:gap-8">
                  {sidebarItems.map((item) => (
                    <TopNavLink key={item.to} to={item.to} label={item.label} />
                  ))}
                </div>
                {/* Secondary links (Logs, Settings) -> Now Main links */}
                {topNavItems.map((item) => (
                  <TopNavLink key={item.to} to={item.to} label={item.label} />
                ))}
              </nav>
            </div>

            <div className="hidden sm:flex items-center gap-3 shrink-0 pl-6">
              <div className="flex items-center gap-2 mr-4 text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[11px] font-data uppercase tracking-widest hidden xl:block pt-0.5">
                  {formattedDate}
                </span>
              </div>
              
              <button className="w-9 h-9 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.05] text-text-sub hover:text-white hover:bg-white/[0.08] transition-all relative group">
                <Bell size={15} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-warn ring-2 ring-[#0a0a14]" />
              </button>
              
              <button className="w-9 h-9 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.05] text-text-sub hover:text-white hover:bg-white/[0.08] transition-all">
                <SettingsIcon size={15} />
              </button>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-blue flex items-center justify-center shadow-lg shadow-accent/20 cursor-pointer ml-1 ring-2 ring-white/10 hover:ring-white/20 transition-all focus:outline-none"
                >
                  <span className="text-[11px] font-bold text-[#0a0a14] tracking-wider">NL</span>
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a14] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl z-50"
                    >
                      <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                        <p className="text-xs text-text-muted mb-0.5">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">narrative_user@market.io</p>
                      </div>
                      <div className="p-1.5">
                        <NavLink 
                          to="/settings" 
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-sub hover:text-white hover:bg-white/5 transition-all group"
                        >
                          <User size={15} className="text-text-muted group-hover:text-accent" />
                          <span>View Profile</span>
                        </NavLink>
                        <NavLink 
                          to="/settings" 
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-sub hover:text-white hover:bg-white/5 transition-all group"
                        >
                          <SettingsIcon size={15} className="text-text-muted group-hover:text-accent" />
                          <span>Settings</span>
                        </NavLink>
                        <a 
                          href="https://marketnarrativelive.vercel.app" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-sub hover:text-white hover:bg-white/5 transition-all group"
                        >
                          <ExternalLink size={15} className="text-text-muted group-hover:text-accent" />
                          <span>Landing Page</span>
                        </a>
                      </div>
                      <div className="p-1.5 border-t border-white/5">
                        <button 
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-danger hover:bg-danger/10 transition-all group"
                          onClick={() => {
                            // Handle logout
                            setProfileMenuOpen(false);
                          }}
                        >
                          <LogOut size={15} className="group-hover:scale-110 transition-transform" />
                          <span className="font-semibold">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div 
            className={`flex-1 overflow-y-auto relative ${location.pathname.startsWith('/messages') ? '' : 'px-6 sm:px-10 py-8'}`}
            data-lenis-prevent
          >
            <Outlet />
          </div>
        </div>
      </main>

      {/* ════ Mobile slide-out menu ════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[300px] bg-bg-root border-r border-border z-50 flex flex-col p-6 lg:hidden"
            >
              <div className="flex justify-between items-center mb-12 relative z-10">
                <h1 className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-2">
                  <img
                    src="/logo-mark.svg"
                    alt="Logo"
                    className="w-5 h-5 object-contain"
                  />
                  narrative
                </h1>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/50 hover:text-white p-2"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-xs font-data text-text-muted mb-4 tracking-wider">
                    WORKSPACE
                  </p>
                  <div className="flex flex-col gap-2">
                    {sidebarItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-white/10 text-white"
                              : "text-text-sub hover:text-white hover:bg-white/5"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-data text-text-muted mb-4 tracking-wider">
                    SYSTEM
                  </p>
                  <div className="flex flex-col gap-2">
                    {topNavItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-white/10 text-white"
                              : "text-text-sub hover:text-white hover:bg-white/5"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
