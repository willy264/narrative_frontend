import { useState, useRef } from 'react';
import { useBayseAccount, useBayseApiKeys, useBayseBalance, useCreateApiKey, useRotateApiKey, useDeleteApiKey } from '../hooks/useBayse';
import {
  Key, RefreshCw, Plus, Shield, ChevronRight,
  Copy, AlertCircle, Clock, Wallet, ExternalLink, Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Settings() {
  const { data: account, isLoading: accountLoading } = useBayseAccount();
  const { data: apiKeys, isLoading: keysLoading } = useBayseApiKeys();
  const createKey = useCreateApiKey();
  const rotateKey = useRotateApiKey();
  const deleteKey = useDeleteApiKey();

  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeSection, setActiveSection] = useState<'broker' | 'api-keys' | 'balance'>('broker');

  const { data: balance, isLoading: balanceLoading, refetch: refetchBalance } = useBayseBalance(
    activeSection === 'balance' && !!account
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.settings-header', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
      .fromTo('.settings-tabs', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')
      .fromTo('.settings-content', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
  }, { scope: containerRef });

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    createKey.mutate(newKeyName, {
      onSuccess: () => {
        toast.success('API Key created successfully');
        setNewKeyName('');
        setIsCreating(false);
      },
      onError: (error: any) => {
        const retryAfter = error.response?.headers?.['retry-after'];
        if (retryAfter) {
          toast.error(`Rate limited. Try again in ${retryAfter} seconds.`);
        } else {
          toast.error(error.response?.data?.error?.message || 'Failed to create key');
        }
      }
    });
  };

  const handleRotateKey = (keyId: string) => {
    if (!window.confirm('Are you sure you want to rotate this key? The old key will immediately stop working.')) return;
    rotateKey.mutate(keyId, {
      onSuccess: () => toast.success('API Key rotated successfully'),
      onError: (error: any) => {
        const retryAfter = error.response?.headers?.['retry-after'];
        if (retryAfter) {
          toast.error(`Rate limited. Try again in ${retryAfter} seconds.`);
        } else {
          toast.error(error.response?.data?.error?.message || 'Failed to rotate key');
        }
      }
    });
  };

  const handleDeleteKey = (keyId: string) => {
    if (!window.confirm('Are you sure you want to delete this key? This action cannot be undone.')) return;
    deleteKey.mutate(keyId, {
      onSuccess: () => toast.success('API Key deleted'),
      onError: (error: any) => {
        const retryAfter = error.response?.headers?.['retry-after'];
        if (retryAfter) {
          toast.error(`Rate limited. Try again in ${retryAfter} seconds.`);
        } else {
          toast.error(error.response?.data?.error?.message || 'Failed to delete key');
        }
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col pb-8">
      {/* Header */}
      <div className="settings-header mb-8 w-full flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">Settings Configuration</h2>
          <p className="text-text-sub text-base mt-2 max-w-2xl">Manage your broker integrations, secure API keys, and monitor real-time wallet balances across networks.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full flex-1">
        {/* Sidebar Tabs */}
        <div className="settings-tabs lg:w-64 shrink-0 flex flex-col gap-2">
          {[
            { id: 'broker', label: 'Broker Integration', icon: Shield },
            { id: 'api-keys', label: 'API Keys', icon: Key },
            { id: 'balance', label: 'Wallet Balance', icon: Wallet }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 text-left font-medium text-sm
                ${activeSection === tab.id 
                  ? 'bg-accent/10 border border-accent/20 text-accent shadow-[0_0_20px_rgba(30,215,96,0.1)]' 
                  : 'bg-white/[0.02] border border-white/5 text-text-sub hover:bg-white/[0.05] hover:text-white'}`}
              onClick={() => {
                setActiveSection(tab.id as any);
                gsap.fromTo('.settings-content', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
              }}
            >
              <tab.icon size={18} className={activeSection === tab.id ? 'text-accent' : 'text-text-muted'} />
              {tab.label}
              {activeSection === tab.id && (
                <motion.div layoutId="activeTabIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="settings-content flex-1 min-h-[500px]">
          {activeSection === 'broker' ? (
            /* ── Broker Integration ── */
            <div className="card overflow-hidden p-0 h-full w-full border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-none!">
              <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-[0_0_15px_rgba(30,215,96,0.15)]">
                    <Shield size={24} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Bayse Broker Integration</h3>
                    <p className="text-sm text-text-sub mt-1">Secure connection for automated trading execution via Secret Manager.</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {accountLoading ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-4 text-sm text-text-sub">
                    <div className="w-8 h-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
                    Loading account status...
                  </div>
                ) : !account ? (
                  <div className="space-y-6 max-w-3xl">
                    <div className="p-5 rounded-2xl bg-warn/[0.06] border border-warn/20 flex items-start gap-4 backdrop-blur-sm">
                      <AlertCircle size={20} className="text-warn shrink-0 mt-0.5" />
                      <div>
                        <p className="text-base text-white font-semibold">Broker not connected</p>
                        <p className="text-sm text-text-sub mt-1.5 leading-relaxed">
                          Connect your Bayse account to enable the orchestrator to execute trades on your behalf.
                          Secret keys are stored securely in GCP Secret Manager — they never return to the client.
                        </p>
                      </div>
                    </div>
                    <a href="/onboarding" className="group relative inline-flex items-center justify-center gap-2 px-6! py-4! btn-join text-[#04120a] rounded-xl font-bold text-sm uppercase tracking-wide overflow-hidden transition-shadow">
                      <span className="relative z-10 flex items-center gap-2">
                        Connect Bayse Account <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </a>
                  </div>
                ) : (
                  <div className="space-y-8 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                      {[
                        { label: 'Connected Email', value: account.email },
                        { label: 'Account Status', value: 'Active', accent: true },
                        { label: 'Connected', value: account.connected_at ? formatDistanceToNow(new Date(account.connected_at), { addSuffix: true }) : '—' },
                      ].map((item, i) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={item.label} 
                          className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors"
                        >
                          <div className="text-[11px] font-bold text-text-muted mb-2 uppercase tracking-[0.2em]">{item.label}</div>
                          <div className={`text-base font-semibold truncate flex items-center gap-2 ${item.accent ? 'text-accent' : 'text-white'}`}>
                            {item.accent && <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(30,215,96,0.8)]" />}
                            {item.value}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {account.api_key && (
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 w-full">
                        <div className="text-[11px] font-bold text-text-muted mb-4 uppercase tracking-[0.2em]">Primary API Key</div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                              <Key size={18} className="text-accent" />
                            </div>
                            <span className="font-display font-medium text-base text-white truncate">{account.api_key.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <code className="font-data text-sm text-text-sub bg-white/[0.04] px-4 py-2.5 rounded-xl border border-white/10 truncate max-w-[250px] shadow-inner">
                              {account.api_key.public_key_preview}
                            </code>
                            <button
                              onClick={() => copyToClipboard(account.api_key!.public_key_preview)}
                              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all shrink-0"
                              title="Copy preview"
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex items-start gap-4">
                      <Shield size={18} className="text-text-muted shrink-0 mt-0.5" />
                      <p className="text-sm text-text-muted leading-relaxed">
                        Secret keys are stored in GCP Secret Manager and never return to the client.
                        The <code className="font-data text-white/50">public_key_preview</code> shown above is already masked server-side.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : activeSection === 'api-keys' ? (
            /* ── API Keys ── */
            <div className="card overflow-hidden p-0 h-full w-full border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-none!">
              <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                      <Key size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">API Keys Management</h3>
                      <p className="text-sm text-text-sub mt-1">Keys used by the orchestrator to connect to Bayse for trade execution.</p>
                    </div>
                  </div>
                  {!isCreating && account && (
                    <button onClick={() => setIsCreating(true)} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 transition-all flex items-center gap-2">
                      <Plus size={16} /> Generate Key
                    </button>
                  )}
                </div>
              </div>

              <div className="p-8">
                {!account ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                      <Shield size={24} className="text-text-muted" />
                    </div>
                    <p className="text-base font-medium text-white mb-2">Authentication Required</p>
                    <p className="text-sm text-text-sub max-w-md">Connect your Bayse account first to manage API keys.</p>
                    <a href="/onboarding" className="mt-6 px-6 py-2.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-colors inline-flex items-center gap-2">
                      Connect Account <ExternalLink size={14} />
                    </a>
                  </div>
                ) : (
                  <div className="w-full">
                    {isCreating && (
                      <motion.form 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleCreateKey} 
                        className="mb-8 flex flex-col md:flex-row gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 w-full"
                      >
                        <input
                          type="text"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          placeholder="e.g. Production Orchestrator"
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
                          autoFocus
                        />
                        <div className="flex gap-3">
                          <button type="submit" disabled={createKey.isPending || !newKeyName.trim()} className="px-6 py-3 rounded-xl bg-accent text-[#04120a] font-bold text-sm hover:shadow-[0_0_15px_rgba(30,215,96,0.3)] transition-all disabled:opacity-50">
                            {createKey.isPending ? 'Generating...' : 'Save Key'}
                          </button>
                          <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-all">Cancel</button>
                        </div>
                      </motion.form>
                    )}

                    {keysLoading ? (
                      <div className="flex items-center justify-center h-48 gap-4 text-sm text-text-sub">
                        <div className="w-8 h-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
                        Fetching keys...
                      </div>
                    ) : apiKeys?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                        <Key size={32} className="text-text-muted mb-4 opacity-50" />
                        <p className="text-base font-medium text-white mb-1">No API keys found</p>
                        <p className="text-sm text-text-muted">Create your first key to enable automated trading.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 w-full">
                        {apiKeys?.map((key, i) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={key.key_id} 
                            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all w-full"
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                <Key size={16} className="text-accent" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-base font-semibold text-white truncate mb-0.5">{key.name}</p>
                                <p className="font-data text-sm text-text-muted truncate">{key.public_key_preview}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap bg-white/[0.02] p-2 rounded-xl border border-white/5">
                              {key.created_at && (
                                <span className="text-[11px] text-text-muted font-data flex items-center gap-1.5 px-3">
                                  <Clock size={12} />
                                  {formatDistanceToNow(new Date(key.created_at), { addSuffix: true })}
                                </span>
                              )}
                              <div className="w-px h-6 bg-white/10 hidden sm:block mx-1"></div>
                              <button
                                onClick={() => handleRotateKey(key.key_id)}
                                disabled={rotateKey.isPending}
                                className="p-2.5 rounded-lg hover:bg-white/10 text-text-sub hover:text-white transition-all flex items-center gap-2 group"
                                title="Rotate Key"
                              >
                                <RefreshCw size={14} className={`group-hover:rotate-180 transition-transform duration-500 ${rotateKey.isPending ? 'animate-spin' : ''}`} />
                                <span className="text-xs font-medium hidden md:block">Rotate</span>
                              </button>
                              <button
                                onClick={() => handleDeleteKey(key.key_id)}
                                disabled={deleteKey.isPending}
                                className="p-2.5 rounded-lg hover:bg-danger/20 text-text-sub hover:text-danger transition-all flex items-center gap-2"
                                title="Delete Key"
                              >
                                <Trash2 size={14} />
                                <span className="text-xs font-medium hidden md:block">Revoke</span>
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    <div className="mt-8 p-5 rounded-2xl bg-warn/[0.05] border border-warn/10 flex items-start gap-4">
                      <AlertCircle size={18} className="text-warn/80 shrink-0 mt-0.5" />
                      <p className="text-sm text-text-sub leading-relaxed">
                        Key operations are rate-limited to 20 requests per minute per owner.
                        If rate-limited, wait for the <code className="font-data text-warn/80 bg-warn/10 px-1.5 py-0.5 rounded">Retry-After</code> period before trying again.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── Balance Tab ── */
            <div className="card overflow-hidden p-0 h-full w-full border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-none!">
              <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue/10 border border-blue/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                      <Wallet size={24} className="text-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Bayse Wallet Balance</h3>
                      <p className="text-sm text-text-sub mt-1">Real-time view of your connected Bayse account assets.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => refetchBalance()}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all group"
                  >
                    <RefreshCw size={16} className={balanceLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                  </button>
                </div>
              </div>

              <div className="p-8">
                {!account ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                      <Wallet size={24} className="text-text-muted" />
                    </div>
                    <p className="text-base font-medium text-white mb-2">Wallet Unavailable</p>
                    <p className="text-sm text-text-sub">Connect your Bayse account to view your wallet balance.</p>
                  </div>
                ) : balanceLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4 text-sm text-text-sub">
                    <div className="w-8 h-8 rounded-full border-2 border-blue/20 border-t-blue animate-spin" />
                    Syncing with blockchain...
                  </div>
                ) : balance ? (
                  <div className="space-y-6 w-full">
                    {balance.assets && balance.assets.length > 0 ? (
                      <>
                        <div className="w-full border border-white/10 rounded-2xl overflow-hidden bg-white/[0.01]">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="py-4 px-6 text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">Asset</th>
                                <th className="py-4 px-6 text-right text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">Available</th>
                                <th className="py-4 px-6 text-right hidden sm:table-cell text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">Locked</th>
                                <th className="py-4 px-6 text-right text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">Total Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {balance.assets.map((asset, idx) => (
                                <motion.tr 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  key={asset.symbol} 
                                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                                >
                                  <td className="py-4 px-6">
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-xs font-bold text-blue shadow-inner">
                                        {asset.symbol.substring(0, 3)}
                                      </div>
                                      <span className="text-white font-bold text-base">{asset.symbol}</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-6 text-right font-data text-sm text-text-sub">{asset.available.toLocaleString()}</td>
                                  <td className="py-4 px-6 text-right hidden sm:table-cell font-data text-sm text-text-muted">{asset.locked.toLocaleString()}</td>
                                  <td className="py-4 px-6 text-right font-data text-base text-white font-semibold">{asset.total.toLocaleString()}</td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {balance.fetched_at && (
                          <div className="flex justify-end">
                            <p className="text-[11px] text-text-muted font-data flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                              <Clock size={12} /> Last synced: {new Date(balance.fetched_at).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                        <Wallet size={32} className="text-text-muted mb-4 opacity-50" />
                        <p className="text-base font-medium text-white mb-1">No assets found</p>
                        <p className="text-sm text-text-muted max-w-sm">Fund your account on the Bayse platform to get started with trading.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-16 h-16 rounded-full bg-warn/10 flex items-center justify-center mb-4 border border-warn/20">
                      <AlertCircle size={24} className="text-warn" />
                    </div>
                    <p className="text-base font-medium text-white mb-2">Unable to fetch balance</p>
                    <p className="text-sm text-text-sub">Your Bayse connection may need to be refreshed.</p>
                    <button
                      onClick={() => refetchBalance()}
                      className="mt-6 px-6 py-2.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-colors inline-flex items-center gap-2"
                    >
                      <RefreshCw size={14} /> Retry Fetch
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

