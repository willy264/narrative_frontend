import { useState, useEffect } from 'react';
import { useBayseAccount, useBayseApiKeys, useCreateApiKey, useRotateApiKey } from '../hooks/useBayse';
import {
  Key, RefreshCw, Plus, Shield, ChevronRight,
  Copy, AlertCircle, Clock, Wallet, ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

type BayseBalance = {
  assets: Array<{ symbol: string; available: number; locked: number; total: number }>;
  fetched_at: string;
};

export default function Settings() {
  const { data: account, isLoading: accountLoading } = useBayseAccount();
  const { data: apiKeys, isLoading: keysLoading } = useBayseApiKeys();
  const createKey = useCreateApiKey();
  const rotateKey = useRotateApiKey();

  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeSection, setActiveSection] = useState<'broker' | 'api-keys' | 'balance'>('broker');
  const [balance, setBalance] = useState<BayseBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Fetch Bayse balance when balance tab is active
  useEffect(() => {
    if (activeSection === 'balance' && account && !balance && !balanceLoading) {
      setBalanceLoading(true);
      fetch('/api/bayse/accounts/me/balance')
        .then(res => res.json())
        .then(data => setBalance(data.data))
        .catch(() => {/* silently fail — balance is optional */})
        .finally(() => setBalanceLoading(false));
    }
  }, [activeSection, account, balance, balanceLoading]);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6 max-w-4xl pb-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">Settings</h2>
        <p className="text-text-sub text-sm mt-1">Broker integration, API key management, and wallet balance.</p>
      </div>

      {/* Tabs */}
      <div className="tabs w-fit">
        <button className={`tab ${activeSection === 'broker' ? 'tab-active' : ''}`} onClick={() => setActiveSection('broker')}>Broker</button>
        <button className={`tab ${activeSection === 'api-keys' ? 'tab-active' : ''}`} onClick={() => setActiveSection('api-keys')}>API Keys</button>
        <button className={`tab ${activeSection === 'balance' ? 'tab-active' : ''}`} onClick={() => setActiveSection('balance')}>
          <Wallet size={12} className="inline mr-1.5" />Balance
        </button>
      </div>

      {activeSection === 'broker' ? (
        /* ── Broker Integration ── */
        <div className="space-y-4">
          <div className="card overflow-hidden p-0">
            <div className="p-5 sm:p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Shield size={18} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Bayse Broker Integration</h3>
                  <p className="text-xs text-text-sub mt-0.5">Secure connection for automated trading execution via Secret Manager.</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {accountLoading ? (
                <div className="flex items-center gap-3 text-sm text-text-sub">
                  <div className="w-5 h-5 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
                  Loading account status...
                </div>
              ) : !account ? (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-warn/[0.06] border border-warn/20 flex items-start gap-3">
                    <AlertCircle size={16} className="text-warn shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white font-medium">Broker not connected</p>
                      <p className="text-xs text-text-sub mt-1">
                        Connect your Bayse account to enable the orchestrator to execute trades on your behalf.
                        Secret keys are stored securely in GCP Secret Manager — they never return to the client.
                      </p>
                    </div>
                  </div>
                  <a href="/onboarding" className="btn-solid inline-flex">
                    Connect Bayse Account <ChevronRight size={16} />
                  </a>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Connected Email', value: account.email },
                      { label: 'Account Status', value: 'Active', accent: true },
                      { label: 'Connected', value: account.connected_at ? formatDistanceToNow(new Date(account.connected_at), { addSuffix: true }) : '—' },
                    ].map((item) => (
                      <div key={item.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] font-data text-text-muted mb-1.5 uppercase tracking-wider">{item.label}</div>
                        <div className={`text-sm font-medium truncate flex items-center gap-2 ${item.accent ? 'text-accent' : 'text-white'}`}>
                          {item.accent && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {account.api_key && (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="text-[10px] font-data text-text-muted mb-3 uppercase tracking-wider">Primary API Key</div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Key size={14} className="text-accent shrink-0" />
                          <span className="font-data text-sm text-white truncate">{account.api_key.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="font-data text-xs text-text-sub bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5 truncate max-w-[200px]">
                            {account.api_key.public_key_preview}
                          </code>
                          <button
                            onClick={() => copyToClipboard(account.api_key!.public_key_preview)}
                            className="p-2 rounded-lg hover:bg-white/5 text-text-sub hover:text-white transition-colors shrink-0"
                            title="Copy preview"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-start gap-3">
                    <Shield size={14} className="text-text-muted shrink-0 mt-0.5" />
                    <p className="text-xs text-text-muted leading-relaxed">
                      Secret keys are stored in GCP Secret Manager and never return to the client.
                      The <code className="font-data text-text-sub">public_key_preview</code> shown above is already masked server-side.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeSection === 'api-keys' ? (
        /* ── API Keys ── */
        <div className="card overflow-hidden p-0">
          <div className="p-5 sm:p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Key size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">API Keys</h3>
                  <p className="text-xs text-text-sub mt-0.5">Keys used by the orchestrator to connect to Bayse for trade execution.</p>
                </div>
              </div>
              {!isCreating && account && (
                <button onClick={() => setIsCreating(true)} className="btn-outline text-sm">
                  <Plus size={14} /> New Key
                </button>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {!account ? (
              <div className="text-center py-10">
                <Shield size={28} className="mx-auto mb-3 text-text-muted" />
                <p className="text-sm text-text-sub">Connect your Bayse account first to manage API keys.</p>
                <a href="/onboarding" className="btn-outline text-xs mt-4 inline-flex">
                  Connect Account <ExternalLink size={12} />
                </a>
              </div>
            ) : (
              <>
                {isCreating && (
                  <form onSubmit={handleCreateKey} className="mb-6 flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g. Production Orchestrator"
                      className="input-field flex-1"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button type="submit" disabled={createKey.isPending || !newKeyName.trim()} className="btn-solid text-sm px-4 py-2.5">
                        {createKey.isPending ? 'Creating...' : 'Save'}
                      </button>
                      <button type="button" onClick={() => setIsCreating(false)} className="btn-ghost text-sm">Cancel</button>
                    </div>
                  </form>
                )}

                {keysLoading ? (
                  <div className="p-4 text-sm text-text-sub flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
                    Loading keys...
                  </div>
                ) : apiKeys?.length === 0 ? (
                  <div className="text-center py-10">
                    <Key size={28} className="mx-auto mb-2 text-text-muted" />
                    <p className="text-sm text-text-sub">No API keys found</p>
                    <p className="text-xs text-text-muted mt-1">Create one to enable trading operations.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {apiKeys?.map((key) => (
                      <div key={key.key_id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                            <Key size={14} className="text-accent" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-white font-medium truncate">{key.name}</p>
                            <p className="font-data text-xs text-text-muted truncate">{key.public_key_preview}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          {key.created_at && (
                            <span className="text-[10px] text-text-muted font-data flex items-center gap-1">
                              <Clock size={10} />
                              {formatDistanceToNow(new Date(key.created_at), { addSuffix: true })}
                            </span>
                          )}
                          <button
                            onClick={() => handleRotateKey(key.key_id)}
                            disabled={rotateKey.isPending}
                            className="p-2 rounded-lg hover:bg-white/5 text-text-sub hover:text-warn transition-colors"
                            title="Rotate Key"
                          >
                            <RefreshCw size={14} className={rotateKey.isPending ? 'animate-spin' : ''} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-start gap-3">
                  <AlertCircle size={14} className="text-text-muted shrink-0 mt-0.5" />
                  <p className="text-xs text-text-muted leading-relaxed">
                    Key operations are rate-limited to 20 requests per minute per owner.
                    If rate-limited, wait for the <code className="font-data text-text-sub">Retry-After</code> period before trying again.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* ── Balance Tab ── */
        <div className="card overflow-hidden p-0">
          <div className="p-5 sm:p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Wallet size={18} className="text-accent" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Bayse Wallet Balance</h3>
                <p className="text-xs text-text-sub mt-0.5">Real-time view of your connected Bayse account assets.</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {!account ? (
              <div className="text-center py-10">
                <Wallet size={28} className="mx-auto mb-3 text-text-muted" />
                <p className="text-sm text-text-sub">Connect your Bayse account to view your wallet balance.</p>
              </div>
            ) : balanceLoading ? (
              <div className="flex items-center justify-center gap-3 text-sm text-text-sub py-10">
                <div className="w-5 h-5 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
                Fetching balance from Bayse...
              </div>
            ) : balance ? (
              <div className="space-y-4">
                {balance.assets && balance.assets.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="data-table w-full">
                        <thead>
                          <tr>
                            <th>Asset</th>
                            <th className="text-right">Available</th>
                            <th className="text-right hidden sm:table-cell">Locked</th>
                            <th className="text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {balance.assets.map((asset) => (
                            <tr key={asset.symbol} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent">
                                    {asset.symbol.substring(0, 3)}
                                  </div>
                                  <span className="text-white font-medium text-sm">{asset.symbol}</span>
                                </div>
                              </td>
                              <td className="text-right font-data text-sm text-text-sub py-3.5">{asset.available.toLocaleString()}</td>
                              <td className="text-right hidden sm:table-cell font-data text-sm text-text-muted py-3.5">{asset.locked.toLocaleString()}</td>
                              <td className="text-right font-data text-sm text-white font-medium py-3.5">{asset.total.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {balance.fetched_at && (
                      <p className="text-[10px] text-text-muted font-data flex items-center gap-1">
                        <Clock size={10} /> Last fetched: {new Date(balance.fetched_at).toLocaleString()}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10">
                    <Wallet size={28} className="mx-auto mb-2 text-text-muted" />
                    <p className="text-sm text-text-sub">No assets in your Bayse wallet</p>
                    <p className="text-xs text-text-muted mt-1">Fund your account on the Bayse platform to get started.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <AlertCircle size={28} className="mx-auto mb-3 text-text-muted" />
                <p className="text-sm text-text-sub">Unable to fetch balance</p>
                <p className="text-xs text-text-muted mt-1">Your Bayse connection may need to be refreshed.</p>
                <button
                  onClick={() => { setBalance(null); setBalanceLoading(false); }}
                  className="btn-outline text-xs mt-4 inline-flex"
                >
                  <RefreshCw size={12} /> Retry
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
