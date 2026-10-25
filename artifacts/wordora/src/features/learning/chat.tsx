import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/react';
import { useSendWordoraChat } from '@workspace/api-client-react';
import { Eraser, Loader2, RotateCcw, Send, ShieldAlert } from 'lucide-react';
import { languages, type LanguageId } from '../../data';

type Msg = { role: 'user' | 'assistant'; content: string };
const MAX = 1600;
const keyFor = (owner: string, lang: LanguageId) => `wordora-chat:${owner}:${lang}`;
const load = (k: string): Msg[] => { try { const v = JSON.parse(sessionStorage.getItem(k) || '[]'); return Array.isArray(v) ? v.filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string') : []; } catch { return []; } };
const store = (k: string, m: Msg[]) => { try { sessionStorage.setItem(k, JSON.stringify(m.slice(-40))); } catch { /* noop */ } };

export function GptIeon({ language }: { language: LanguageId }) {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) return <section className="ieon" aria-busy="true">جارٍ تجهيز المساعد…</section>;
  const owner = isSignedIn && user?.id ? `user:${user.id}` : 'guest';
  return <ChatSession key={keyFor(owner, language)} language={language} owner={owner} />;
}
function ChatSession({ language, owner }: { language: LanguageId; owner: string }) {
  const key = keyFor(owner, language);
  const info = languages.find(l => l.id === language)!;
  const send = useSendWordoraChat();
  const sendRef = useRef(send.mutateAsync); sendRef.current = send.mutateAsync;
  const [msgs, setMsgs] = useState<Msg[]>(() => load(key));
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const keyRef = useRef(key); keyRef.current = key;
  useEffect(() => { keyRef.current = key; return () => { keyRef.current = ''; }; }, [key]);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setMsgs(load(key)); setPending(false); setError(false); setInput(''); }, [key]);
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }); }, [msgs, pending]);
  const ask = async (history: Msg[]) => {
    const origin = key; setPending(true); setError(false);
    try {
      const res = await sendRef.current({ data: { language, messages: history.slice(-20).map(m => ({ role: m.role, content: m.content.slice(0, MAX) })) } });
      const next = [...history, { role: 'assistant' as const, content: String(res.reply ?? '') }];
      if (keyRef.current === origin) { store(origin, next); setMsgs(next); setPending(false); }
    } catch { if (keyRef.current === origin) { setError(true); setPending(false); } }
  };
  const submit = (text: string) => {
    const t = text.trim().slice(0, MAX); if (!t || pending) return;
    const next = [...msgs, { role: 'user' as const, content: t }]; setMsgs(next); store(key, next); setInput(''); ask(next);
  };
  const retry = () => { if (msgs.at(-1)?.role === 'user') ask(msgs); };
  const clear = () => { setMsgs([]); store(key, []); setError(false); };
  const chips = [`علّمني تحية بسيطة بال${info.arabicName.replace(/^ال/, '')}`, 'كيف أقدّم نفسي؟', 'صحّح جملتي: ', 'أعطني ثلاث كلمات للمطعم'];
  return <section className="ieon" aria-labelledby="ieon-title" data-testid="section-gpt-ieon">
    <header className="ieon-head">
      <div className="ieon-mark" aria-hidden="true">Ie</div>
      <div><h2 id="ieon-title" dir="ltr">GPT Ieon</h2><p>مساعدك التعليمي في {info.arabicName} — اسأل بالعربية.</p></div>
      <button type="button" className="btn btn-quiet btn-small" onClick={clear} disabled={!msgs.length || pending} data-testid="button-clear-chat"><Eraser size={15} /> مسح المحادثة</button>
    </header>
    <div className="ieon-list" ref={listRef} aria-live="polite" data-testid="list-chat-messages">
      {!msgs.length && !pending && <div className="ieon-empty"><b>ابدأ بسؤال صغير.</b><span>مثلاً: كيف أقول «شكراً» بطريقة مهذبة؟</span></div>}
      {msgs.map((m, i) => <div key={i} className={`bubble-msg ${m.role}`} dir="auto" data-testid={`text-chat-${m.role}-${i}`}>{m.content}</div>)}
      {pending && <div className="bubble-msg assistant typing" data-testid="status-chat-pending"><span /><span /><span /></div>}
      {error && <div className="ieon-error" role="alert" data-testid="status-chat-error">تعذّر الوصول إلى GPT Ieon الآن.<button type="button" className="btn btn-quiet btn-small" onClick={retry} data-testid="button-retry-chat"><RotateCcw size={14} /> أعد المحاولة</button></div>}
    </div>
    <div className="ieon-chips">{chips.map((c, i) => <button type="button" key={c} onClick={() => c.endsWith(': ') ? setInput(c) : submit(c)} disabled={pending} data-testid={`button-chat-chip-${i}`}>{c.trim()}</button>)}</div>
    <form className="ieon-form" onSubmit={e => { e.preventDefault(); submit(input); }}>
      <textarea value={input} maxLength={MAX} rows={2} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(input); } }} placeholder="اكتب سؤالك هنا…" aria-label="رسالتك إلى GPT Ieon" data-testid="input-chat" dir="auto" />
      <button type="submit" className="btn btn-primary" disabled={pending || !input.trim()} aria-label="إرسال" data-testid="button-send-chat">{pending ? <Loader2 size={18} className="spin" /> : <Send size={18} />}</button>
    </form>
    <div className="ieon-foot"><span><ShieldAlert size={14} /> يستخدم ذكاءً اصطناعياً عبر الإنترنت وقد يخطئ. لا تشارك معلومات خاصة.</span><span>{input.length}/{MAX} · المحادثة محفوظة لهذه الجلسة وهذا الحساب فقط.</span></div>
  </section>;
}
