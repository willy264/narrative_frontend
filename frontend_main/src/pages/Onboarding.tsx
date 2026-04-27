import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useConnectBayse, useBayseAccount } from '../hooks/useBayse';
import { toast } from 'react-hot-toast';
import {
  Shield, Lock, ArrowRight, Activity, 
  Terminal, BarChart3, ChevronRight, CheckCircle2, Globe
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Onboarding() {
  const navigate = useNavigate();
  const { data: account, isLoading: accountLoading } = useBayseAccount();
  const connectBayse = useConnectBayse();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.bg-elements', { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' })
      .fromTo('.onboarding-card', { y: 50, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'expo.out' }, '-=1.5')
      .fromTo('.badge', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.5');
  }, { scope: containerRef });

  useEffect(() => {
    if (!accountLoading && account) {
      navigate('/');
    }
  }, [accountLoading, account, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields', { id: 'onboarding-fields-error' });
    }

    connectBayse.mutate({ email, password }, {
      onSuccess: () => {
        toast.success('Successfully connected to Bayse!');
        navigate('/');
      },
      onError: (error: any) => {
        const retryAfter = error.response?.headers?.['retry-after'];
        if (retryAfter) {
          toast.error(`Rate limited. Please try again in ${retryAfter} seconds.`, { id: 'rate-limit' });
          return;
        }
        const errorMsg = error.response?.data?.error?.message || 'Failed to connect. Please check your credentials.';
        toast.error(errorMsg, { id: 'auth-error' });
      }
    });
  };

  if (accountLoading) return null;

  return (
    <div ref={containerRef} className="relative flex min-h-screen w-full items-center justify-center bg-[#050B08] overflow-hidden selection:bg-accent/30 font-body">
      {/* Immersive Animated Background */}
      <div className="bg-elements absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/dark_green_bg.png')] bg-cover bg-center opacity-30 mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(30,215,96,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(5,11,8,1)_90%)]" />
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-accent/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-blue/10 rounded-full blur-[100px] mix-blend-screen" />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          }} 
        />
      </div>

      <div className="relative z-10 w-full max-w-[1000px] px-6 py-12 flex flex-col items-center">
        {/* Top Badges */}
        <div className="flex gap-4 mb-10">
          <div className="badge flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-md">
            <Activity size={14} className="text-accent" />
            <span className="text-xs font-bold text-accent tracking-widest uppercase">Network Optimal</span>
          </div>
          <div className="badge hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <Shield size={14} className="text-white/70" />
            <span className="text-xs font-bold text-white/70 tracking-widest uppercase">Enterprise Grade</span>
          </div>
        </div>

        {/* Central Floating Card */}
        <div className="onboarding-card w-full rounded-[2.5rem] sm:rounded-[3rem] bg-white/[0.02] border border-white/10 p-1 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
          
          <div className="relative w-full bg-[#08120D]/90 rounded-[2.3rem] sm:rounded-[2.8rem] overflow-hidden flex flex-col md:flex-row">
            {/* Left Content / Value Prop */}
            <div className="w-full md:w-5/12 p-8 sm:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(30,215,96,0.1),transparent_70%)] pointer-events-none" />
              
              <div className="mb-12">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-6 shadow-inner">
                  <img src="/logo-mark.svg" alt="Narrative" className="w-8 h-8 object-contain" />
                </div>
                <h1 className="text-4xl font-display font-bold text-white leading-tight tracking-tight mb-4">
                  Welcome to <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Narrative</span>
                </h1>
                <p className="text-sm text-text-sub leading-relaxed">
                  The quantitative orchestrator for institutional strategy. Connect your broker to unleash high-throughput execution.
                </p>
              </div>

              <div className="mt-auto space-y-6">
                {[
                  { icon: Terminal, title: "Latency Optimization", desc: "Sub-45ms routing" },
                  { icon: BarChart3, title: "Data Density", desc: "Institutional analytics" },
                  { icon: Lock, title: "Secure Handshake", desc: "Hardware-level protection" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center shrink-0 border border-white/5">
                      <feature.icon size={16} className="text-text-muted" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{feature.title}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content / Form */}
            <div className="w-full md:w-7/12 p-8 sm:p-12 flex flex-col justify-center relative bg-gradient-to-b from-transparent to-black/20">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-sm mx-auto"
                  >
                    <div className="mb-8">
                      <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 block">Step 01</span>
                      <h2 className="text-2xl font-bold text-white">Initialize Workspace</h2>
                      <p className="text-sm text-text-sub mt-2">To get started, we need to bridge your identity with the Bayse execution layer.</p>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="group w-full h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between px-6 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Globe size={18} className="text-text-muted group-hover:text-white transition-colors" />
                        <span className="text-sm font-semibold text-white">Connect Broker Account</span>
                      </div>
                      <ChevronRight size={18} className="text-text-muted group-hover:translate-x-1 transition-all" />
                    </button>
                    <div className="mt-6 flex items-center gap-3 text-xs text-text-muted">
                      <CheckCircle2 size={14} className="text-accent/50" />
                      <span>End-to-end encrypted connection</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-sm mx-auto"
                  >
                    <div className="mb-8">
                      <button onClick={() => setStep(1)} className="text-[10px] font-bold text-text-muted hover:text-white uppercase tracking-widest mb-4 flex items-center gap-1 transition-colors">
                        <ChevronRight size={12} className="rotate-180" /> Back
                      </button>
                      <h2 className="text-2xl font-bold text-white">Authorize Access</h2>
                      <p className="text-sm text-text-sub mt-2">Enter your Bayse credentials to secure the handshake.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Broker Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-5 text-white placeholder:text-text-muted/50 focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all"
                          placeholder="trader@institution.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between px-1">
                          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Access Token</label>
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-5 text-white placeholder:text-text-muted/50 focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all"
                          placeholder="••••••••••••"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={connectBayse.isPending}
                        className="group w-full h-14 mt-4 bg-accent text-[#04120a] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(30,215,96,0.25)] transition-all disabled:opacity-50"
                      >
                        {connectBayse.isPending ? (
                          <>
                            <div className="w-5 h-5 border-2 border-[#04120a]/30 border-t-[#04120a] rounded-full animate-spin" />
                            Establishing...
                          </>
                        ) : (
                          <>
                            Initialize Connection
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
