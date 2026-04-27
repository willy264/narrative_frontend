import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useConnectBayse, useBayseAccount } from '../hooks/useBayse';
import { toast } from 'react-hot-toast';
import {
  Shield, Info, Lock, ArrowRight, CheckCircle2,
  Zap, Globe, Database, Cpu
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
  }
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
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-16 overflow-hidden border-r border-white/5 bg-[#0a0a14]">
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-blue/5 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-16"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]">
              <Shield size={24} className="text-black" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tighter text-white uppercase italic">Narrative</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-6xl font-display font-bold text-white leading-[1.1] mb-8 tracking-tight">
              Enterprise-Grade <br />
              <span className="text-accent">Thesis Execution.</span>
            </h1>
            <p className="text-xl text-text-sub max-w-xl leading-relaxed font-light">
              Connect your institutional-grade broker through Bayse to unlock real-time orchestrator capabilities and bridge the gap between analysis and action.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8 max-w-2xl">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <feature.icon size={18} className="text-accent" />
              </div>
              <h3 className="font-bold text-white text-sm tracking-wide uppercase">{feature.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 flex items-center gap-6"
        >
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a14] bg-white/10" />
            ))}
          </div>
          <p className="text-xs font-data text-text-muted tracking-widest uppercase">Trusted by 500+ quantitative researchers</p>
        </motion.div>
      </div>

      <div className="flex-1 relative flex flex-col justify-center items-center p-6 sm:p-20 bg-[#07070f]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--accent-rgb),0.02),transparent_70%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="lg:hidden mb-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
              <Shield size={28} className="text-accent" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">Connect Broker</h2>
            <p className="text-text-sub text-sm">Secure execution bridge via Bayse</p>
          </div>

          <div className="mb-10">
            <h2 className="hidden lg:block text-3xl font-display font-bold text-white mb-3">Connect Account</h2>
            <p className="text-text-sub text-sm leading-relaxed">
              Narrative uses Bayse to securely execute trades on your behalf.
              Please provide your credentials to authorize the Orchestrator.
            </p>
          </div>

          <div className="space-y-8">
            <div className="p-4 rounded-xl bg-warn/5 border border-warn/10 flex items-start gap-4">
              <Info size={16} className="text-warn shrink-0 mt-0.5" />
              <p className="text-[11px] text-text-muted leading-relaxed uppercase tracking-wider font-medium">
                Connection is rate-limited to <strong className="text-warn">5 attempts / 5 mins</strong>.
                Single login attempts are throttled at 120s per request.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Bayse Identity Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:bg-white/[0.04] transition-all"
                  placeholder="account@bayse.io"
                  disabled={connectBayse.isPending}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Secure Password</label>
                  <button type="button" className="text-[10px] font-bold text-accent uppercase tracking-wider hover:underline">Forgot?</button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:bg-white/[0.04] transition-all"
                  placeholder="************"
                  disabled={connectBayse.isPending}
                />
              </div>

              <button
                type="submit"
                disabled={connectBayse.isPending}
                className="group relative w-full h-14 bg-accent rounded-2xl text-black font-bold text-sm uppercase tracking-widest overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center justify-center gap-3">
                  {connectBayse.isPending ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                      Authenticating
                    </>
                  ) : (
                    <>
                      Authorize Connection
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Lock size={18} className="text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-tight">End-to-End Encryption</h4>
                <p className="text-[10px] text-text-muted leading-relaxed">
                  We exchange credentials for secure session tokens stored in our encrypted Vault.
                  Your password is never stored and your keys never leave the server.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-accent" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">PCI DSS Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
