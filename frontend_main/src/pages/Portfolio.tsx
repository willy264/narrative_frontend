import { useState } from 'react';
import { useWorkspaces, useWorkspace, useWorkspaceFile, useDeposit, useWithdraw } from '../hooks/useWorkspace';
import { useOrchestratorThreads, useOrchestratorStatus } from '../hooks/useOrchestrator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Wallet, BarChart3, DollarSign, Layers,
  ArrowDown, ArrowUp, Clock
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

  const itemVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1200px] mx-auto space-y-8 pb-20"
    >
      {/* ── Header & Action Buttons ── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-text-sub text-sm max-w-lg">Manage your workspace assets and track performance across active narratives.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWithdraw(true)}
            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <ArrowUp size={16} /> Withdraw
          </button>
          <button
            onClick={() => setShowDeposit(true)}
            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-accent text-black font-semibold hover:bg-accent-dim transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
          >
            <ArrowDown size={16} /> Deposit
          </button>
        </div>
      </motion.div>

      {/* ── Core Metrics ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="market-card p-6 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Wallet size={20} className="text-accent" />
            </div>
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isLiveTrading ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-white/5 text-text-muted'}`}>
              {isLiveTrading ? 'Live Trading' : 'Paper Mode'}
            </div>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1 font-medium">Total Net Worth</p>
            <p className="text-3xl font-display font-bold text-white">{symbol}{displayValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="market-card p-6 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-4">
            <DollarSign size={20} className="text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1 font-medium">Unallocated Liquidity</p>
            <p className="text-3xl font-display font-bold text-white">{symbol}{displayUnallocated.toLocaleString()}</p>
          </div>
        </div>

        <div className="market-card p-6 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-4">
            <Layers size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1 font-medium">Asset Allocation</p>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-display font-bold text-white">{(portfolioData.positions || []).length + 1}</p>
              <span className="text-xs text-text-sub">Unique assets across narratives</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Main Layout ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List/Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5 w-fit">
            {[
              { id: 'positions', label: 'Holdings', icon: Wallet },
              { id: 'allocation', label: 'Target Strategy', icon: BarChart3 },
              { id: 'history', label: 'History', icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent text-black shadow-lg shadow-accent/10'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'positions' ? (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <p className="section-label">Active Positions</p>
                <span className="text-xs text-text-muted font-data">{(portfolioData.positions || []).length} open</span>
              </div>
              
              {isLoading ? (
                <div className="py-20 text-center">
                  <div className="w-10 h-10 rounded-full border-2 border-accent/20 border-t-accent animate-spin mx-auto mb-4" />
                  <p className="text-sm text-text-sub">Fetching portfolio data...</p>
                </div>
              ) : (portfolioData.positions || []).length === 0 ? (
                <div className="py-20 text-center">
                  <TrendingUp size={32} className="mx-auto text-text-muted mb-4 opacity-20" />
                  <p className="text-sm text-text-sub font-medium">No active positions</p>
                  <p className="text-xs text-text-muted mt-1">Deploy a narrative to start trading.</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="pb-4 text-[10px] uppercase tracking-wider text-text-muted font-bold">Asset</th>
                        <th className="pb-4 text-[10px] uppercase tracking-wider text-text-muted font-bold text-right">Size</th>
                        <th className="pb-4 text-[10px] uppercase tracking-wider text-text-muted font-bold text-right">Avg Price</th>
                        <th className="pb-4 text-[10px] uppercase tracking-wider text-text-muted font-bold text-right">Current</th>
                        <th className="pb-4 text-[10px] uppercase tracking-wider text-text-muted font-bold text-right">PnL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {(portfolioData.positions || []).map((pos: any) => {
                        const pnl = pos.current_value - (pos.size * pos.entry_price);
                        const isProfit = pnl >= 0;
                        return (
                          <tr key={pos.asset} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 font-display font-bold text-white">{pos.asset}</td>
                            <td className="py-4 font-data text-[13px] text-text-sub text-right">{pos.size}</td>
                            <td className="py-4 font-data text-[13px] text-text-sub text-right">{symbol}{pos.entry_price?.toLocaleString()}</td>
                            <td className="py-4 font-data text-[13px] text-white text-right">{symbol}{pos.current_price?.toLocaleString()}</td>
                            <td className={`py-4 font-data text-[13px] text-right ${isProfit ? 'text-accent' : 'text-danger'}`}>
                              {isProfit ? '+' : ''}{symbol}{pnl.toLocaleString()}
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
          ) : (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <p className="section-label">Transaction History</p>
                <span className="text-xs text-text-muted font-data">{transactionLogs.length} transactions</span>
              </div>
              <div className="space-y-2">
                {transactionLogs.length === 0 ? (
                  <div className="text-center py-10">
                    <Clock size={28} className="mx-auto mb-3 text-text-muted" />
                    <p className="text-sm text-text-sub">No transactions yet</p>
                    <p className="text-xs text-text-muted mt-1">Use deposit or withdraw to manage capital.</p>
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

        {/* Right Column: Allocation Strategy */}
        <div className="space-y-6">
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
      </motion.div>

      {/* ── Modals ── */}
      {(showDeposit || showWithdraw) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowDeposit(false); setShowWithdraw(false); }} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-[#0a0a14] border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-display font-bold text-white mb-2">
              {showDeposit ? 'Deposit Funds' : 'Withdraw Funds'}
            </h2>
            <p className="text-sm text-text-sub mb-6">
              {showDeposit 
                ? 'Add capital to your master vault to be allocated by the orchestrator.'
                : 'Withdraw unallocated capital from your master vault to your connected wallet.'}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1.5 ml-1">Amount ({currency})</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-medium">{symbol}</div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-8 pr-4 text-white font-data focus:outline-none focus:border-accent/40 transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowDeposit(false); setShowWithdraw(false); }}
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={showDeposit ? handleDeposit : handleWithdraw}
                  disabled={deposit.isPending || withdraw.isPending}
                  className="flex-1 px-6 py-4 rounded-2xl bg-accent text-black font-bold hover:bg-accent-dim transition-all shadow-lg shadow-accent/10 disabled:opacity-50"
                >
                  {deposit.isPending || withdraw.isPending ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
