import { useState } from 'react';
import { useWorkspaces, useWorkspace, useWorkspaceFile, useDeposit, useWithdraw } from '../hooks/useWorkspace';
import { useOrchestratorThreads, useOrchestratorStatus } from '../hooks/useOrchestrator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Wallet, BarChart3, DollarSign, Layers,
  ArrowDown, ArrowUp, Clock, Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const COLORS = ['#00E676', '#4A7CFF', '#8B5CF6', '#FACC15', '#FF3B30', '#00BCD4', '#FF9800'];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<'positions' | 'allocation' | 'history'>('positions');
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');

  // ── Real data: fetch workspaces list and use the first ──
  const { data: workspaces } = useWorkspaces();
  const primaryWorkspace = workspaces?.[0];
  const workspaceId = primaryWorkspace?.workspace_id;

  const { data: workspace } = useWorkspace(workspaceId);
  const { data: portfolioFile, isLoading } = useWorkspaceFile(workspaceId, 'portfolio');
  const { data: execPlanFile } = useWorkspaceFile(workspaceId, 'execution_plan');
  const { data: logsFile } = useWorkspaceFile(workspaceId, 'logs');

  const deposit = useDeposit();
  const withdraw = useWithdraw();

  // ── Orchestrator: get trading mode ──
  const { data: orchThreads } = useOrchestratorThreads();
  const primaryThreadId = orchThreads?.[0]?.schedule?.thread_id;
  const { data: orchStatus } = useOrchestratorStatus(primaryThreadId);
  const tradingMode = orchStatus?.trading_policy?.mode ?? 'paper';
  const isLiveTrading = tradingMode === 'live';

  const portfolioData = (portfolioFile as any)?.parsedContent || {
    total_value: 0,
    cash_balance: 0,
    unallocated_master_liquidity: 0,
    positions: []
  };

  const executionPlan = (execPlanFile as any)?.parsedContent || null;

  // Build transaction history from real logs
  const allLogs = Array.isArray((logsFile as any)?.parsedContent) ? (logsFile as any).parsedContent : [];
  const transactionLogs = allLogs
    .filter((log: any) => log.event === 'PORTFOLIO_DEPOSIT' || log.event === 'PORTFOLIO_WITHDRAW')
    .slice(0, 20)
    .map((log: any, i: number) => ({
      id: `tx_${i}`,
      type: log.event === 'PORTFOLIO_DEPOSIT' ? 'deposit' as const : 'withdraw' as const,
      amount: log.metadata?.amount ?? 0,
      note: log.message || log.event,
      time: log.timestamp ? new Date(log.timestamp).toLocaleString() : '—',
    }));

  const chartData = [
    { name: 'Cash', value: portfolioData.cash_balance || 0 },
    ...(portfolioData.positions || []).map((p: any) => ({
      name: p.asset,
      value: p.current_value || 0
    }))
  ].filter(d => d.value > 0);

  const totalValue = portfolioData.total_value || 0;
  const currency = workspace?.base_currency || 'USD';
  const symbol = currency === 'NGN' ? '₦' : '$';
  const displayValue = currency === 'NGN' ? totalValue / 100 : totalValue;
  const unallocated = portfolioData.unallocated_master_liquidity || 0;
  const displayUnallocated = currency === 'NGN' ? unallocated / 100 : unallocated;

  const handleDeposit = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return toast.error('Enter a valid amount');
    if (!workspaceId) return toast.error('No workspace found');
    deposit.mutate({ workspaceId, amount: numAmount }, {
      onSuccess: () => {
        toast.success(`Deposited ${symbol}${numAmount.toLocaleString()}`);
        setAmount('');
        setShowDeposit(false);
      },
      onError: (err: any) => {
        const msg = err.response?.data?.error?.message || 'Failed to process deposit';
        toast.error(msg);
      },
    });
  };

  const handleWithdraw = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return toast.error('Enter a valid amount');
    if (numAmount > displayUnallocated) return toast.error('Amount exceeds unallocated balance');
    if (!workspaceId) return toast.error('No workspace found');
    withdraw.mutate({ workspaceId, amount: numAmount }, {
      onSuccess: () => {
        toast.success(`Withdrew ${symbol}${numAmount.toLocaleString()}`);
        setAmount('');
        setShowWithdraw(false);
      },
      onError: (err: any) => {
        const msg = err.response?.data?.error?.message || 'Failed to process withdrawal';
        toast.error(msg);
      },
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">Portfolio</h2>
          <p className="text-text-sub text-sm mt-1">Holdings breakdown, performance tracking, and capital management.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { setShowDeposit(!showDeposit); setShowWithdraw(false); setAmount(''); }}
            disabled={!workspaceId}
            className="px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-semibold flex items-center gap-2 hover:bg-accent/20 transition-colors disabled:opacity-30"
          >
            <ArrowDown size={14} /> Deposit
          </button>
          <button
            onClick={() => { setShowWithdraw(!showWithdraw); setShowDeposit(false); setAmount(''); }}
            disabled={!workspaceId}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors disabled:opacity-30"
          >
            <ArrowUp size={14} /> Withdraw
          </button>
        </div>
      </div>

      {/* Deposit / Withdraw Form */}
      {(showDeposit || showWithdraw) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              showDeposit ? 'bg-accent/10 border border-accent/20' : 'bg-white/5 border border-white/10'
            }`}>
              {showDeposit ? <ArrowDown size={16} className="text-accent" /> : <ArrowUp size={16} className="text-white" />}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Amount in ${currency}`}
              min="0"
              step="0.01"
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={showDeposit ? handleDeposit : handleWithdraw}
              disabled={deposit.isPending || withdraw.isPending}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                showDeposit ? 'bg-accent text-black hover:bg-accent-dim' : 'bg-white/10 text-white hover:bg-white/20'
              } disabled:opacity-50`}
            >
              {(deposit.isPending || withdraw.isPending) ? 'Processing...' : `Confirm ${showDeposit ? 'Deposit' : 'Withdrawal'}`}
            </button>
            <button
              onClick={() => { setShowDeposit(false); setShowWithdraw(false); setAmount(''); }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-text-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Wallet, label: 'Total Value', value: `${symbol}${displayValue.toLocaleString()}`, accent: true },
          { icon: DollarSign, label: 'Unallocated', value: `${symbol}${displayUnallocated.toLocaleString()}` },
          { icon: BarChart3, label: 'Open Positions', value: `${portfolioData.positions?.length || 0}` },
          { icon: Shield, label: 'Trading Mode', value: isLiveTrading ? 'LIVE' : 'Paper' },
        ].map((card) => (
          <div key={card.label} className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={13} className="text-text-muted" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-text-muted font-medium">{card.label}</span>
            </div>
            <p className={`font-display text-lg sm:text-2xl font-bold ${card.accent ? 'text-white' : 'text-white'}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs w-fit">
        <button className={`tab ${activeTab === 'positions' ? 'tab-active' : ''}`} onClick={() => setActiveTab('positions')}>Positions</button>
        <button className={`tab ${activeTab === 'allocation' ? 'tab-active' : ''}`} onClick={() => setActiveTab('allocation')}>Allocation</button>
        <button className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`} onClick={() => setActiveTab('history')}>
          <Clock size={12} className="inline mr-1.5" />History
        </button>
      </div>

      {activeTab === 'positions' ? (
        <div className="card overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <p className="section-label">Active Positions</p>
            <span className="text-xs text-text-muted font-data">{portfolioData.positions?.length || 0} open</span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-sm text-text-sub">
              <div className="w-10 h-10 rounded-full border-2 border-accent/20 border-t-accent animate-spin mx-auto mb-4" />
              Fetching ledger data...
            </div>
          ) : portfolioData.positions?.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-text-muted" />
              </div>
              <p className="text-sm text-white font-medium mb-1">No active positions</p>
              <p className="text-xs text-text-sub max-w-xs">
                Your portfolio is fully in cash. The orchestrator will deploy capital based on your compiled narrative thesis.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="data-table w-full min-w-[600px]">
                <thead>
                  <tr>
                    <th className="pl-6">Asset</th>
                    <th className="text-right">Size</th>
                    <th className="text-right hidden sm:table-cell">Entry Price</th>
                    <th className="text-right">Current Price</th>
                    <th className="text-right pr-6">PnL</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.positions.map((pos: any, i: number) => {
                    const pnl = pos.current_value - (pos.size * pos.entry_price);
                    const isProfit = pnl >= 0;
                    return (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="text-white font-medium pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[11px] font-bold text-text-sub">
                              {pos.asset?.substring(0, 2)}
                            </div>
                            <span>{pos.asset}</span>
                          </div>
                        </td>
                        <td className="text-right text-text-sub font-data text-[13px] py-4">{pos.size}</td>
                        <td className="text-right hidden sm:table-cell text-text-sub font-data text-[13px] py-4">{symbol}{pos.entry_price?.toLocaleString()}</td>
                        <td className="text-right text-white font-data text-[13px] py-4">{symbol}{pos.current_price?.toLocaleString() || pos.entry_price?.toLocaleString()}</td>
                        <td className="text-right pr-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold ${
                            isProfit ? 'bg-accent/10 border border-accent/20 text-accent' : 'bg-danger/10 border border-danger/20 text-danger'
                          }`}>
                            {isProfit ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {isProfit ? '+' : ''}{symbol}{Math.abs(pnl).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === 'allocation' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <p className="section-label mb-6">Asset Distribution</p>
            {chartData.length > 0 ? (
              <>
                <div className="h-48 sm:h-56 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(10, 10, 20, 0.95)',
                          borderColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                          fontSize: '12px',
                        }}
                        itemStyle={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Assets</p>
                      <p className="text-xl font-bold font-display text-white mt-0.5">{chartData.length}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mt-6">
                  {chartData.map((item, i) => {
                    const pct = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0';
                    return (
                      <div key={item.name} className="flex justify-between items-center text-sm p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-white font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-data text-[13px] text-text-sub">{symbol}{item.value.toLocaleString()}</span>
                          <span className="font-data text-[11px] text-text-muted w-10 text-right">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-center">
                <div>
                  <BarChart3 size={24} className="mx-auto text-text-muted mb-2" />
                  <p className="text-sm text-text-sub">No assets to display</p>
                </div>
              </div>
            )}
          </div>
          <div className="card">
            <p className="section-label mb-6">Execution Plan</p>
            {executionPlan ? (
              <div className="space-y-4 text-sm">
                <p className="text-text-sub leading-relaxed">
                  The orchestrator follows the compiled execution plan to manage your portfolio across market cycles.
                </p>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <pre className="text-xs font-data text-text-sub whitespace-pre-wrap overflow-auto max-h-72">
                    {typeof executionPlan === 'string' ? executionPlan : JSON.stringify(executionPlan, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <Layers size={24} className="text-text-muted mb-2" />
                <p className="text-sm text-text-sub">No execution plan loaded</p>
                <p className="text-xs text-text-muted mt-1">Compile a narrative to generate one</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── Transaction History Tab (real logs) ── */
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <p className="section-label">Transaction History</p>
            <span className="text-xs text-text-muted font-data">{transactionLogs.length} transactions</span>
          </div>
          <div className="space-y-2">
            {transactionLogs.length === 0 ? (
              <div className="text-center py-10">
                <Clock size={28} className="mx-auto mb-3 text-text-muted" />
                <p className="text-sm text-text-sub">No deposit or withdrawal transactions yet</p>
                <p className="text-xs text-text-muted mt-1">Use the deposit or withdraw buttons to manage capital.</p>
              </div>
            ) : (
              transactionLogs.map((tx: any) => (
                <div key={tx.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === 'deposit' ? 'bg-accent/10 border border-accent/20' : 'bg-white/5 border border-white/10'
                  }`}>
                    {tx.type === 'deposit' ? <ArrowDown size={16} className="text-accent" /> : <ArrowUp size={16} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}</p>
                    <p className="text-xs text-text-muted truncate">{tx.note}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-display font-bold ${tx.type === 'deposit' ? 'text-accent' : 'text-white'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}{symbol}{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-text-muted font-data flex items-center gap-1 justify-end">
                      <Clock size={9} /> {tx.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
