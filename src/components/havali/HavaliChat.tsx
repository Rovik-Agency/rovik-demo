import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Loader2, Mic, Send, Sparkles, Wand2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { HavaliMessage } from '@/types';
import { Button, LinkButton } from '@/components/ui/Button';
import { askHavali } from './HavaliEngine';
import { HavaliMark } from './HavaliMark';

const welcome: HavaliMessage = {
  id: 'welcome', role: 'assistant', createdAt: new Date().toISOString(),
  content: 'Hi, I’m Havali AI — ROVIK’s hybrid assistant. Ask about services, pricing, projects or describe your idea and I’ll help shape it into a clean project brief.',
  suggestions: ['Build an e-commerce store', 'Show ROVIK work', 'What does AI & Automation include?']
};

function TypingDots() {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-soft bg-black/5 px-3 py-2 text-xs font-semibold text-muted dark:bg-white/10">
      <span className="sr-only">Havali is typing</span>
      <span className="h-2 w-2 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-electric" />
      <span className="h-2 w-2 animate-[pulse_1s_ease-in-out_.15s_infinite] rounded-full bg-violet" />
      <span className="h-2 w-2 animate-[pulse_1s_ease-in-out_.3s_infinite] rounded-full bg-cyan" />
      <span className="ml-1">Havali is thinking</span>
    </div>
  );
}

export function HavaliChat({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<HavaliMessage[]>([welcome]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const suggestionPool = useMemo(
    () => ['Build a SaaS platform', 'Price a web app for my business', 'Which ROVIK service fits my idea?', 'Can Havali create a project brief?'],
    []
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function submit(value = input) {
    const content = value.trim();
    if (!content || loading) return;
    const user: HavaliMessage = { id: crypto.randomUUID(), role: 'user', content, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, user]);
    setInput('');
    setLoading(true);
    try {
      const { message } = await askHavali(content, [...messages, user]);
      await new Promise((resolve) => window.setTimeout(resolve, 550));
      setMessages((prev) => [...prev, message]);
    } catch {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: 'I had trouble processing that. You can still use the Project Builder or contact form to reach ROVIK.', createdAt: new Date().toISOString(), suggestions: ['Open Project Builder', 'Contact ROVIK'] }]);
    } finally { setLoading(false); }
  }

  function onSubmit(e: FormEvent) { e.preventDefault(); void submit(); }

  return (
    <div className={clsx(
      'havali-chat-shell flex min-h-0 flex-col overflow-hidden border border-soft bg-card shadow-glass',
      compact ? 'h-full w-full rounded-[1.65rem] sm:rounded-[2rem]' : 'min-h-[720px] rounded-[2rem]'
    )}>
      <div className="havali-chat-top relative overflow-hidden border-b border-soft p-4 sm:p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_right,rgba(91,108,255,.18),transparent_40%),radial-gradient(circle_at_top_left,rgba(138,92,255,.14),transparent_40%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <HavaliMark className="h-10 w-10 sm:h-12 sm:w-12" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg font-black tracking-tight sm:text-xl">Havali AI</h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-electric/20 bg-electric/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-electric">Hybrid <Sparkles className="h-3.5 w-3.5" /></span>
              </div>
              <p className="mt-1 max-w-xl text-[11px] leading-5 text-muted sm:text-xs">
                Controlled ROVIK knowledge + workflows + semantic retrieval + provider abstraction.
              </p>
            </div>
          </div>
          <LinkButton to="/havali" variant="ghost" className={clsx("hidden shrink-0 rounded-full border border-soft px-4 py-2 text-xs sm:inline-flex", compact && "sm:hidden")}>
            Full experience <ArrowUpRight className="h-4 w-4" />
          </LinkButton>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-2">
          {(compact ? suggestionPool.slice(0, 3) : suggestionPool).map((item) => (
            <button
              key={item}
              type="button"
              className="focus-ring rounded-full border border-soft bg-white/80 px-3 py-1.5 text-[11px] font-bold text-current transition hover:-translate-y-0.5 hover:border-electric/30 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"
              onClick={() => submit(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div ref={viewportRef} className="havali-chat-scroll min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
        {messages.map((message) => (
          <div key={message.id} className={clsx('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={clsx('max-w-[92%] sm:max-w-[85%]', message.role === 'assistant' ? 'pr-4' : 'pl-6')}>
              {message.role === 'assistant' ? (
                <div className="mb-2 flex items-center gap-2 pl-1 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                  <HavaliMark className="h-6 w-6 rounded-xl" size={24} />
                  Havali
                </div>
              ) : null}
              <div className={clsx(
                'rounded-[1.6rem] px-4 py-3.5 text-sm leading-6 shadow-sm sm:px-5',
                message.role === 'user'
                  ? 'rounded-br-md bg-ink text-white dark:bg-white dark:text-ink'
                  : 'rounded-bl-md border border-soft bg-black/[0.03] text-current dark:bg-white/[0.04]'
              )}>
                <p className="m-0 whitespace-pre-line">{message.content}</p>
                {message.suggestions?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {message.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="focus-ring rounded-full border border-soft bg-white px-3 py-1.5 text-[11px] font-bold transition hover:-translate-y-0.5 hover:border-electric/30 hover:text-electric dark:bg-white/[0.05]"
                        onClick={() => submit(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
        {loading ? (
          <div className="flex justify-start pr-4">
            <div className="max-w-[92%] sm:max-w-[85%]">
              <div className="mb-2 flex items-center gap-2 pl-1 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                <HavaliMark className="h-6 w-6 rounded-xl" size={24} />
                Havali
              </div>
              <TypingDots />
            </div>
          </div>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-soft bg-black/[0.02] p-3 dark:bg-white/[0.02] sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-3 px-1">
          <p className="text-[11px] leading-5 text-muted">Havali can qualify your idea and send it into ROVIK’s lead pipeline.</p>
          <div className="hidden items-center gap-2 sm:flex">
            <LinkButton to="/project-builder" variant="ghost" className="rounded-full border border-soft px-3 py-2 text-xs">Build project</LinkButton>
          </div>
        </div>
        <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
          <div className="flex items-end gap-2 rounded-[1.6rem] border border-soft bg-card p-2 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/5 text-muted dark:bg-white/5">
              <Wand2 className="h-5 w-5" />
            </div>
            <label className="sr-only" htmlFor={compact ? 'havali-compact-input' : 'havali-input'}>Message Havali</label>
            <textarea
              id={compact ? 'havali-compact-input' : 'havali-input'}
              rows={1}
              className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your project, services, pricing or next steps…"
              aria-label="Message Havali"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void submit();
                }
              }}
            />
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" className="focus-ring hidden h-11 w-11 items-center justify-center rounded-2xl border border-soft text-muted transition hover:border-electric/30 hover:text-electric sm:inline-flex" aria-label="Voice coming soon">
                <Mic className="h-4 w-4" />
              </button>
              <Button type="submit" variant="dark" disabled={loading || !input.trim()} className="h-11 rounded-2xl px-4 sm:px-5">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} <span className="hidden sm:inline">Send</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 px-1 text-[11px] text-muted">
            <span>Shift + Enter for a new line.</span>
            <span>Powered by a hybrid architecture.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
