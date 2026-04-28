import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  Settings as SettingsIcon,
  // Bell,
  GripHorizontal,
  Search,
  LogOut,
  ExternalLink,
  ArrowRight,
  PieChart,
  MessageSquare,
  Wallet,
  Terminal,
  Dot,
} from "lucide-react";
import { getLenisInstance } from "../../utils/scroll";
import { useAuth } from '../auth/AuthProvider';
import { useNarratives, type NarrativeRecord } from '../../hooks/useWorkspace';

/* ── Navigation items ── */
const topNavItems = [
  { to: "/", label: "Overview", icon: PieChart },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/portfolio", label: "Portfolio", icon: Wallet },
];

const sidebarItems = [
  { to: "/logs", label: "System Logs", icon: Terminal },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
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
  const { user } = useAuth();
  // Always true on initial load
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: narratives } = useNarratives();
  
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';

  const filteredNarratives = searchQuery.trim() === "" 
    ? [] 
    : (narratives ?? []).filter((n: NarrativeRecord) => 
        n.narrative_id.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  // Shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Use Lenis instance and body overflow for mobile menu just like BobbleMenu
  useEffect(() => {
    const lenis = getLenisInstance ? getLenisInstance() : null;
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    if (mobileMenuOpen) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      lenis?.start();
    }

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      lenis?.start();
    };
  }, [mobileMenuOpen]);



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
              <span className="w-11 h-11 shrink-0 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md text-white border border-white/10 transition-colors">
                <Dot size={18} />
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ════ Floating Mobile Top Bar (BobbleMenu Style) ════ */}
      <div className="lg:hidden fixed inset-x-0 top-4 z-[50] px-4 sm:px-6">
        <div className="mx-auto max-w-[800px]">
          <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img src="/logo-mark.svg" alt="Logo" className="h-12 w-12 shrink-0 object-contain" />
                <span className="min-w-0">
                  <span className="block truncate text-xl font-semibold tracking-[0.04em] text-white">
                    Narrative
                  </span>
                  <span className="block truncate text-[0.62rem] uppercase tracking-[0.26em] text-white/38">
                    Workspace
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open navigation"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition duration-300 hover:border-white/16 hover:bg-accent/[0.2]"
                >
                  <GripHorizontal size={18} />
                </button>
              </div>
            </div>
          </motion.nav>
        </div>
      </div>

      {/* ════ Main Content Area (Rounded floating card) ════ */}
      <main className="flex-1 h-full flex flex-col relative z-20 min-w-0 pt-24 lg:pt-0">
        {/* The rounded floating panel */}
        <div className="w-full h-full bg-[#0a0a14]/60 backdrop-blur-[30px] lg:rounded-l-[40px] rounded-t-[32px] lg:rounded-tr-none shadow-2xl shadow-black/50 border border-white/[0.08] flex flex-col overflow-hidden relative z-10">
          <div 
            className="absolute inset-0 opacity-[0.01]" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
            }} 
          />
          {/* Top Navigation inside the card (Desktop only) */}
          <header className="hidden lg:flex justify-between items-center px-6 sm:px-10 py-5 border-b border-white/[0.04] bg-[#0a0a14]/40">
            <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
              <div className="relative group hidden sm:block">
                <Search
                  size={16}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                    isSearchFocused ? "text-accent" : "text-text-muted"
                  }`}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search workspace..."
                  className="bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] focus:bg-white/[0.05] focus:border-accent/50 text-[13px] text-white rounded-full pl-9 pr-12 py-2 w-[200px] focus:w-[280px] transition-all duration-300 outline-none placeholder:text-text-muted"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
                  <span className="text-[10px] font-data text-text-muted bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/10">⌘K</span>
                </div>

                <AnimatePresence>
                  {isSearchFocused && filteredNarratives.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-[320px] bg-[#0a0a14] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl z-50"
                    >
                      <div className="p-2">
                        <p className="text-[10px] font-bold text-text-muted px-3 py-2 uppercase tracking-widest">Narratives</p>
                        {filteredNarratives.map((n: NarrativeRecord) => (
                          <button
                            key={n.narrative_id}
                            onClick={() => {
                              navigate(`/messages?thread=${n.compiler_thread_id}`);
                              setSearchQuery("");
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-sub hover:text-white hover:bg-white/5 transition-all group text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                              <MessageSquare size={14} className="text-accent" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">Narrative {n.narrative_id.slice(-6)}</p>
                              <p className="text-[10px] text-text-muted">Thread: {n.compiler_thread_id?.slice(-8)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="sm:hidden">
                <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/5 text-text-sub hover:text-white transition-colors">
                  <Search size={16} />
                </button>
              </div>

              <nav className="flex gap-6 sm:gap-8 items-center whitespace-nowrap">
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
              
              {/* <button className="w-9 h-9 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.05] text-text-sub hover:text-white hover:bg-white/[0.08] transition-all relative group">
                <Bell size={15} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-warn ring-2 ring-[#0a0a14]" />
              </button> */}
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center shadow-lg shadow-accent/20 cursor-pointer ml-1 ring-2 ring-white/10 hover:ring-white/20 transition-all focus:outline-none"
                >
                  <span className="text-[11px] font-bold text-[#0a0a14] tracking-wider">{initials}</span>
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a14] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl z-50"
                    >
                      <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                        <p className="text-xs text-text-muted mb-0.5">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{user?.email ?? 'narrative_user@market.io'}</p>
                      </div>
                      <div className="p-1.5">
                        {/* <NavLink 
                          to="/settings" 
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-sub hover:text-white hover:bg-white/5 transition-all group"
                        >
                          <User size={15} className="text-text-muted group-hover:text-accent" />
                          <span>View Profile</span>
                        </NavLink> */}
                        <NavLink 
                          to="/settings" 
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-sub hover:text-white hover:bg-accent/5 transition-all group"
                        >
                          <SettingsIcon size={15} className="text-text-muted group-hover:text-accent" />
                          <span>Settings</span>
                        </NavLink>
                        <a 
                          href="https://marketnarrativelive.vercel.app" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-sub hover:text-white hover:bg-accent/5 transition-all group"
                        >
                          <ExternalLink size={15} className="text-text-muted group-hover:text-accent" />
                          <span>Landing Page</span>
                        </a>
                      </div>
                      
                       {/* Handle logout */}
                      {/* <div className="p-1.5 border-t border-white/5">
                        <button 
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-danger hover:bg-danger/10 transition-all group"
                          onClick={() => {
                            setProfileMenuOpen(false);
                          }}
                        >
                          <LogOut size={15} className="group-hover:scale-110 transition-transform" />
                          <span className="font-semibold">Logout</span>
                        </button>
                      </div> */}
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

      {/* ════ Mobile Menu (Full Screen ClipPath Reveal) ════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[58] bg-black/45 backdrop-blur-md lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{
                opacity: 0,
                clipPath: "circle(0% at calc(100% - 2rem) 2rem)",
              }}
              animate={{
                opacity: 1,
                clipPath: "circle(160% at calc(100% - 2rem) 2rem)",
              }}
              exit={{
                opacity: 0,
                clipPath: "circle(0% at calc(100% - 2rem) 2rem)",
              }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[59] overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#0a0a14]/68 backdrop-blur-2xl lg:hidden flex flex-col"
            >
              <div 
                className="absolute inset-0 opacity-[0.01]" 
                style={{ 
                  backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                  transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                }} 
              />
              <div className="relative z-10 flex min-h-screen flex-col px-4 pb-8 pt-4 sm:px-6">
                <div className="flex items-center justify-between gap-4">

                  {/* Logo */}
                  <div className="flex min-w-0 items-center gap-3">
                    <img src="/logo-mark.svg" alt="Logo" className="h-12 w-12 shrink-0 object-contain" />
                    <span className="min-w-0">
                      <span className="block truncate text-xl font-semibold tracking-[0.04em] text-white">
                        Narrative
                      </span>
                      <span className="block truncate text-[0.62rem] uppercase tracking-[0.26em] text-white/38">
                        Workspace
                      </span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition duration-300 hover:bg-accent/[0.08]"
                  >
                    <div className="relative h-4 w-4">
                      <span className="absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
                      <span className="absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current transition-transform duration-300 group-hover:-rotate-90 group-hover:scale-110" />
                    </div>
                  </button>
                </div>

                <div className="mt-12 flex-1 overflow-y-auto space-y-8 px-2">
                  <div>
                    <p className="text-xs font-data text-text-muted mb-4 tracking-wider uppercase">Menu</p>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {topNavItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `group relative flex flex-col justify-between rounded-[1.5rem] border p-4 sm:p-5 text-left transition duration-300 min-h-[120px] ${
                              isActive
                                ? "border-accent/20 bg-accent/10 text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                                : "border-white/10 bg-white/[0.04] text-text-sub hover:border-white/20 hover:bg-white/[0.08] hover:text-accent"
                            }`
                          }
                        >
                          <div className="flex w-full items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 text-white/70 group-hover:text-white transition-colors">
                              <item.icon size={20} />
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] transition-colors group-hover:bg-white/[0.08]">
                              <ArrowRight size={14} className="opacity-50 transition-transform group-hover:-rotate-45 group-hover:opacity-100" />
                            </div>
                          </div>
                          <span className="text-lg sm:text-xl font-bold tracking-wide mt-6">{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-data text-text-muted mb-4 tracking-wider uppercase">System</p>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {sidebarItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `group relative flex flex-col justify-between rounded-[1.5rem] border p-4 sm:p-5 text-left transition duration-300 min-h-[120px] ${
                              isActive
                                ? "border-accent/20 bg-accent/10 text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                                : "border-white/10 bg-white/[0.04] text-text-sub hover:border-white/20 hover:bg-white/[0.08] hover:text-accent"
                            }`
                          }
                        >
                          <div className="flex w-full items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 text-white/70 group-hover:text-white transition-colors">
                              <item.icon size={20} />
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] transition-colors group-hover:bg-white/[0.08]">
                              <ArrowRight size={14} className="opacity-50 transition-transform group-hover:-rotate-45 group-hover:opacity-100" />
                            </div>
                          </div>
                          <span className="text-lg sm:text-xl font-bold tracking-wide mt-6">{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
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
