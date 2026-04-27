import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, ArrowRight, Activity, BarChart3, Users,
  Wallet, ArrowUpRight, Play, Pause, RefreshCcw, Eye,
  TrendingUp, Cpu, ChevronRight, Layers, Target, AlertTriangle, Shield, Info
} from 'lucide-react';
import { useOrchestratorThreads, useOrchestratorStatus, useRunOrchestrator, usePauseOrchestrator, useResumeOrchestrator, useRunHistory } from '../hooks/useOrchestrator';
import { useWorkspaceFile, useNarratives } from '../hooks/useWorkspace';
import { useBayseBalance } from '../hooks/useBayse';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const SCHEDULE_STATUS_STYLES: Record<string, { dot: string; text: string; label: string }> = {
  active:   { dot: 'bg-accent animate-pulse', text: 'text-accent', label: 'Active' },
  paused:   { dot: 'bg-warn', text: 'text-warn', label: 'Paused' },
  terminal: { dot: 'bg-danger', text: 'text-danger', label: 'Terminal' },
};

const RUN_STATUS_STYLES: Record<string, { dot: string; text: string; label: string }> = {
  started:   { dot: 'bg-accent animate-pulse', text: 'text-accent', label: 'Live' },
  succeeded: { dot: 'bg-purple-400', text: 'text-purple-400', label: 'Completed' },
  failed:    { dot: 'bg-danger', text: 'text-danger', label: 'Failed' },
  skipped:   { dot: 'bg-text-muted', text: 'text-text-muted', label: 'Skipped' },
};

export default function Dashboard() {
  const [sessionFilter, setSessionFilter] = useState<'All' | 'Live' | 'Completed' | 'Failed'>('All');
  const navigate = useNavigate();

  // ── Real data: fetch all orchestrator threads, use the first active one ──
  const { data: orchThreads } = useOrchestratorThreads();
  const primaryThread = orchThreads?.[0];
  const primaryThreadId = primaryThread?.schedule?.thread_id;
  const primaryWorkspaceId = primaryThread?.workspace?.workspace_id;

  const { data: status } = useOrchestratorStatus(primaryThreadId, true);
  const { data: portfolioFile } = useWorkspaceFile(primaryWorkspaceId, 'portfolio');
  const { data: runHistory } = useRunHistory(primaryThreadId, undefined, 10);

  // ── Bayse balance (shown in stats strip) ──
  const { data: bayseBalance } = useBayseBalance(true);

  // ── Narratives list (for count in stats and workspace names) ──
  const { data: narratives } = useNarratives();


  const runOrchestrator = useRunOrchestrator();
  const pauseOrchestrator = usePauseOrchestrator();
  const resumeOrchestrator = useResumeOrchestrator();

  const isRunning = status?.latest_run?.status === 'started';
  const isPaused = status?.schedule?.status === 'paused';
  const isTerminal = status?.schedule?.status === 'terminal';
  const tradingMode: string = status?.trading_policy?.mode ?? 'paper';
  const isLive = tradingMode === 'live';
  const isRuntimeDisabled = status?.runtime_mode === 'disabled';
  const portfolioData = (portfolioFile as any)?.parsedContent || { total_value: 0, positions: [] };

  // Compute total Bayse wallet value
  const bayseTotal = bayseBalance?.assets?.reduce((sum, a) => sum + a.total, 0) ?? 0;

  // Show Bayse setup banner if latest run failed with Bayse error
  const bayseSetupNeeded = status?.latest_run?.status === 'failed' &&
    (status?.latest_run?.summary?.toLowerCase().includes('bayse') || status?.schedule?.last_error?.toLowerCase().includes('bayse'));

  const handleManualRun = () => {
    if (!primaryThreadId) return toast.error('No active orchestrator thread found.');
    runOrchestrator.mutate(primaryThreadId, {
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
    if (!primaryThreadId) return;
    if (status?.schedule?.status === 'active') {
      pauseOrchestrator.mutate(primaryThreadId);
    } else {
      resumeOrchestrator.mutate(primaryThreadId);
    }
  };

  // Build session list from real run history
  const sessions = (runHistory ?? []).map(run => ({
    id: `#${run.run_id.slice(-5)}`,
    space: primaryThread?.workspace?.narrative_id ?? '—',
    rawStatus: run.status,
    progress: run.status === 'succeeded' ? 100 : run.status === 'started' ? 40 : run.status === 'failed' ? 65 : 100,
    trigger: run.trigger,
    time: formatDistanceToNow(new Date(run.started_at), { addSuffix: true }),
    summary: run.summary,
  }));

  const filteredSessions = sessionFilter === 'All'
    ? sessions
    : sessions.filter(s => {
        if (sessionFilter === 'Live') return s.rawStatus === 'started';
        if (sessionFilter === 'Completed') return s.rawStatus === 'succeeded';
        if (sessionFilter === 'Failed') return s.rawStatus === 'failed';
        return true;
      });

  return (
    <div className="space-y-8 pb-10">

      {/* ── Bayse Setup Banner ── */}
      {bayseSetupNeeded && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-warn/[0.06] border border-warn/20">
          <AlertTriangle size={16} className="text-warn shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">Bayse account setup required</p>
            <p className="text-xs text-text-sub mt-0.5">The orchestrator couldn't place trades because your Bayse API key is missing or invalid.</p>
          </div>
          <button onClick={() => navigate('/settings')} className="text-xs font-semibold text-warn hover:underline shrink-0">
            Fix Setup →
          </button>
        </div>
      )}

      {/* ── Runtime Disabled Banner ── */}
      {isRuntimeDisabled && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue/[0.06] border border-blue/20">
          <Info size={16} className="text-blue shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">AI runtime unavailable</p>
            <p className="text-xs text-text-sub mt-0.5">Scheduled runs are currently in test mode and will be logged as skipped. This is a backend configuration issue — please try again later.</p>
          </div>
        </div>
      )}

      {/* ── Hero Header ── */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Narratives</h2>
          <p className="text-text-sub text-sm leading-relaxed max-w-lg">
            Explore AI-powered trading narratives. Join a space to deploy agents, compete with strategies, and earn rewards across market cycles.
          </p>
        </div>
        <button
          onClick={() => navigate('/messages')}
          className="btn-join inline-flex items-center gap-2.5 shrink-0 self-start"
        >
          <Plus size={16} />
          Create Narrative
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Wallet, label: 'Portfolio Value', value: `$${(portfolioData.total_value || 0).toLocaleString()}`, sub: <span className="text-accent"><ArrowUpRight size={10} className="inline" /> Bayse: ${bayseTotal.toLocaleString()}</span> },
          { icon: BarChart3, label: 'Total Runs', value: sessions.length > 0 ? String(sessions.length) : '—', sub: <span className="text-accent">{sessions.filter(s => s.rawStatus === 'started').length} live</span> },
          { icon: Layers, label: 'Narratives', value: String(narratives?.length ?? 0), sub: <span className="text-text-muted">{orchThreads?.length ?? 0} orchestrator threads</span> },
          { icon: Users, label: 'Trading Mode', value: isLive ? 'LIVE' : 'Paper', sub: <span className={isLive ? 'text-danger' : 'text-text-muted'}>{isLive ? 'Real money active' : 'Simulated trades'}</span>, small: true },
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
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-white">Orchestrator</p>
              <span className={`text-[10px] font-data font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                isRunning ? 'bg-accent/10 text-accent' :
                isPaused ? 'bg-warn/10 text-warn' :
                isTerminal ? 'bg-danger/10 text-danger' :
                'bg-white/5 text-text-muted'
              }`}>
                {isRunning ? 'RUNNING' : isPaused ? 'PAUSED' : isTerminal ? 'TERMINAL' : 'IDLE'}
              </span>
              {/* Trading mode badge */}
              {status && (
                <span className={`text-[10px] font-data font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  isLive ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-white/5 text-text-muted'
                }`}>
                  <Shield size={9} />
                  {isLive ? 'LIVE TRADING' : 'PAPER'}
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              {isTerminal
                ? 'Schedule terminated — narrative reached end state'
                : status?.schedule?.next_run_at
                  ? `Next cycle ${formatDistanceToNow(new Date(status.schedule.next_run_at), { addSuffix: true })}`
                  : primaryThreadId ? 'Every 4 hours' : 'No active threads — create a narrative to start'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isTerminal && primaryThreadId && (
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
            disabled={isRunning || isTerminal || !primaryThreadId}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            <RefreshCcw size={13} className={isRunning ? 'animate-spin' : ''} />
            {isRunning ? 'Running...' : 'Force Run'}
          </button>
        </div>
      </div>

      {/* ── Recent Sessions (real run history) ── */}
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
            <div className="text-center py-10 text-sm text-text-muted">
              {sessions.length === 0
                ? 'No orchestrator runs yet. Create a narrative and run the orchestrator to get started.'
                : 'No sessions match this filter.'}
            </div>
          ) : (
            filteredSessions.map((session) => {
              const colors = RUN_STATUS_STYLES[session.rawStatus as keyof typeof RUN_STATUS_STYLES] ?? RUN_STATUS_STYLES.skipped;
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
                    <span className={`text-xs font-medium ${colors.text}`}>{colors.label}</span>
                  </div>
                  <div className="hidden md:flex items-center gap-2 w-28 shrink-0">
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          session.rawStatus === 'failed' ? 'bg-danger' : 'bg-accent'
                        }`}
                        style={{ width: `${session.progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-text-muted font-data w-8 text-right">{session.progress}%</span>
                  </div>
                  <button className="btn-session shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" onClick={() => navigate('/logs')}>
                    <Eye size={13} />
                    <span className="hidden sm:inline">{session.rawStatus === 'started' ? 'Watch' : 'Results'}</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Active Workspaces (real data from orchestrator threads) ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg sm:text-xl font-bold text-white">Active Spaces</h3>
          <span className="text-xs text-text-muted">{orchThreads?.length ?? 0} active workspace{(orchThreads?.length ?? 0) !== 1 ? 's' : ''}</span>
        </div>
        {(!orchThreads || orchThreads.length === 0) ? (
          <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl bg-white/[0.02] border border-dashed border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Layers size={24} className="text-text-muted" />
            </div>
            <p className="text-sm font-medium text-white mb-1">No active workspaces</p>
            <p className="text-xs text-text-sub max-w-sm mb-6">
              Compile your first trading narrative to create a workspace. The orchestrator will begin its 4-hour trading cycle automatically.
            </p>
            <button
              onClick={() => navigate('/messages')}
              className="btn-join inline-flex items-center gap-2 text-sm"
            >
              <Plus size={14} /> Create Narrative <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {orchThreads.map((ot, idx) => {
              const WORKSPACE_ICONS = [TrendingUp, Activity, Target, Layers];
              const Icon = WORKSPACE_ICONS[idx % WORKSPACE_ICONS.length];
              const schedule = ot.schedule;
              const latestRun = ot.latest_run;
              const ws = ot.workspace;
              const narrative = narratives?.find(n => n.narrative_id === schedule.narrative_id);
              const schedStatus = SCHEDULE_STATUS_STYLES[schedule.status] ?? SCHEDULE_STATUS_STYLES.active;
              const currency = ws?.base_currency === 'NGN' ? '₦' : '$';
              const consecutiveFails = schedule.consecutive_failures;

              return (
                <div key={schedule.thread_id} className="market-card group">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        schedule.status === 'active' ? 'bg-accent/10 border border-accent/20 group-hover:bg-accent/15' :
                        schedule.status === 'paused' ? 'bg-warn/10 border border-warn/20' :
                        'bg-danger/10 border border-danger/20'
                      }`}>
                        <Icon size={20} className={
                          schedule.status === 'active' ? 'text-accent' :
                          schedule.status === 'paused' ? 'text-warn' : 'text-danger'
                        } />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display text-base sm:text-lg font-bold text-white truncate">
                          {narrative?.narrative_id ? `Narrative ${narrative.narrative_id.slice(-6)}` : `Thread ${schedule.thread_id.slice(-6)}`}
                        </h3>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-text-muted">
                          <span className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${schedStatus.dot}`} />
                            {schedStatus.label}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={11} /> {currency} {ws?.base_currency ?? 'USD'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => navigate('/portfolio')} className="btn-join shrink-0">
                      View <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Workspace info */}
                  <div className="text-sm text-text-sub leading-relaxed mb-4">
                    {latestRun?.summary
                      ? <span className="line-clamp-2">{latestRun.summary}</span>
                      : schedule.status === 'terminal'
                        ? 'This narrative has reached a terminal state and is now read-only.'
                        : 'Orchestrator is armed and will execute on the next 4-hour cycle.'}
                  </div>

                  {/* Tags from real data */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    <span className="tag">{ws?.base_currency ?? 'USD'}</span>
                    <span className="tag">v{ws?.version ?? 1}</span>
                    {latestRun?.trigger && <span className="tag">{latestRun.trigger}</span>}
                    {consecutiveFails > 0 && <span className="tag text-danger border-danger/20">{consecutiveFails} fail{consecutiveFails > 1 ? 's' : ''}</span>}
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-text-muted mb-0.5">Status</p>
                      <p className={`font-display text-sm font-bold ${schedStatus.text}`}>{schedStatus.label}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted mb-0.5">Last Run</p>
                      <p className="font-display text-sm font-bold text-white">
                        {latestRun?.status
                          ? (RUN_STATUS_STYLES[latestRun.status]?.label ?? latestRun.status)
                          : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted mb-0.5">Next Run</p>
                      <p className="font-display text-sm font-bold text-white truncate">
                        {schedule.next_run_at
                          ? formatDistanceToNow(new Date(schedule.next_run_at), { addSuffix: true })
                          : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted mb-0.5">Created</p>
                      <p className="font-display text-sm font-bold text-white truncate">
                        {formatDistanceToNow(new Date(schedule.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
