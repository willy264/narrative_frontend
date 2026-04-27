import { useState } from 'react';
import { useWorkspaces, useWorkspaceFile } from '../hooks/useWorkspace';
import {
  Terminal, Search, AlertTriangle,
  AlertCircle, Info, Activity
} from 'lucide-react';
import { format } from 'date-fns';
import CustomSelect from '../components/ui/CustomSelect';

const ACTOR_STYLES: Record<string, { color: string; bg: string; icon: typeof Activity }> = {
  researcher:   { color: 'text-blue',         bg: 'bg-blue/10',         icon: Search },
  pm:           { color: 'text-purple-400',    bg: 'bg-purple-500/10',   icon: Activity },
  executor:     { color: 'text-accent',        bg: 'bg-accent/10',       icon: Terminal },
  orchestrator: { color: 'text-warn',          bg: 'bg-warn/10',         icon: Activity },
};

const LEVEL_STYLES: Record<string, { color: string; icon: typeof Info }> = {
  info:  { color: 'text-text-sub', icon: Info },
  warn:  { color: 'text-warn', icon: AlertTriangle },
  error: { color: 'text-danger', icon: AlertCircle },
};

export default function Logs() {
  const [actorFilter, setActorFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Real data: fetch workspaces list and use the first ──
  const { data: workspaces } = useWorkspaces();
  const workspaceId = workspaces?.[0]?.workspace_id;

  const { data: logsFile, isLoading } = useWorkspaceFile(workspaceId, 'logs');

  const allLogs = Array.isArray((logsFile as any)?.parsedContent) ? (logsFile as any).parsedContent : [];

  const filteredLogs = allLogs.filter((log: any) => {
    if (actorFilter !== 'all' && log.actor?.toLowerCase() !== actorFilter) return false;
    if (levelFilter !== 'all' && log.level !== levelFilter) return false;
    if (searchQuery && !log.message?.toLowerCase().includes(searchQuery.toLowerCase()) && !log.event?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const actors = [...new Set(allLogs.map((l: any) => l.actor?.toLowerCase()).filter(Boolean))] as string[];

  const getActorStyle = (actor: string) => {
    return ACTOR_STYLES[actor?.toLowerCase()] || { color: 'text-text-muted', bg: 'bg-white/5', icon: Activity };
  };

  const errorCount = allLogs.filter((l: any) => l.level === 'error').length;
  const warnCount = allLogs.filter((l: any) => l.level === 'warn').length;
  const infoCount = allLogs.filter((l: any) => l.level === 'info').length;

  const actorOptions = [
    { label: 'All Actors', value: 'all' },
    ...actors.map(a => ({ label: a.charAt(0).toUpperCase() + a.slice(1), value: a }))
  ];

  const levelOptions = [
    { label: 'All Levels', value: 'all' },
    { label: 'Info', value: 'info' },
    { label: 'Warning', value: 'warn' },
    { label: 'Error', value: 'error' }
  ];

  return (
    <div className="space-y-5 h-full flex flex-col pb-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start justify-between shrink-0">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">System Logs</h2>
          <p className="text-text-sub text-sm mt-1">Orchestrator execution timeline — inspect every cycle, actor, and decision.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="pulse-dot" />
          <span className="font-data text-xs text-text-sub">LIVE</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={12} className="text-text-muted" />
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Total</span>
          </div>
          <p className="font-display text-lg font-bold text-white">{allLogs.length}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <Info size={12} className="text-blue" />
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Info</span>
          </div>
          <p className="font-display text-lg font-bold text-white">{infoCount}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={12} className="text-warn" />
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Warnings</span>
          </div>
          <p className="font-display text-lg font-bold text-warn">{warnCount}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={12} className="text-danger" />
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Errors</span>
          </div>
          <p className="font-display text-lg font-bold text-danger">{errorCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        <CustomSelect
          value={actorFilter}
          onChange={setActorFilter}
          options={actorOptions}
          className="w-full sm:w-48"
        />
        <CustomSelect
          value={levelFilter}
          onChange={setLevelFilter}
          options={levelOptions}
          className="w-full sm:w-48"
        />
      </div>

      {/* Terminal */}
      <div className="card flex-1 flex flex-col overflow-hidden min-h-0 p-0">
        <div className="px-4 sm:px-5 py-3 border-b border-border flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-danger/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warn/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent/60" />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Terminal size={14} className="text-text-muted" />
            <span className="font-data text-xs text-text-muted">workspace/logs.json</span>
          </div>
          <div className="ml-auto text-xs text-text-muted font-data">
            {filteredLogs.length} / {allLogs.length}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-3 sm:p-5 font-data text-xs sm:text-sm space-y-0.5">
          {isLoading ? (
            <div className="text-text-sub text-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin mx-auto mb-3" />
              Loading execution logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-text-sub text-center py-12">
              <Terminal size={28} className="mx-auto mb-3 text-text-muted" />
              <p className="text-sm">{allLogs.length === 0 ? 'No logs available for this workspace yet.' : 'No logs match your filters.'}</p>
              {allLogs.length === 0 && (
                <p className="text-text-muted text-xs mt-2">Logs appear after the orchestrator completes its first 4-hour cycle.</p>
              )}
            </div>
          ) : (
            filteredLogs.map((log: any, i: number) => {
              const style = getActorStyle(log.actor);
              const levelStyle = LEVEL_STYLES[log.level] || LEVEL_STYLES.info;
              const LevelIcon = levelStyle.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 hover:bg-white/[0.02] p-2.5 -mx-2.5 px-2.5 rounded-lg transition-colors group"
                >
                  <div className="text-text-muted w-16 shrink-0 hidden sm:block tabular-nums">
                    {log.timestamp ? format(new Date(log.timestamp), 'HH:mm:ss') : '00:00:00'}
                  </div>
                  <LevelIcon size={13} className={`shrink-0 mt-0.5 hidden sm:block ${levelStyle.color}`} />
                  <div className={`shrink-0 inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider w-fit ${style.bg} ${style.color}`}>
                    {log.actor || 'SYSTEM'}
                  </div>
                  <div className={`flex-1 min-w-0 ${levelStyle.color}`}>
                    <span className="mr-2 font-semibold text-white/80">{log.event}</span>
                    <span className="break-words">{log.message}</span>
                  </div>
                  <div className="sm:hidden text-text-muted text-[10px]">
                    {log.timestamp ? format(new Date(log.timestamp), 'HH:mm:ss') : ''}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
