import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import Lenis from 'lenis'
import { Toaster, ToastBar, toast, useToasterStore } from 'react-hot-toast'
import { X } from 'lucide-react'
import { setLenisInstance } from './utils/scroll'

// Layouts
import AppLayout from './components/layout/AppLayout'

// Pages
import Dashboard from './pages/Dashboard'
import Messages from './pages/Messages'
import Portfolio from './pages/Portfolio'
import Logs from './pages/Logs'
import Settings from './pages/Settings'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'

// Auth Context
import { AuthProvider } from './components/auth/AuthProvider'

gsap.registerPlugin(ScrollTrigger)

const App = () => {
  const { toasts } = useToasterStore();

  // Limit visible toasts to 2
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= 2)
      .forEach((t) => toast.remove(t.id));
  }, [toasts]);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.1,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.05,
    })

    setLenisInstance(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
      setLenisInstance(null)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right" 
          toastOptions={{ 
            duration: 8000,
            style: { 
              background: 'rgba(12, 12, 26, 0.85)', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              fontSize: '14px',
              padding: '4px',
              maxWidth: '400px',
            } 
          }} 
        >
          {(t) => (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <div className="flex items-center w-full gap-3 px-2 py-1">
                  <div className="shrink-0">{icon}</div>
                  <div className="flex-1 text-[13px] font-medium leading-relaxed">{message}</div>
                  {t.type !== 'loading' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.dismiss(t.id);
                      }}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}
            </ToastBar>
          )}
        </Toaster>
        <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Routes inside AppLayout */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="messages" element={<Messages />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="logs" element={<Logs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="onboarding" element={<Onboarding />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
