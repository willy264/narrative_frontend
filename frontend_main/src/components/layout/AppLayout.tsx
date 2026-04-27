import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
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
  ArrowRight,
  Menu,
} from "lucide-react";
import { getLenisInstance } from "../../utils/scroll";

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

/* All pages for mobile menu cards */
const ALL_NAV_ITEMS = [
  { to: "/", label: "Overview", num: "01" },
  { to: "/messages", label: "Messages", num: "02" },
  { to: "/portfolio", label: "Portfolio", num: "03" },
  { to: "/logs", label: "System Logs", num: "04" },
  { to: "/settings", label: "Settings", num: "05" },
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

/* ── Current page label resolver ── */
function useCurrentPageLabel() {
  const { pathname } = useLocation();
  const found = ALL_NAV_ITEMS.find(
    (item) => item.to === pathname || (item.to !== "/" && pathname.startsWith(item.to))
  );
  return found?.label || "Overview";
}

export default function AppLayout() {
  // Always true on initial load
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentPageLabel = useCurrentPageLabel();

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

  const handleNavigate = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

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

      {/* ════ BobbleMenu Mobile Navigation (lg:hidden) ════ */}
      <div className="lg:hidden fixed inset-x-0 top-4 z-[50] px-4 sm:px-6">
        <div className="mx-auto max-w-[800px]">
          <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07140f]/82 px-3 py-3 shadow-[0_18px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:px-4"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_28%,rgba(0,0,0,0.08))]" />
              <div className="absolute left-[14%] top-[-30%] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(30,215,96,0.14),transparent_72%)] blur-3xl" />
            </div>

            <div className="relative z-10 flex items-center justify-between gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handleNavigate("/")}
                className="flex min-w-0 items-center gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left transition duration-300 hover:border-white/16 hover:bg-white/[0.06] sm:px-4"
              >
                <img src="/logo-mark.svg" alt="Logo" className="h-9 w-9 shrink-0 sm:h-10 sm:w-10 object-contain" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold tracking-[0.04em] text-white">
                    Narrative
                  </span>
                  <span className="block truncate text-[0.62rem] uppercase tracking-[0.26em] text-white/38">
                    Workspace
                  </span>
                </span>
              </button>

              <div className="hidden min-w-[164px] flex-1 justify-center md:flex">
                <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-5 py-2.5 text-center backdrop-blur-xl">
                  <p className="text-[0.58rem] uppercase tracking-[0.26em] text-white/34">
                    Current page
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-white">
                    {currentPageLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open navigation"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition duration-300 hover:border-white/16 hover:bg-white/[0.08]"
                >
                  <Menu className="h-5 w-5" />
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
          {/* Top Navigation inside the card (Desktop only) */}
          <header className="hidden lg:flex justify-between items-center px-6 sm:px-10 py-5 border-b border-white/[0.04] bg-[#0a0a14]/40">
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

      {/* ════ BobbleMenu-style Mobile Menu Reveal ════ */}
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
              className="fixed inset-0 z-[59] overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#06140f]/96 lg:hidden"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)]" style={{ backgroundSize: '24px 24px' }} />
                <div className="absolute right-[-4rem] top-[-5rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(30,215,96,0.2),transparent_72%)] blur-3xl" />
                <div className="absolute bottom-[-6rem] left-[-4rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_72%)] blur-3xl" />
              </div>

              <div className="relative z-10 flex min-h-screen flex-col px-4 pb-8 pt-4 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => handleNavigate("/")}
                    className="flex min-w-0 items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.05] px-4 py-3 text-left shadow-[0_12px_35px_rgba(0,0,0,0.22)] backdrop-blur-xl"
                  >
                    <img src="/logo-mark.svg" alt="Logo" className="h-10 w-10 shrink-0 object-contain" />
                    <div className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">
                        Narrative
                      </span>
                      <span className="block truncate text-[0.62rem] uppercase tracking-[0.24em] text-white/40">
                        Workspace
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition duration-300 hover:bg-white/[0.08]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl md:hidden">
                  <p className="text-[0.58rem] uppercase tracking-[0.26em] text-white/34">
                    Current page
                  </p>
                  <p className="mt-1.5 text-base font-semibold text-white">
                    {currentPageLabel}
                  </p>
                </div>

                <div className="mt-8 flex flex-1 flex-col justify-start pb-6 md:justify-center">
                  <div className="mx-auto grid w-full max-w-[980px] grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                    {ALL_NAV_ITEMS.map((item, index) => (
                      <motion.button
                        key={`${item.label}-${item.to}`}
                        type="button"
                        onClick={() => handleNavigate(item.to)}
                        initial={{ opacity: 0, y: 34, rotateX: -20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, y: 24, rotateX: -18 }}
                        transition={{
                          delay: 0.12 + index * 0.07,
                          duration: 0.55,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="group relative block min-h-[10.5rem] w-full overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.045] px-4 py-4 text-left shadow-[0_14px_40px_rgba(0,0,0,0.26)] backdrop-blur-xl transition duration-300 hover:border-white/16 hover:bg-white/[0.07] sm:min-h-[11.25rem] sm:px-5 sm:py-5"
                      >
                        <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                          <div className="absolute inset-y-0 left-[-18%] w-[52%] bg-[linear-gradient(90deg,transparent,rgba(30,215,96,0.14),transparent)] blur-3xl" />
                        </div>
                        <div className="relative z-10 flex h-full items-center justify-between gap-4">
                          <div className="min-w-0">
                            <span className="block text-[0.62rem] uppercase tracking-[0.28em] text-white/38">
                              Page {item.num}
                            </span>
                            <span className="mt-2 block text-[1.55rem] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:mt-3 sm:text-[1.85rem] lg:text-[2.15rem]">
                              {item.label}
                            </span>
                          </div>
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/28 text-accent transition duration-300 group-hover:border-accent/26 group-hover:bg-accent/10">
                            <ArrowRight className="h-4.5 w-4.5" />
                          </span>
                        </div>
                      </motion.button>
                    ))}

                    <motion.button
                      type="button"
                      onClick={() => handleNavigate("/onboarding")}
                      initial={{ opacity: 0, y: 34, rotateX: -20 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, y: 24, rotateX: -18 }}
                      transition={{
                        delay: 0.12 + ALL_NAV_ITEMS.length * 0.07,
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group relative flex min-h-[10.5rem] w-full flex-col justify-between overflow-hidden rounded-[1.8rem] border border-accent/22 bg-accent px-4 py-4 text-left text-[#04120a] shadow-[0_18px_60px_rgba(30,215,96,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(30,215,96,0.24)] sm:min-h-[11.25rem] sm:px-5 sm:py-5"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.02))]" />
                      <div className="absolute inset-y-0 right-[-12%] w-[42%] bg-[radial-gradient(circle,rgba(255,255,255,0.26),transparent_72%)] blur-3xl" />
                      <div className="relative z-10 flex h-full items-center justify-between gap-4">
                        <div className="min-w-0">
                          <span className="block text-[0.62rem] uppercase tracking-[0.28em] text-[#04120a]/66">
                            Quick Setup
                          </span>
                          <span className="mt-2 block max-w-[12rem] text-[1.45rem] font-semibold leading-[1.08] tracking-[-0.05em] sm:mt-3 sm:text-[1.75rem] lg:text-[2rem]">
                            Connect Broker
                          </span>
                        </div>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[#04120a]/10 text-[#04120a] transition duration-300 group-hover:bg-[#04120a]/14">
                          <ArrowRight className="h-4.5 w-4.5" />
                        </span>
                      </div>
                    </motion.button>
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
