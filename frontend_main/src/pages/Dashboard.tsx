import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, ArrowRight, Activity, Zap, BarChart3, Users,
  Wallet, ArrowUpRight, Play, Pause, RefreshCcw, Eye,
  TrendingUp, Cpu, ChevronRight, Layers, Target
} from 'lucide-react';
import { useOrchestratorStatus, useRunOrchestrator, usePauseOrchestrator, useResumeOrchestrator } from '../hooks/useOrchestrator';
import { useWorkspace, useWorkspaceFile } from '../hooks/useWorkspace';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const MOCK_THREAD_ID = 'thread_local_123';
const MOCK_WORKSPACE_ID = 'workspace_local_123';

const MARKET_ICONS = [TrendingUp, Activity, Target, Layers];

const MOCK_MARKETS = [
  {
    id: 'btc-momentum', name: 'BTC Momentum',
    description: 'Build and run AI agents that analyze Bitcoin momentum indicators. Deploy trading strategies, compete for top performance, and earn rewards.',
    tags: ['Technical Analysis', 'Trading Strategy', 'Risk Management'],
    liveSessions: 3, activeUsers: 138, multiplier: '2x',
    totalSessions: '389.9K', totalRewards: '465.11K USD',
    apy: '28.25%',
  },
  {
    id: 'eth-yield', name: 'ETH Yield Farm',
    description: 'Put your stablecoins to work with AI agents that track real-time yield opportunities and dynamically shift your assets to maximize returns.',
    tags: ['Stablecoins', 'Yield Optimization', 'Cross-Chain'],
    liveSessions: 0, activeUsers: 42, multiplier: '1.8x',
    totalSessions: '202.3K', totalRewards: '32.8K USD',
    apy: '12.40%',
  },
  {
    id: 'forex-macro', name: 'Forex Macro',
    description: 'Design macro-economic narrative agents that compete in forex markets. Use logic, timing, and strategy to outplay others in currency trading.',
    tags: ['Macro Strategy', 'Currency Trading', 'Position Control'],
    liveSessions: 1, activeUsers: 89, multiplier: '1.5x',
    totalSessions: '554.3K', totalRewards: '142.16K USD',
    apy: '19.85%',
  },
  {
    id: 'defi-arb', name: 'DeFi Arbitrage',
    description: 'Run trading agents with your own strategy logic. No code, no barriers. Deploy agents to find arbitrage opportunities across DeFi protocols.',
    tags: ['DeFi', 'Arbitrage', 'Smart Contracts', 'Liquidity'],
    liveSessions: 0, activeUsers: 24, multiplier: '2.5x',
    totalSessions: '0', totalRewards: '0.00 USD',
    apy: '0.00%',
  },
];

const MOCK_SESSIONS = [
  { id: '#38757', space: 'BTC Momentum', status: 'Live' as const, progress: 40, reward: '0.27 USD', trigger: 'scheduler', time: '2 min ago' },
  { id: '#38756', space: 'ETH Yield Farm', status: 'Completed' as const, progress: 100, reward: '1.24 USD', trigger: 'manual', time: '1h ago' },
  { id: '#38755', space: 'BTC Momentum', status: 'Completed' as const, progress: 100, reward: '0.89 USD', trigger: 'scheduler', time: '5h ago' },
  { id: '#38754', space: 'Forex Macro', status: 'Failed' as const, progress: 65, reward: '0.00 USD', trigger: 'scheduler', time: '9h ago' },
  { id: '#38753', space: 'BTC Momentum', status: 'Completed' as const, progress: 100, reward: '2.10 USD', trigger: 'manual', time: '13h ago' },
];

const statusColors = {
  Live: { dot: 'bg-accent animate-pulse', text: 'text-accent' },
  Completed: { dot: 'bg-purple-400', text: 'text-purple-400' },
  Failed: { dot: 'bg-danger', text: 'text-danger' },
};

export default function Dashboard() {
  const [sessionFilter, setSessionFilter] = useState<'All' | 'Live' | 'Completed' | 'Failed'>('All');
  const navigate = useNavigate();
  const { data: status } = useOrchestratorStatus(MOCK_THREAD_ID, true);
  const { data: workspace } = useWorkspace(status?.workspace?.workspace_id || MOCK_WORKSPACE_ID);
  const { data: portfolioFile } = useWorkspaceFile(workspace?.workspace_id, 'portfolio');

  const runOrchestrator = useRunOrchestrator();
  const pauseOrchestrator = usePauseOrchestrator();
  const resumeOrchestrator = useResumeOrchestrator();

  const isRunning = status?.latest_run?.status === 'started';
  const isPaused = status?.schedule?.status === 'paused';
  const isTerminal = status?.schedule?.status === 'terminal';
  const portfolioData = (portfolioFile as any)?.parsedContent || { total_value: 0, positions: [] };

  const handleManualRun = () => {
    runOrchestrator.mutate(MOCK_THREAD_ID, {
      onSuccess: () => toast.success('Orchestrator run triggered successfully.'),
      onError: (err: any) => {
        if (err?.response?.status === 409) {
          toast.error('A run is already in progress. Try again in a minute.');
        } else {
          toast.error('Failed to trigger orchestrator.');
        }
      },
    });
  };

  const handleTogglePause = () => {
    if (status?.schedule?.status === 'active') {
      pauseOrchestrator.mutate(MOCK_THREAD_ID);
    } else {
      resumeOrchestrator.mutate(MOCK_THREAD_ID);
    }
  };

  const filteredSessions = sessionFilter === 'All'
    ? MOCK_SESSIONS
    : MOCK_SESSIONS.filter(s => s.status === sessionFilter);

  return (
    <div className="space-y-8 pb-10">
      {/* ── Hero Header ── */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Markets</h2>
          <p className="text-text-sub text-sm leading-relaxed max-w-lg">
            Explore AI-powered trading narratives. Join a space to deploy agents, compete with strategies, and earn rewards across market cycles.
          </p>
        </div>
        <button
          onClick={() => navigate('/compiler')}
          className="btn-create inline-flex items-center gap-2.5 shrink-0 self-start"
        >
          <Plus size={16} />
          Create Market
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Wallet, label: 'Total Value', value: `$${(portfolioData.total_value || 124500).toLocaleString()}`, sub: <span className="text-accent"><ArrowUpRight size={10} className="inline" /> +2.4% in 24h</span> },
          { icon: BarChart3, label: 'Total Runs', value: '3.79M', sub: <span className="text-accent">503 in last 24h</span> },
          { icon: Zap, label: 'Trending', value: 'BTC Momentum', sub: <span className="text-text-muted">230 sessions in 24h</span>, small: true },
          { icon: Users, label: 'Active Agents', value: '153.2K', sub: <span className="text-text-muted">176 active in last 24h</span> },
        ].map((stat) => (
          <div key={stat.label} className="stat-card group">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={13} className="text-text-muted group-hover:text-accent transition-colors" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-text-muted font-medium">{stat.label}</span>
            </div>
            <p className={`font-display ${stat.small ? 'text-sm sm:text-base' : 'text-lg sm:text-xl'} font-bold text-white truncate`}>{stat.value}</p>
            <p className="text-[10px] mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Orchestrator Control Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isRunning ? 'bg-accent/15 border border-accent/30' :
              isPaused ? 'bg-warn/15 border border-warn/30' :
              isTerminal ? 'bg-danger/15 border border-danger/30' :
              'bg-white/5 border border-white/10'
            }`}>
              <Cpu size={18} className={
                isRunning ? 'text-accent animate-pulse' :
                isPaused ? 'text-warn' :
                isTerminal ? 'text-danger' :
                'text-text-muted'
              } />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">Orchestrator</p>
              <span className={`text-[10px] font-data font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                isRunning ? 'bg-accent/10 text-accent' :
                isPaused ? 'bg-warn/10 text-warn' :
                isTerminal ? 'bg-danger/10 text-danger' :
                'bg-white/5 text-text-muted'
              }`}>
                {isRunning ? 'RUNNING' : isPaused ? 'PAUSED' : isTerminal ? 'TERMINAL' : 'IDLE'}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              {status?.schedule?.next_run_at
                ? `Next cycle ${formatDistanceToNow(new Date(status.schedule.next_run_at), { addSuffix: true })}`
                : 'Every 4 hours • Paper trading mode'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isTerminal && (
            <button
              onClick={handleTogglePause}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                isPaused
                  ? 'bg-accent text-black hover:bg-accent-dim'
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
          <button
            onClick={handleManualRun}
            disabled={isRunning || isTerminal}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            <RefreshCcw size={13} className={isRunning ? 'animate-spin' : ''} />
            {isRunning ? 'Running...' : 'Force Run'}
          </button>
        </div>
      </div>

      {/* ── Market Space Cards ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg sm:text-xl font-bold text-white">Active Spaces</h3>
          <span className="text-xs text-text-muted">{MOCK_MARKETS.length} spaces available</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {MOCK_MARKETS.map((market, idx) => {
            const Icon = MARKET_ICONS[idx % MARKET_ICONS.length];
            return (
              <div key={market.id} className="market-card group">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
                      <Icon size={20} className="text-accent" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-base sm:text-lg font-bold text-white truncate">{market.name}</h3>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${market.liveSessions > 0 ? 'bg-accent' : 'bg-text-muted'}`} />
                          {market.liveSessions} Live
                        </span>
                        <span className="flex items-center gap-1"><Users size={11} /> {market.activeUsers} Active</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => navigate('/compiler')} className="btn-join shrink-0">
                    Join Space <ArrowRight size={14} />
                  </button>
                </div>
                <p className="text-sm text-text-sub leading-relaxed mb-4 line-clamp-2">{market.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {market.tags.map((tag) => (<span key={tag} className="tag">{tag}</span>))}
                </div>
                <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[10px] text-text-muted mb-0.5">Multiplier</p>
                    <p className="font-display text-sm font-bold text-accent">{market.multiplier}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted mb-0.5">ROI</p>
                    <p className="font-display text-sm font-bold text-accent">{market.apy}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted mb-0.5">Sessions</p>
                    <p className="font-display text-sm font-bold text-white">{market.totalSessions}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted mb-0.5">Rewards</p>
                    <p className="font-display text-sm font-bold text-white">{market.totalRewards}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Recent Sessions ── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="font-display text-lg sm:text-xl font-bold text-white">Recent Sessions</h3>
          <div className="flex items-center gap-3">
            <div className="tabs w-fit">
              {(['All', 'Live', 'Completed', 'Failed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setSessionFilter(f)}
                  className={`tab ${sessionFilter === f ? 'tab-active' : ''}`}
                >
                  {f !== 'All' && (
                    <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${
                      f === 'Live' ? 'bg-accent' : f === 'Completed' ? 'bg-purple-400' : 'bg-danger'
                    }`} />
                  )}
                  {f}
                </button>
              ))}
            </div>
            <button onClick={() => navigate('/logs')} className="text-xs text-accent hover:text-accent-dim transition-colors flex items-center gap-1 shrink-0">
              View all <ChevronRight size={12} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-10 text-sm text-text-muted">No sessions match this filter.</div>
          ) : (
            filteredSessions.map((session) => {
              const colors = statusColors[session.status];
              return (
                <div key={session.id} className="session-row group">
                  <span className="text-text-muted font-data text-xs w-16 shrink-0 hidden sm:block">{session.id}</span>
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Activity size={14} className="text-accent" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm text-white font-medium truncate block">{session.space}</span>
                      <span className="text-[10px] text-text-muted font-data">{session.time} · {session.trigger}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                    <span className={`text-xs font-medium ${colors.text}`}>{session.status}</span>
                  </div>
                  <div className="hidden md:flex items-center gap-2 w-28 shrink-0">
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          session.status === 'Failed' ? 'bg-danger' : 'bg-accent'
                        }`}
                        style={{ width: `${session.progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-text-muted font-data w-8 text-right">{session.progress}%</span>
                  </div>
                  <span className={`hidden sm:inline-flex px-3 py-1 rounded-lg text-[11px] font-semibold font-data shrink-0 ${
                    parseFloat(session.reward) > 0 ? 'bg-accent/10 text-accent' : 'bg-white/5 text-text-muted'
                  }`}>
                    {session.reward}
                  </span>
                  <button className="btn-session shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Eye size={13} />
                    <span className="hidden sm:inline">{session.status === 'Live' ? 'Watch' : 'Results'}</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
