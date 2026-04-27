import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useCompilerThreads, useCreateCompilerThread, useSendMessage, useApproveThread, useCompilerThread } from '../hooks/useCompiler';
import {
  Send, CheckCircle2, Bot, Sparkles,
  AlertCircle, Lightbulb, Zap, Target, TrendingUp,
  Paperclip, Smile, MoreVertical, Search, ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const SUGGESTED_PROMPTS = [
  {
    icon: TrendingUp,
    title: 'BTC Momentum Play',
    prompt: 'Build a momentum-based narrative for Bitcoin. Enter long when RSI crosses above 50 on the daily with MACD confirmation. Risk 2% per trade with a 1.5:1 reward-to-risk ratio.',
  },
  {
    icon: Target,
    title: 'Mean Reversion Strategy',
    prompt: 'I want a mean reversion strategy on ETH/USD. Buy the dip when price is 2 standard deviations below the 20-day moving average. Take profit at the mean. Stop at 3 standard deviations.',
  },
  {
    icon: Zap,
    title: 'Macro Event Trader',
    prompt: 'Create a macro event-driven narrative. Monitor CPI, NFP, and FOMC releases. Go risk-on in crypto 48 hours before bullish events and hedge with stablecoin rotation during bearish prints.',
  },
  {
    icon: Lightbulb,
    title: 'DeFi Yield Optimizer',
    prompt: 'Build an AI agent that monitors the top 10 DeFi protocols for yield opportunities above 8% APY. Automatically rotate capital between protocols based on TVL and smart contract risk scores.',
  },
];

export default function Messages() {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Real data: fetch all compiler threads for the sidebar ──
  const { data: allThreads } = useCompilerThreads();
  const { data: thread, isLoading: threadLoading } = useCompilerThread(threadId || undefined);
  const createThread = useCreateCompilerThread();
  const sendMessage = useSendMessage();
  const approveThread = useApproveThread();

  useEffect(() => {
    if (!threadId && !createThread.isPending && !createThread.isError) {
      createThread.mutate(undefined, {
        onSuccess: (data) => setThreadId(data.thread_id),
        onError: () => toast.error('Failed to initialize compiler session', { id: 'init-session-error' })
      });
    }
  }, [threadId, createThread.isPending, createThread.isError, createThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !threadId) return;
    sendMessage.mutate({ threadId, content: input }, {
      onError: () => toast.error('Failed to send message', { id: 'send-message-error' }),
    });
    setInput('');
  };

  const handlePromptClick = (prompt: string) => {
    if (!threadId) return;
    sendMessage.mutate({ threadId, content: prompt }, {
      onError: () => toast.error('Failed to send message', { id: 'send-message-error' }),
    });
  };

  const handleApprove = () => {
    if (!threadId) return;
    approveThread.mutate(threadId, {
      onSuccess: () => toast.success('Narrative thesis compiled successfully!'),
      onError: () => toast.error('Failed to approve thesis', { id: 'approve-thesis-error' }),
    });
  };

  const handleSelectThread = (id: string) => {
    setThreadId(id);
  };

  const handleNewThread = () => {
    createThread.mutate(undefined, {
      onSuccess: (data) => setThreadId(data.thread_id),
      onError: () => toast.error('Failed to create new session'),
    });
  };

  const isAwaitingApproval = thread?.status === 'AWAITING_APPROVAL';
  const isCompiled = thread?.status === 'COMPILED';
  const isRuntimeDisabled = thread?.runtime_mode === 'disabled';
  const isPending = sendMessage.isPending || approveThread.isPending;
  const hasMessages = thread?.messages && thread.messages.filter(m => m.role !== 'system').length > 0;

  return (
    <div className="flex h-full w-full bg-[#07070f]">
      {/* Sidebar - Chat List (real threads) */}
      <div className="w-[320px] hidden md:flex flex-col border-r border-white/[0.04] bg-[#0a0a14]/60">
        <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Messages</h2>
          <button onClick={handleNewThread} className="text-text-muted hover:text-accent transition-colors" title="New thread">
            <MoreVertical size={18} />
          </button>
        </div>
        <div className="p-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-text-muted outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
          {(allThreads ?? []).map((t) => {
            const isActive = t.thread_id === threadId;
            const lastMsg = t.messages?.filter(m => m.role !== 'system').slice(-1)[0];
            return (
              <div
                key={t.thread_id}
                onClick={() => handleSelectThread(t.thread_id)}
                className={`p-3 rounded-xl cursor-pointer flex items-start gap-3 transition-colors ${
                  isActive ? 'bg-white/[0.04] border border-white/[0.05]' : 'hover:bg-white/[0.02] border border-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-accent/10 border border-accent/20' : 'bg-white/5 border border-white/10'
                  }`}>
                    <Bot size={20} className={isActive ? 'text-accent' : 'text-text-muted'} />
                  </div>
                  {t.status !== 'COMPILED' && t.status !== 'ARCHIVED' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-[#0a0a14]"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-white truncate">
                      {t.status === 'COMPILED' ? 'Compiled' : t.status === 'AWAITING_APPROVAL' ? 'Pending' : 'Active'}
                    </span>
                    <span className="text-[10px] text-text-muted whitespace-nowrap">
                      {formatDistanceToNow(new Date(t.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted truncate">
                    {lastMsg?.content ?? 'Empty thread'}
                  </p>
                </div>
              </div>
            );
          })}
          {(!allThreads || allThreads.length === 0) && (
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-start gap-3">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Bot size={20} className="text-accent" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-[#0a0a14]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-white truncate">Narrative Compiler</span>
                  <span className="text-[10px] text-text-muted whitespace-nowrap">Just now</span>
                </div>
                <p className="text-xs text-text-muted truncate">Ready to compile strategy...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#07070f] relative">
        {/* Chat Header */}
        <div className="h-[72px] shrink-0 border-b border-white/[0.04] bg-[#0a0a14]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/[0.05] text-text-muted hover:text-white transition-colors -ml-2 shrink-0">
              <ChevronLeft size={20} />
            </button>
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Bot size={18} className="text-accent" />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent rounded-full border-2 border-[#0a0a14] md:hidden"></div>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                Narrative Compiler
                {isRuntimeDisabled && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-warn/10 text-warn border border-warn/20 uppercase tracking-wider font-data flex items-center gap-1">
                    <AlertCircle size={10} /> Unavailable
                  </span>
                )}
              </h2>
              <p className="text-xs text-accent mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {thread?.status === 'COMPILED' ? 'Strategy Compiled' : thread?.status === 'AWAITING_APPROVAL' ? 'Awaiting Approval' : 'Online'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {threadId && (
              <span className="text-[11px] font-data text-text-muted bg-white/[0.03] px-2 py-1 rounded border border-white/5 hidden sm:inline-block">
                {threadId}
              </span>
            )}
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/[0.05] text-text-muted hover:text-white transition-colors">
              <Search size={16} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/[0.05] text-text-muted hover:text-white transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.01) 0%, transparent 100%)' }}>
          {hasMessages && (
            <div className="flex justify-center mb-6">
              <span className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-[11px] font-medium text-text-muted">Today</span>
            </div>
          )}
          
          {hasMessages ? (
            thread?.messages.filter(m => m.role !== 'system').map((msg) => (
              <div key={msg.message_id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] sm:max-w-[70%] rounded-2xl p-3.5 sm:p-5 shadow-sm relative ${
                  msg.role === 'user'
                    ? 'bg-accent text-black rounded-br-[4px]'
                    : 'bg-white/[0.06] border border-white/5 text-white rounded-bl-[4px] backdrop-blur-md'
                }`}>
                  <div className="whitespace-pre-wrap text-[14px] sm:text-[15px] leading-relaxed">{msg.content}</div>
                  <div className={`flex items-center gap-1.5 mt-1.5 justify-end ${msg.role === 'user' ? 'text-black/60' : 'text-text-muted'}`}>
                    <span className="text-[10px] font-data">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.role === 'user' && <CheckCircle2 size={12} />}
                  </div>
                </div>
              </div>
            ))
          ) : !isPending && !threadLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto py-10 my-20">
              <div className="flex items-center justify-center mb-6 ">
                <Bot size={32} className="text-accent" />
              </div>
              <h3 className="text-2xl font-display font-semibold text-white mb-3">Narrative AI Assistant</h3>
              <p className="text-sm text-text-sub max-w-md mb-10 leading-relaxed">
                Describe your trading thesis in natural language, and I will compile it into structured logic for the orchestrator. Pick a template to start.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
                {SUGGESTED_PROMPTS.map((sp) => (
                  <button
                    key={sp.title}
                    onClick={() => handlePromptClick(sp.prompt)}
                    disabled={isPending || !threadId}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-accent/30 transition-all group disabled:opacity-50 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors" />
                    <div className="relative">
                      <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center mb-3">
                        <sp.icon size={16} className="text-accent" />
                      </div>
                      <span className="block text-sm font-bold text-white mb-2">{sp.title}</span>
                      <p className="text-xs text-text-muted leading-relaxed line-clamp-3">{sp.prompt}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {isPending && (
            <div className="flex justify-start">
              <div className="bg-white/[0.04] border border-white/5 rounded-2xl rounded-bl-none p-5 flex items-center gap-4 max-w-[70%]">
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="text-accent animate-spin-slow" />
                </div>
                <div>
                  <span className="text-[13px] text-white animate-pulse">Typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Approval State Strip */}
        {isAwaitingApproval && (
          <div className="px-4 sm:px-6 py-3 bg-warn/10 border-t border-warn/20 flex items-center justify-between gap-4 shrink-0 backdrop-blur-md">
            <div className="flex items-center gap-3 text-warn">
              <AlertCircle size={18} />
              <span className="text-sm font-semibold">Review and approve thesis to compile</span>
            </div>
            <button onClick={handleApprove} disabled={approveThread.isPending} className="btn-solid whitespace-nowrap bg-warn text-black hover:bg-warn/90 font-bold px-4 py-2 text-xs">
              {approveThread.isPending ? 'Compiling...' : 'Approve & Deploy'}
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 sm:p-6 bg-[#0a0a14]/90 backdrop-blur-lg border-t border-white/[0.04] shrink-0">
          {isCompiled ? (
            <div className="py-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold border border-accent/20">
                <CheckCircle2 size={16} /> Narrative Compiled and Deployed
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-end gap-1 sm:gap-2 bg-white/[0.03] border border-white/10 rounded-2xl p-1.5 sm:p-2 focus-within:border-accent/40 focus-within:bg-white/[0.05] transition-all">
              <button type="button" className="p-2 sm:p-3 text-text-muted hover:text-white transition-colors shrink-0 rounded-xl hover:bg-white/5 hidden sm:block">
                <Paperclip size={20} />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !isPending && !threadLoading && threadId) {
                      handleSubmit(e as any);
                    }
                  }
                }}
                placeholder="Message Narrative Compiler..."
                className="flex-1 bg-transparent border-none py-2.5 sm:py-3 px-3 text-[14px] sm:text-[15px] text-white placeholder:text-text-muted focus:outline-none resize-none max-h-32 min-h-[40px] sm:min-h-[44px]"
                rows={1}
                disabled={isPending || threadLoading || !threadId}
                style={{ overflowY: 'auto' }}
              />
              <button type="button" className="p-2 sm:p-3 text-text-muted hover:text-white transition-colors shrink-0 rounded-xl hover:bg-white/5">
                <Smile size={20} />
              </button>
              <button 
                type="submit" 
                disabled={isPending || threadLoading || !threadId || !input.trim()} 
                className="p-2.5 sm:p-3 rounded-xl bg-accent text-black hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 m-0.5"
              >
                <Send size={18} className="translate-x-[1px]" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
