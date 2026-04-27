import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useConnectBayse, useBayseAccount } from '../hooks/useBayse';
import { toast } from 'react-hot-toast';
import {
  Shield, Info, Lock, ArrowRight, CheckCircle2,
  Zap, Globe, Database, Cpu, ArrowLeft, Activity, 
  Terminal, BarChart3, Fingerprint
} from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Low-Latency Execution',
    description: 'Bypass manual hurdles. Your narratives execute in milliseconds through our optimized Bayse integration.'
  },
  {
    icon: Globe,
    title: 'Multi-Broker Gateway',
    description: 'Unified access to global markets. Connect once and trade across dozens of supported institutional brokers.'
  },
  {
    icon: Database,
    title: 'Non-Custodial Logic',
    description: 'We do not hold your funds. We only trigger orders based on your pre-approved quantitative parameters.'
  },
  {
    icon: Cpu,
    title: 'Orchestrator Sync',
    description: 'Real-time synchronization between your natural language strategy and live market execution.'
  },
  {
    icon: Terminal,
    title: 'API-First Architecture',
    description: 'Built for scale. Integrate your existing custom tools with our high-throughput execution engine.'
  },
  {
    icon: Fingerprint,
    title: 'Biometric Security',
    description: 'Hardware-level protection for session keys. Multi-factor authentication built into every handshake.'
  }
];

const STATS = [
  { label: 'Uptime', value: '99.99%' },
  { label: 'Avg Latency', value: '<45ms' },
  { label: 'Volume', value: '$2.4B+' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { data: account, isLoading: accountLoading } = useBayseAccount();
  const connectBayse = useConnectBayse();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <div className="flex h-screen w-full bg-[#07070f] overflow-hidden">
      {/* Left Column: Deep Context & Value */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-16 overflow-hidden border-r border-white/5 bg-[#0a0a14]">
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]">
              <Shield size={24} className="text-black" />
            </div>
            <div>
              <span className="font-display font-bold text-2xl tracking-tighter text-white uppercase italic block">Narrative</span>
              <span className="text-[10px] font-bold text-accent tracking-[0.3em] uppercase">Enterprise</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-7xl font-display font-bold text-white leading-[1.05] mb-8 tracking-tight">
              Direct <br />
              <span className="text-accent">Market Access.</span>
            </h1>
            <p className="text-xl text-text-sub max-w-xl leading-relaxed font-light">
              Bridge your strategy with institutional-grade execution. Connect via Bayse to enable full-cycle orchestration across global equities, crypto, and derivatives.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-12">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
              >
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-display font-bold text-white tracking-tight">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-x-12 gap-y-10 max-w-2xl">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              className="group space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/20 transition-all">
                  <feature.icon size={18} className="text-text-muted group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-bold text-white text-[13px] tracking-wide uppercase">{feature.title}</h3>
              </div>
              <p className="text-xs text-text-muted leading-relaxed pl-1">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 flex items-center justify-between border-t border-white/5 pt-10"
        >
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-[#0a0a14] bg-white/10 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
                </div>
              ))}
            </div>
            <p className="text-xs font-data text-text-muted tracking-widest uppercase">Trusted by institutional desks</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10">
            <Activity size={12} className="text-accent" />
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Network Health: Optimal</span>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Connection Form */}
      <div className="flex-1 relative flex flex-col justify-center items-center p-6 sm:p-20 bg-[#07070f]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--accent-rgb),0.02),transparent_70%)] pointer-events-none" />
        
        {/* Back Button */}
        <div className="absolute top-10 left-10 lg:left-12 z-20">
          <button 
            onClick={() => navigate('/auth')}
            className="flex items-center gap-3 text-text-muted hover:text-white transition-all group px-4 py-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Back to Login</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="lg:hidden mb-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
              <Shield size={32} className="text-accent" />
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-2">Connect Broker</h2>
            <p className="text-text-sub text-base">Secure execution bridge via Bayse</p>
          </div>

          <div className="mb-12">
            <h2 className="hidden lg:block text-4xl font-display font-bold text-white mb-4">Connect Account</h2>
            <p className="text-text-sub text-base leading-relaxed">
              Narrative uses Bayse to securely execute trades on your behalf.
              Authenticate your identity to authorize the Orchestrator.
            </p>
          </div>

          <div className="space-y-10">
            <div className="p-5 rounded-2xl bg-warn/5 border border-warn/10 flex items-start gap-4 backdrop-blur-md">
              <Info size={18} className="text-warn shrink-0 mt-0.5" />
              <p className="text-xs text-text-muted leading-relaxed uppercase tracking-wider font-medium">
                Connection is rate-limited to <strong className="text-warn">5 attempts / 5 mins</strong>.
                Single login attempts are throttled at 120s per request.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] pl-1">Identity Identifier</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
                    <Globe size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-14 pr-5 py-5 text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:bg-white/[0.04] transition-all"
                    placeholder="account@bayse.io"
                    disabled={connectBayse.isPending}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">Access Key</label>
                  <button type="button" className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline">Reset?</button>
                </div>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-14 pr-5 py-5 text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:bg-white/[0.04] transition-all"
                    placeholder="************"
                    disabled={connectBayse.isPending}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={connectBayse.isPending}
                className="group relative w-full h-16 bg-accent rounded-2xl text-black font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(var(--accent-rgb),0.5)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center justify-center gap-3">
                  {connectBayse.isPending ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      Authorize Connection
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="flex items-center gap-5 p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <BarChart3 size={24} className="text-accent" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-tight">Institutional Latency</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Bayse uses proprietary routing to ensure your orders hit the book with minimum slippage and maximal throughput.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-accent" />
            <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">PCI DSS Certified</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-accent" />
            <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">SOC2 Type II</span>
          </div>
        </div>
      </div>
    </div>
  );
}
