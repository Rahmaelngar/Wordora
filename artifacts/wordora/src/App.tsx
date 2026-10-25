import { type ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, SignIn, SignUp, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { arSA } from '@clerk/localizations';
import { BookOpen, Bookmark, Check, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, Globe2, Headphones, LockKeyhole, LogOut, Menu, MessageCircle, RotateCcw, Settings, Sparkles, Trash2, Trophy, Volume2, X } from 'lucide-react';
import { Route, Switch, Link, Redirect, Router as WouterRouter, useLocation } from 'wouter';
import { getGetWordoraProgressQueryKey, useGetWordoraProgress, useSaveWordoraProgress } from '@workspace/api-client-react';
import type { WordoraProgress } from '@workspace/api-client-react';
import { languages, lessons, lessonById, type LanguageId, type Level, type Lesson, type Word } from './data';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
type ProgressData = WordoraProgress;
const emptyProgress = (): ProgressData => ({ selectedLanguage: null, completedLessons: [], savedWords: [], points: 0, streak: 0, lastActiveDate: null, quizAttempts: {} });
const localKey = 'wordora-progress-v1';
const progressStorageKey = (userId?: string | null) => userId ? `${localKey}:user:${userId}` : localKey;
const soundEnabled = () => { try { return readPreferences().sound; } catch { return true; } };
const readLocal = (key = localKey): ProgressData => {
  try { const raw = localStorage.getItem(key); return raw ? { ...emptyProgress(), ...JSON.parse(raw) } : emptyProgress(); } catch { return emptyProgress(); }
};
type AppContextType = { progress: ProgressData; updateProgress: (fn: (old: ProgressData) => ProgressData) => void; localOnly: boolean; cloudError: boolean };
const AppContext = createContext<AppContextType | null>(null);
const useApp = () => {
  const value = useContext(AppContext);
  if (!value) throw new Error('Wordora context is missing');
  return value;
};
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const today = () => dateKey(new Date());
const touch = (p: ProgressData): ProgressData => {
  const date = today();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate()-1);
  const yesterday = dateKey(yesterdayDate);
  return { ...p, streak: p.lastActiveDate === date ? p.streak : p.lastActiveDate === yesterday ? Math.max(1, p.streak + 1) : 1, lastActiveDate: date };
};
const appAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: { logoPlacement: 'inside' as const, logoLinkUrl: basePath || '/', logoImageUrl: `${window.location.origin}${basePath}/logo.svg` },
  variables: { colorPrimary: '#704cce', colorForeground: '#36256e', colorMutedForeground: '#817b8e', colorDanger: '#c65c54', colorBackground: '#fffdfa', colorInput: '#fffdfa', colorInputForeground: '#36256e', colorNeutral: '#e7e1ef', fontFamily: 'DM Sans, Noto Sans Arabic, sans-serif', borderRadius: '14px' },
  elements: {
    rootBox: 'w-full flex justify-center', cardBox: 'bg-[#fffdfa] rounded-2xl w-[440px] max-w-full overflow-hidden shadow-xl',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none', footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#36256e] font-bold', headerSubtitle: 'text-[#817b8e]', socialButtonsBlockButtonText: 'text-[#44386d] font-semibold',
    formFieldLabel: 'text-[#554777] font-semibold', footerActionLink: 'text-[#704cce] font-semibold', footerActionText: 'text-[#817b8e]',
    dividerText: 'text-[#817b8e]', identityPreviewEditButton: 'text-[#704cce]', formFieldSuccessText: 'text-[#287255]', alertText: 'text-[#8b4945]',
    logoBox: 'rounded-xl', logoImage: 'object-contain', socialButtonsBlockButton: 'border-[#e7e1ef] rounded-xl', formButtonPrimary: 'bg-[#704cce] hover:bg-[#5d39ba] rounded-xl',
    formFieldInput: 'bg-[#fffdfa] border-[#e7e1ef] rounded-xl text-[#36256e]', footerAction: 'border-t border-[#eeeaf2]', dividerLine: 'bg-[#e7e1ef]',
    alert: 'rounded-xl', otpCodeFieldInput: 'rounded-lg border-[#ded6eb]', formFieldRow: 'text-[#554777]', main: 'text-[#36256e]',
  },
};
function stripBase(path: string) { return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path; }

function WordoraRoot() {
  const { isSignedIn, user } = useUser();
  const query = useGetWordoraProgress({ query: { enabled: !!isSignedIn, queryKey: getGetWordoraProgressQueryKey() } });
  const save = useSaveWordoraProgress();
  const [progress, setProgress] = useState<ProgressData>(readLocal);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const mergedFor = useRef<string | null>(null);
  const activeUserId = isSignedIn ? user?.id ?? null : null;
  const previousUserId = useRef<string | null>(null);
  useEffect(() => {
    if (previousUserId.current !== null && previousUserId.current !== activeUserId) {
      const guestProgress = readLocal(progressStorageKey(activeUserId));
      progressRef.current = guestProgress;
      setProgress(guestProgress);
    }
    previousUserId.current = activeUserId;
  }, [activeUserId]);
  useEffect(() => {
    if (!isSignedIn || !user?.id || !query.data || mergedFor.current === user.id) return;
    mergedFor.current = user.id;
    const local = readLocal();
    const userLocal = readLocal(progressStorageKey(user.id));
    const cloud = query.data as ProgressData;
    const merged: ProgressData = {
      ...cloud,
      selectedLanguage: cloud.selectedLanguage ?? userLocal.selectedLanguage ?? local.selectedLanguage,
      completedLessons: [...new Set([...cloud.completedLessons, ...userLocal.completedLessons, ...local.completedLessons])],
      savedWords: [...new Set([...cloud.savedWords, ...userLocal.savedWords, ...local.savedWords])],
      points: Math.max(cloud.points, userLocal.points, local.points), streak: Math.max(cloud.streak, userLocal.streak, local.streak),
      lastActiveDate: cloud.lastActiveDate ?? userLocal.lastActiveDate ?? local.lastActiveDate,
      quizAttempts: { ...local.quizAttempts, ...userLocal.quizAttempts, ...cloud.quizAttempts },
    };
    progressRef.current = merged;
    setProgress(merged);
    localStorage.setItem(progressStorageKey(user.id), JSON.stringify(merged));
    if (JSON.stringify(merged) !== JSON.stringify(cloud)) save.mutate({ data: merged });
  }, [isSignedIn, user?.id, query.data, save]);
  useEffect(() => {
    if (!isSignedIn) mergedFor.current = null;
  }, [isSignedIn]);
  const updateProgress = (fn: (old: ProgressData) => ProgressData) => {
    const next = fn(progressRef.current);
    progressRef.current = next;
    setProgress(next);
    localStorage.setItem(progressStorageKey(activeUserId), JSON.stringify(next));
    if (isSignedIn) save.mutate({ data: next });
  };
  return <AppContext.Provider value={{ progress, updateProgress, localOnly: !isSignedIn, cloudError: !!query.error || save.isError }}>
    <Switch>
      <Route path="/" component={HomeRoute} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route><Shell><ProtectedPage><Switch>
        <Route path="/learn" component={LearnPage} />
        <Route path="/lesson/:lessonId" component={LessonPage} />
        <Route path="/progress" component={ProgressPage} />
        <Route path="/saved" component={SavedPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route component={NotFound} />
      </Switch></ProtectedPage></Shell></Route>
    </Switch>
  </AppContext.Provider>;
}
function HomeRoute() {
  const { isSignedIn } = useUser();
  if (isSignedIn) return <Redirect to="/learn" />;
  return <Shell><Landing /></Shell>;
}
function ProtectedPage({ children }: { children: ReactNode }) {
  const { isLoaded } = useUser();
  if (!isLoaded) return <div className="page-wrap app-main"><div className="panel" style={{height:120,background:'#f1eef7'}} /></div>;
  return <>{children}</>;
}
function SignInPage() {
  return <div className="auth-page"><div className="auth-frame"><Brand /><SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} /></div></div>;
}
function SignUpPage() {
  return <div className="auth-page"><div className="auth-frame"><Brand /><SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} /></div></div>;
}
function Brand() { return <Link href="/" className="brand" data-testid="link-wordora-logo"><img src="/wordora-logo.png" alt="Wordora" /><span>Wordora</span></Link>; }
const navItems = [
  { href: '/learn', label: 'التعلّم', icon: BookOpen }, { href: '/progress', label: 'إنجازي', icon: Trophy },
  { href: '/saved', label: 'كلماتي', icon: Bookmark }, { href: '/profile', label: 'حسابي', icon: Settings },
];
function Shell({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);
  const { localOnly } = useApp();
  const signOutUser = () => signOut({ redirectUrl: basePath || '/' });
  return <div className="app-shell" dir="rtl">
    <header className="topbar"><div className="topbar-inner">
      <Brand />
      <nav className="nav-links" aria-label="التنقل الرئيسي">
        {navItems.map(({ href, label }) => <Link key={href} href={href} className={`nav-link ${path === href ? 'active' : ''}`} data-testid={`link-nav-${href.slice(1)}`}>{label}</Link>)}
        <Link href="/about" className={`nav-link ${path === '/about' ? 'active' : ''}`} data-testid="link-nav-about">عن Wordora</Link>
      </nav>
      <div className="mobile-menu">
        <button className="btn btn-quiet btn-small" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'} data-testid="button-mobile-menu">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        {isSignedIn ? <button className="btn btn-outline btn-small" onClick={signOutUser} data-testid="button-sign-out-mobile"><LogOut size={16} /> خروج</button> : <Link className="btn btn-primary btn-small" href="/sign-in" data-testid="link-sign-in-mobile">دخول</Link>}
      </div>
      <div className="nav-links" style={{ gap: 10 }}>
        {isSignedIn ? <><span style={{ color:'#7b7488',fontSize:'.88rem' }}>{user?.firstName || 'متعلّم'}</span><button className="btn btn-outline btn-small" onClick={signOutUser} data-testid="button-sign-out"><LogOut size={16} /> تسجيل الخروج</button></> : <><Link className="btn btn-quiet btn-small" href="/sign-in" data-testid="link-sign-in">دخول</Link><Link className="btn btn-primary btn-small" href="/sign-up" data-testid="link-sign-up">ابدأ مجاناً</Link></>}
      </div>
    </div>
    {menuOpen && <div style={{ position:'absolute',top:'65px',right:12,left:12,padding:12,background:'white',border:'1px solid #ece8f1',borderRadius:18,boxShadow:'0 12px 30px #32205517',display:'grid',gap:5 }}>
      {[...navItems,{href:'/about',label:'عن Wordora',icon:CircleHelp},{href:'/contact',label:'تواصل معنا',icon:MessageCircle},{href:'/settings',label:'الإعدادات',icon:Settings}].map(({href,label,icon:Icon}) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="nav-link" style={{padding:'11px 12px',borderRadius:11,background:path===href?'#f3effb':'transparent'}} data-testid={`link-menu-${href.slice(1)}`}><Icon size={17} style={{verticalAlign:'middle',marginLeft:9}} />{label}</Link>)}
    </div>}
    </header>
    <div>{children}</div>
    <footer className="footer"><div className="page-wrap" style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',alignItems:'center'}}><span>Wordora — الكلمات تفتح عوالم جديدة</span><span>{localOnly ? 'ملف محلي على هذا الجهاز' : `مرحباً ${user?.firstName || 'بك'}`}</span><div style={{display:'flex',gap:18}}><Link className="nav-link" href="/settings" data-testid="link-footer-settings">الإعدادات</Link><Link className="nav-link" href="/contact" data-testid="link-footer-contact">تواصل معنا</Link></div></div></footer>
    <nav className="bottom-nav">{navItems.slice(0,3).map(({href,label,icon:Icon})=><Link key={href} href={href} className={`bottom-nav-item ${path===href?'active':''}`} data-testid={`link-mobile-nav-${href.slice(1)}`}><Icon size={19}/><span>{label}</span></Link>)}</nav>
  </div>;
}
function Landing() {
  const [, setLocation] = useLocation();
  const { updateProgress } = useApp();
  return <div dir="rtl">
    <section className="hero page-wrap"><div className="hero-grid">
      <div><div className="hero-kicker">خطوة صغيرة، عالم أوسع</div><h1 dir="ltr" style={{textAlign:'left'}}>Learn a New Language.<br/><span>Open a New World.</span></h1>
        <p className="hero-copy">ابدأ من كلمة واحدة. دروس قصيرة، نطق واضح، وعبارات حقيقية تساعدك تتحدث بثقة — على راحتك، وبخطوتك.</p>
        <div className="hero-actions"><Link href="/learn" className="btn btn-primary" data-testid="link-start-learning">ابدأ التعلّم <ChevronLeft size={18}/></Link><Link href="/sign-up" className="btn btn-outline" data-testid="link-create-account">أنشئ حساباً مجانياً</Link></div>
        <div style={{marginTop:20,color:'#898395',fontSize:'.88rem'}}>ملف تعلّم محلي جاهز لك حتى قبل إنشاء حساب</div>
      </div>
      <div className="hero-art" aria-label="كلمات ترحّب بك بلغات مختلفة"><div className="art-orbit"><div className="art-core"><img src="/wordora-logo.png" alt="" /></div></div><div className="bubble one" dir="ltr">Hello</div><div className="bubble two" dir="ltr">Bonjour</div><div className="bubble three" dir="ltr">Hola</div><div className="bubble four" dir="ltr">Hallo</div></div>
    </div></section>
    <section className="section page-wrap"><div className="section-heading"><div><h2>أيّ لغة تفتح لك الباب؟</h2><p>اختر لغة وابدأ بأول درس للمبتدئين.</p></div><span className="badge">٥ لغات متاحة</span></div>
      <div className="language-grid">{languages.map(language=><button key={language.id} className="language-card" onClick={()=>{ localStorage.setItem('wordora-language-hint',language.id); updateProgress(old=>({...old,selectedLanguage:language.id})); setLocation('/learn'); }} data-testid={`button-choose-language-${language.id}`}><span className="language-flag" style={{fontFamily:'DM Sans',fontWeight:800,fontSize:'.9rem',background:'#f0ebfb',color:'#704cce',width:39,height:39,borderRadius:13,display:'grid',placeItems:'center'}}>{language.flag}</span><b dir="ltr">{language.name}</b><span>{language.arabicName}</span></button>)}</div>
    </section>
    <section className="section page-wrap"><div className="section-heading"><div><h2>تعلّم يناسب يومك</h2><p>بدون ضغط. كل تقدّم صغير يستحق الاحتفال.</p></div></div><div className="feature-grid"><article className="feature-panel"><Sparkles size={25}/><h3>عبارات تستخدمها فعلاً</h3><p>تدرّب على التحية، الطلب، التنقّل، ومواقف الحياة اليومية — مع المعنى والنطق.</p><div className="feature-number">01</div></article><article className="feature-panel alt"><Headphones size={25}/><h3>اسمعها، ثم قلها</h3><p>استمع إلى الكلمات والأمثلة بصوت جهازك، وكرّرها حتى تصبح مألوفة.</p><div className="feature-number">02</div></article></div></section>
    <section className="section page-wrap steps-section"><div className="section-heading"><div><h2>كيف تبدأ رحلتك؟</h2><p>ثلاث خطوات بسيطة، وكل خطوة محسوبة من إنجازك الحقيقي.</p></div></div><div className="steps-grid"><article className="step-card"><span>01</span><h3>اختر لغتك</h3><p>ابدأ بالإنجليزية أو الفرنسية أو الإسبانية أو الألمانية أو الإيطالية.</p></article><article className="step-card"><span>02</span><h3>تعلّم كلمات الدرس</h3><p>اقرأ المعنى والمثال، واستمع إلى النطق ثم احفظ ما تريد مراجعته.</p></article><article className="step-card"><span>03</span><h3>اختبر نفسك</h3><p>أجب عن أسئلة قصيرة لتحصل على نقاط وتتابع تقدمك خطوة بخطوة.</p></article></div></section>
    <section className="section page-wrap" style={{paddingTop:8}}><div className="welcome-banner"><div><div className="hero-kicker">رحلتك تبدأ هنا</div><h1>كلمة اليوم قد تغيّر غداً.</h1><p>ابدأ درساً قصيراً، واحفظ الكلمات التي تريد العودة إليها.</p></div><Link className="btn btn-primary" href="/learn" data-testid="link-footer-start">اختر أول درس <ChevronLeft size={18}/></Link></div></section>
    <div className="page-wrap" style={{paddingBottom:34,color:'#8a8495',fontSize:'.88rem'}}>دروس المستوى A1 مفتوحة من البداية. تقدّمك محفوظ على هذا الجهاز، ويمكنك مزامنته مع حسابك لاحقاً.</div>
  </div>;
}
function SelectLanguage() {
  const { progress, updateProgress } = useApp();
  const initialHint = (() => { try { return localStorage.getItem('wordora-language-hint') as LanguageId | null; } catch { return null; } })();
  const current = progress.selectedLanguage || initialHint || 'english';
  return <label className="select-language"><span style={{fontWeight:700,color:'#655b77'}}>أتعلّم</span><select aria-label="اختر اللغة" value={current} onChange={(e)=>updateProgress(old=>({...old,selectedLanguage:e.target.value as LanguageId}))} data-testid="select-learning-language">{languages.map(l=><option value={l.id} key={l.id}>{l.arabicName} — {l.name}</option>)}</select></label>;
}
function LearnPage() {
  const { progress, updateProgress, localOnly, cloudError } = useApp();
  const lang = progress.selectedLanguage || (localStorage.getItem('wordora-language-hint') as LanguageId) || 'english';
  const language = languages.find(l=>l.id===lang)!;
  useEffect(()=>{if(!progress.selectedLanguage)updateProgress(old=>old.selectedLanguage?old:{...old,selectedLanguage:lang});},[progress.selectedLanguage,lang,updateProgress]);
  const finishedByLevel = (level: Level) => progress.completedLessons.filter(id=>lessons.find(l=>l.id===id)?.languageId===lang && lessons.find(l=>l.id===id)?.level===level).length;
  const levels: { level:Level; title:string; required:number }[] = [{level:'A1',title:'البداية',required:0},{level:'A2',title:'خطوات أوسع',required:4},{level:'B1',title:'تحدّث بثقة',required:2}];
  return <main className="page-wrap app-main">
    <div className="welcome-banner"><div><div className="hero-kicker">مساحة التعلّم</div><h1>أهلاً بك في رحلتك.</h1><p>درس واحد قصير يكفي لتبدأ اليوم.</p></div><SelectLanguage/></div>
    {cloudError && !localOnly && <div className="notice" style={{marginBottom:16}}>تعذّر تحميل المزامنة الآن. سيبقى تقدّمك على هذا الجهاز، وسنحاول مرة أخرى لاحقاً.</div>}
    <div className="stat-strip"><div className="stat"><strong data-testid="text-points">{progress.points}</strong><span>نقطة تعلّم</span></div><div className="stat"><strong data-testid="text-streak">{progress.streak}</strong><span>أيام متتالية</span></div><div className="stat"><strong data-testid="text-completed-count">{progress.completedLessons.length}</strong><span>درس مكتمل</span></div></div>
    <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',flexWrap:'wrap'}}><div><h2 style={{margin:'0 0 5px',color:'#36256e'}}>دروس {language.arabicName}</h2><div style={{color:'#888293'}}>اختر موضوعاً وابدأ بالمفردات الأساسية.</div></div><span className="badge" dir="ltr">{language.name} · A1</span></div>
    {levels.map(({level,title,required})=>{const unlocked=level==='A1'||(level==='A2'?finishedByLevel('A1')>=required:finishedByLevel('A2')>=required);const list=lessons.filter(l=>l.languageId===lang&&l.level===level);return <section key={level}><div className="level-head"><span className="level-pill">{level}</span><h2>{title}</h2>{!unlocked&&<p>أكمل {required} دروس من المستوى السابق لفتح هذا المستوى</p>}</div><div className="lesson-grid">{list.map((lesson,index)=><LessonTile key={lesson.id} lesson={lesson} locked={!unlocked} completed={progress.completedLessons.includes(lesson.id)} number={index+1}/>)}</div></section>;})}
    <div style={{marginTop:28,color:'#928b9e',fontSize:'.86rem'}}>{localOnly?'ملف محلي: تقدّمك محفوظ على هذا الجهاز فقط. أنشئ حساباً لمزامنته.':'تقدّمك محفوظ في حسابك.'}{localOnly&&<Link href="/sign-up" style={{color:'#704cce',fontWeight:700,marginRight:6}} data-testid="link-sync-account">إنشاء حساب</Link>}</div>
  </main>;
}
function LessonTile({lesson,locked,completed,number}:{lesson:Lesson;locked:boolean;completed:boolean;number:number}) {
  return locked?<div className="lesson-card locked" aria-disabled="true" data-testid={`card-locked-lesson-${lesson.id}`}><div className="lesson-meta"><span>{lesson.level} · {String(number).padStart(2,'0')}</span><LockKeyhole size={16}/></div><h3>{lesson.topic}</h3><p>أكمل الدروس السابقة لفتح هذا الموضوع</p><span className="lesson-go" style={{color:'#a09ba8'}}>مقفل حالياً</span></div>:
  <Link className="lesson-card" href={`/lesson/${lesson.id}`} data-testid={`link-lesson-${lesson.id}`}><div className="lesson-meta"><span>{lesson.level} · {String(number).padStart(2,'0')}</span>{completed?<CheckCircle2 size={17} color="#46a27d"/>:<span>{lesson.words.length} كلمات</span>}</div><h3>{lesson.topic}</h3><p>{completed?'أكملت هذا الدرس — راجعه متى شئت':'مفردات عملية مع نطق وأمثلة'}</p><span className="lesson-go">{completed?'مراجعة الدرس':'ابدأ الدرس'} <ChevronLeft size={15} style={{verticalAlign:'middle'}}/></span></Link>;
}
function LessonPage() {
  const { lessonId } = useParamsSafe();
  const lesson = lessonById(lessonId);
  const [phase,setPhase]=useState<'words'|'quiz'|'done'>('words');
  const [index,setIndex]=useState(0);
  const [savedToast,setSavedToast]=useState(false);
  const [quizResult,setQuizResult]=useState<{score:number;total:number}|null>(null);
  const {progress,updateProgress}=useApp();
  const word=lesson?.words[index];
  if(!lesson||!word) return <main className="page-wrap app-main"><div className="panel"><h1 className="page-title">لم نجد هذا الدرس</h1><Link href="/learn" className="btn btn-primary" style={{marginTop:20}} data-testid="link-back-learn">العودة للتعلّم</Link></div></main>;
  const saved=progress.savedWords.includes(word.id);
  const toggleSave=()=>{updateProgress(old=>({...old,savedWords:saved?old.savedWords.filter(id=>id!==word.id):[...old.savedWords,word.id]}));setSavedToast(true);window.setTimeout(()=>setSavedToast(false),1600);};
  const audioAvailable='speechSynthesis' in window;
  const speak=(text:string)=>{if(soundEnabled()&&audioAvailable){window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang={english:'en-US',french:'fr-FR',spanish:'es-ES',german:'de-DE',italian:'it-IT'}[lesson.languageId];window.speechSynthesis.speak(utterance);}};
  return <main className="page-wrap app-main">
    <div className="lesson-top"><Link className="btn btn-quiet" href="/learn" data-testid="link-exit-lesson"><ChevronRight size={18}/>كل الدروس</Link><span style={{color:'#7e788b',fontWeight:700}}>{phase==='words'?'تعلّم الكلمات':phase==='quiz'?'اختبر نفسك':'أحسنت!'}</span><span style={{color:'#8f899a',fontSize:'.88rem'}}>{phase==='words'?`${index+1} / ${lesson.words.length}`:phase==='quiz'?'اختبار قصير':''}</span></div>
    <div className="progress-track"><span style={{width:phase==='words'?`${((index+1)/lesson.words.length)*58}%`:phase==='quiz'?'75%':'100%'}}/></div>
    <div style={{marginTop:18,color:'#8c8599',fontSize:'.89rem'}}>{lesson.topic} · {languages.find(l=>l.id===lesson.languageId)?.name}</div>
    {phase==='words'&&<><article className="panel word-card" key={word.id}><div style={{color:'#958fa0',fontSize:'.83rem'}}>الكلمة {index+1} من {lesson.words.length}</div><h1 dir="ltr" data-testid={`text-word-${word.id}`}>{word.term}</h1><div className="arabic-meaning" data-testid={`text-meaning-${word.id}`}>{word.arabicMeaning}</div><div className="pronunciation"><small>النطق التقريبي</small><span dir="auto">{word.pronunciation}</span></div><div className="example-line"><span>{word.example}</span><small>{word.exampleArabic}</small></div><button className="btn btn-quiet" style={{position:'absolute',top:14,left:14}} onClick={()=>speak(word.term)} disabled={!audioAvailable||!soundEnabled()} data-testid={`button-speak-word-${word.id}`} aria-label={audioAvailable?'استمع إلى نطق الكلمة':'الصوت غير متاح في هذا المتصفح'}><Volume2 size={20}/></button></article>
      <div className="word-actions"><button className="btn btn-outline" onClick={()=>speak(word.example)} disabled={!audioAvailable||!soundEnabled()} data-testid={`button-speak-example-${word.id}`}><Volume2 size={17}/> استمع إلى المثال</button><button className="btn btn-outline" onClick={toggleSave} data-testid={`button-save-word-${word.id}`}><Bookmark size={17} fill={saved?'currentColor':'none'}/>{saved?'إزالة من كلماتي':'احفظ الكلمة'}</button></div>{savedToast&&<div style={{textAlign:'center',color:'#43846c',marginTop:9}} data-testid="status-save-feedback">{saved?'أُضيفت إلى كلماتك المحفوظة':'أُزيلت من كلماتك المحفوظة'}</div>}
      <div className="word-nav"><button className="btn btn-outline" disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))} data-testid="button-previous-word"><ChevronRight size={17}/> السابقة</button>{index<lesson.words.length-1?<button className="btn btn-primary" onClick={()=>setIndex(i=>Math.min(lesson.words.length-1,i+1))} data-testid="button-next-word">الكلمة التالية <ChevronLeft size={17}/></button>:<button className="btn btn-primary" onClick={()=>setPhase('quiz')} data-testid="button-start-quiz">ابدأ الاختبار <ChevronLeft size={17}/></button>}</div></>}
    {phase==='quiz'&&<Quiz lesson={lesson} onComplete={(score,total)=>{setQuizResult({score,total});const complete=progress.completedLessons.includes(lesson.id);updateProgress(old=>{const next=touch({...old,completedLessons:old.completedLessons.includes(lesson.id)?old.completedLessons:[...old.completedLessons,lesson.id],points:old.points+(complete?0:20+score*5),quizAttempts:{...old.quizAttempts,[lesson.id]:(old.quizAttempts[lesson.id]||0)+1}});return next;});setPhase('done');}}/>}
     {phase==='done'&&<div className="panel empty-state" style={{marginTop:23}}><div className="empty-icon"><Trophy size={28}/></div><h3>أكملت الدرس!</h3><p data-testid="text-quiz-score">إجابات صحيحة: {quizResult?.score ?? 0} · إجابات غير صحيحة: {(quizResult?.total ?? 0)-(quizResult?.score ?? 0)}</p><p style={{color:'#7355c8'}}>تقدّم رائع. كل كلمة جديدة تفتح لك باباً.</p><div style={{display:'flex',justifyContent:'center',gap:11,flexWrap:'wrap',marginTop:19}}><Link href="/learn" className="btn btn-primary" data-testid="link-completion-lessons">تابع الدروس <ChevronLeft size={17}/></Link><Link href="/progress" className="btn btn-outline" data-testid="link-completion-progress">عرض إنجازي</Link></div></div>}
  </main>;
}
function useParamsSafe(){ const [path]=useLocation(); const id=path.split('/').filter(Boolean).pop()||''; return {lessonId:id}; }
type QuizKind='اختيار من متعدد'|'اختيار الترجمة الصحيحة'|'مطابقة'|'أكمل العبارة'|'ترجمة كتابية';
type QuizQuestion={ word:Word; pair?:Word; kind:QuizKind; choices:string[]; answer:string; prompt:string };
function buildQuiz(lesson:Lesson):QuizQuestion[] {
  const shuffled=[...lesson.words].sort(()=>Math.random()-.5);
  const kinds:QuizKind[]=['اختيار من متعدد','اختيار الترجمة الصحيحة','مطابقة','أكمل العبارة','ترجمة كتابية'];
  return Array.from({length:kinds.length},(_,i)=>{
    const word=shuffled[i % shuffled.length];
    const kind=kinds[i];
    const pair=kind==='مطابقة'?shuffled[(i+1)%shuffled.length]:undefined;
    const choices=kind==='اختيار من متعدد'||kind==='مطابقة'
      ? [...new Set(lesson.words.map(w=>w.arabicMeaning))].sort(()=>Math.random()-.5)
      : [...new Set(lesson.words.map(w=>w.term))].sort(()=>Math.random()-.5);
    const answer=kind==='اختيار من متعدد'?word.arabicMeaning:word.term;
    const prompt=kind==='اختيار من متعدد'?'ما معنى هذه الكلمة؟':kind==='اختيار الترجمة الصحيحة'?'اختر الترجمة الصحيحة لهذه الكلمة':kind==='مطابقة'?'صِل كل كلمة بمعناها':kind==='أكمل العبارة'?'أكمل الجملة بالكلمة المناسبة':'اكتب ترجمة الكلمة إلى اللغة التي تتعلّمها';
    return {word,pair,kind,choices,answer,prompt};
  });
}
const normalizeAnswer=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}\s]/gu,'').trim().toLocaleLowerCase();
function maskTarget(sentence:string,target:string) {
  const escape=(value:string)=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const exact=new RegExp(escape(target),'i');
  if(exact.test(sentence)) return sentence.replace(exact,'______');
  const lastWord=target.trim().split(/\s+/).at(-1)||target;
  return sentence.replace(new RegExp(escape(lastWord),'i'),'______');
}
function Quiz({lesson,onComplete}:{lesson:Lesson;onComplete:(score:number,total:number)=>void}) {
  const questions=useMemo(()=>buildQuiz(lesson),[lesson.id]);
  const [qIndex,setQIndex]=useState(0);
  const [answer,setAnswer]=useState('');
  const [matchingAnswers,setMatchingAnswers]=useState<[string,string]>(['','']);
  const [checked,setChecked]=useState(false);
  const [score,setScore]=useState(0);
  const q=questions[qIndex];
  const correct= q.kind==='مطابقة'
    ? normalizeAnswer(matchingAnswers[0])===normalizeAnswer(q.word.arabicMeaning)&&normalizeAnswer(matchingAnswers[1])===normalizeAnswer(q.pair?.arabicMeaning||'')
    : normalizeAnswer(answer)===normalizeAnswer(q.answer);
  const submit=(value=answer)=>{
    if(checked)return;
    if(q.kind==='مطابقة'){if(!matchingAnswers[0]||!matchingAnswers[1])return;}
    else if(!value.trim())return;
    const isCorrect=q.kind==='مطابقة'
      ? normalizeAnswer(matchingAnswers[0])===normalizeAnswer(q.word.arabicMeaning)&&normalizeAnswer(matchingAnswers[1])===normalizeAnswer(q.pair?.arabicMeaning||'')
      : normalizeAnswer(value)===normalizeAnswer(q.answer);
    setAnswer(value);setChecked(true);if(isCorrect)setScore(s=>s+1);
  };
  const next=()=>{if(qIndex===questions.length-1){onComplete(score,questions.length);return;}setQIndex(i=>i+1);setAnswer('');setMatchingAnswers(['','']);setChecked(false);};
  const fillSentence=maskTarget(q.word.example,q.word.term);
  return <section className="panel" style={{marginTop:22,maxWidth:700,marginInline:'auto'}}><div style={{display:'flex',justifyContent:'space-between',color:'#898395',fontSize:'.88rem'}}><span>{q.kind}</span><span>السؤال {qIndex+1} من {questions.length}</span></div><h2 style={{color:'#3d2c72',margin:'17px 0 7px'}}>{q.prompt}</h2>
     {q.kind==='اختيار من متعدد'&&<div dir="ltr" style={{fontSize:'1.35rem',fontWeight:800,color:'#6045a9',marginBottom:18}}>{q.word.term}</div>}
     {q.kind==='اختيار من متعدد'&&q.choices.map((choice,i)=><button key={`${q.word.id}-${i}`} className={`quiz-option ${checked&&normalizeAnswer(choice)===normalizeAnswer(q.word.arabicMeaning)?'correct':''} ${checked&&normalizeAnswer(answer)===normalizeAnswer(choice)&&!correct?'wrong':''}`} onClick={()=>submit(choice)} disabled={checked} data-testid={`button-quiz-option-${qIndex}-${i}`}>{choice}</button>)}
     {q.kind==='اختيار الترجمة الصحيحة'&&<><div style={{fontSize:'1.25rem',fontWeight:800,color:'#4c8a75',marginBottom:18}}>{q.word.arabicMeaning}</div>{q.choices.map((choice,i)=><button key={`${q.word.id}-${i}`} className={`quiz-option ${checked&&normalizeAnswer(choice)===normalizeAnswer(q.word.term)?'correct':''} ${checked&&normalizeAnswer(answer)===normalizeAnswer(choice)&&!correct?'wrong':''}`} onClick={()=>submit(choice)} disabled={checked} dir="ltr" data-testid={`button-quiz-option-${qIndex}-${i}`}>{choice}</button>)}</>}
     {q.kind==='مطابقة'&&<div className="matching-list">{[q.word,q.pair!].map((item,i)=><label className="matching-row" key={item.id}><b dir="ltr">{item.term}</b><select value={matchingAnswers[i]} onChange={e=>setMatchingAnswers(old=>{const next:[string,string]=[...old];next[i]=e.target.value;return next;})} disabled={checked} data-testid={`select-match-${qIndex}-${i}`}><option value="">اختاري المعنى</option>{q.choices.map(choice=><option key={choice} value={choice}>{choice}</option>)}</select></label>)}<button className="btn btn-primary" onClick={()=>submit()} disabled={checked||!matchingAnswers[0]||!matchingAnswers[1]} data-testid="button-check-matching">تحقّقي من المطابقة <Check size={17}/></button></div>}
     {q.kind==='أكمل العبارة'&&<><div className="example-line quiz-sentence" dir="ltr">{fillSentence}</div>{q.choices.map((choice,i)=><button key={`${q.word.id}-${i}`} className={`quiz-option ${checked&&normalizeAnswer(choice)===normalizeAnswer(q.word.term)?'correct':''} ${checked&&normalizeAnswer(answer)===normalizeAnswer(choice)&&!correct?'wrong':''}`} onClick={()=>submit(choice)} disabled={checked} dir="ltr" data-testid={`button-quiz-option-${qIndex}-${i}`}>{choice}</button>)}</>}
     {q.kind==='ترجمة كتابية'&&<form onSubmit={e=>{e.preventDefault();submit();}}><div style={{fontSize:'1.25rem',fontWeight:800,color:'#4c8a75',marginBottom:12}}>{q.word.arabicMeaning}</div><label className="field"><span>اكتب الكلمة باللغة التي تتعلّمها</span><input value={answer} onChange={e=>setAnswer(e.target.value)} disabled={checked} placeholder="اكتب الترجمة هنا" dir="auto" data-testid={`input-quiz-answer-${qIndex}`}/></label><button type="submit" className="btn btn-primary" disabled={checked||!answer.trim()} data-testid="button-check-answer">تحقّق من الإجابة <Check size={17}/></button></form>}
     {checked&&<div className={`feedback ${correct?'ok':'no'}`} data-testid={`status-quiz-feedback-${qIndex}`}>{correct?'إجابة صحيحة، أحسنت!':q.kind==='مطابقة'?<>ليست المطابقة صحيحة. الإجابات: <strong>{q.word.term} — {q.word.arabicMeaning}، {q.pair?.term} — {q.pair?.arabicMeaning}</strong></>:<>ليست هذه الإجابة. الإجابة الصحيحة: <strong>{q.kind==='اختيار من متعدد'?q.word.arabicMeaning:q.word.term}</strong></>}</div>}
    {checked&&<button className="btn btn-primary" style={{marginTop:18}} onClick={next} data-testid="button-next-question">{qIndex===questions.length-1?'إنهاء الاختبار':'السؤال التالي'} <ChevronLeft size={16}/></button>}
  </section>;
}
function ProgressPage() {
  const {progress}=useApp();
  const completed=lessons.filter(l=>progress.completedLessons.includes(l.id));
  const language=languages.find(l=>l.id===progress.selectedLanguage);
  const languageLessons=lessons.filter(l=>l.languageId===progress.selectedLanguage);
  const languageCompleted=languageLessons.filter(l=>progress.completedLessons.includes(l.id));
  const a1Count=languageLessons.filter(l=>l.level==='A1'&&progress.completedLessons.includes(l.id)).length;
  const a2Count=languageLessons.filter(l=>l.level==='A2'&&progress.completedLessons.includes(l.id)).length;
  const currentLevel=a2Count>=2?'B1':a1Count>=4?'A2':'A1';
  const progressPercent=languageLessons.length?Math.round(languageCompleted.length/languageLessons.length*100):0;
  const badges=[
    {id:'first-lesson',title:'أول خطوة',detail:'إكمال أول درس',earned:progress.completedLessons.length>=1},
    {id:'five-lessons',title:'خمس خطوات',detail:'إكمال ٥ دروس',earned:progress.completedLessons.length>=5},
    {id:'word-collector',title:'جامع الكلمات',detail:'حفظ ٥ كلمات',earned:progress.savedWords.length>=5},
    {id:'three-day-streak',title:'عادة جميلة',detail:'التعلّم ٣ أيام متتالية',earned:progress.streak>=3},
    {id:'century-points',title:'١٠٠ نقطة',detail:'جمع ١٠٠ نقطة',earned:progress.points>=100},
  ];
  const earnedBadges=badges.filter(b=>b.earned);
  return <main className="page-wrap app-main"><h1 className="page-title">إنجازك يكبر</h1><p className="page-subtitle">كل درس أنهيته وكل كلمة احتفظت بها — هذا تقدّمك الحقيقي.</p>
    <div className="stat-strip"><div className="stat"><strong data-testid="text-progress-points">{progress.points}</strong><span>نقطة</span></div><div className="stat"><strong data-testid="text-progress-streak">{progress.streak}</strong><span>أيام متتالية</span></div><div className="stat"><strong data-testid="text-progress-lessons">{completed.length}</strong><span>دروس مكتملة</span></div></div>
    <section className="panel progress-overview"><div className="progress-overview-head"><div><div className="hero-kicker">مسارك الآن</div><h2 data-testid="text-progress-language">{language?`${language.arabicName} · ${language.name}`:'لم تختر لغة بعد'}</h2></div><span className="level-pill" data-testid="text-current-level">{language?`المستوى ${currentLevel}`:'ابدئي باختيار لغة'}</span></div>
      <div className="progress-label"><span>التقدّم في اللغة المختارة</span><strong data-testid="text-progress-percent">{language?`${progressPercent}%`:'—'}</strong></div><div className="progress-track"><span style={{width:`${progressPercent}%`}}/></div>
      <div className="progress-foot"><span>{language?`${languageCompleted.length} من ${languageLessons.length} درساً`:'اختاري لغة لبدء احتساب التقدّم'}</span><span>{progress.savedWords.length} كلمة محفوظة</span></div>
    </section>
    {completed.length===0?<div className="panel empty-state"><div className="empty-icon"><Trophy size={27}/></div><h3>مساحتك جاهزة لأول إنجاز</h3><p>عندما تنهي أول درس، ستجده هنا مع نقاطك وتقدّمك.</p><Link href="/learn" className="btn btn-primary" style={{marginTop:15}} data-testid="link-progress-first-lesson">ابدأ أول درس</Link></div>:<div className="panel"><h2 style={{marginTop:0,color:'#3c2b70'}}>الدروس التي أنهيتها</h2><div className="saved-list">{completed.map(lesson=><div className="saved-row" key={lesson.id} data-testid={`row-completed-lesson-${lesson.id}`}><div><div style={{fontWeight:800,color:'#44347a'}}>{lesson.topic}</div><div style={{color:'#8b8597',fontSize:'.86rem'}}>{languages.find(l=>l.id===lesson.languageId)?.arabicName} · {lesson.level}</div></div><CheckCircle2 size={20} color="#4da27e"/></div>)}</div></div>}
    <section className="panel achievement-panel"><div className="section-heading"><div><h2>الشارات والإنجازات</h2><p>تظهر الشارة هنا بعد تحقيق شرطها فعلاً.</p></div><span className="badge" data-testid="text-earned-badges">{earnedBadges.length} شارات</span></div>
      {earnedBadges.length===0?<div className="empty-achievements">أنهِ درساً أو احفظ كلماتك لتفتح أول شارة.</div>:<div className="badge-grid">{earnedBadges.map(b=><article className="achievement-card earned" key={b.id} data-testid={`badge-earned-${b.id}`}><span><Trophy size={19}/></span><div><strong>{b.title}</strong><small>{b.detail}</small></div><CheckCircle2 size={18}/></article>)}</div>}
      {badges.some(b=>!b.earned)&&<div className="next-badges"><span>الخطوات القادمة:</span>{badges.filter(b=>!b.earned).slice(0,3).map(b=><span key={b.id} data-testid={`badge-next-${b.id}`}>{b.title} — {b.detail}</span>)}</div>}
    </section>
    <p style={{color:'#928b9e',fontSize:'.88rem',marginTop:18}}>محاولات الاختبار: {Object.values(progress.quizAttempts).reduce((sum,n)=>sum+n,0)}</p>
  </main>;
}
function findWord(id:string):{lesson:Lesson;word:Word}|null { for(const lesson of lessons){const word=lesson.words.find(w=>w.id===id);if(word)return {lesson,word};}return null; }
function SavedPage() {
  const {progress,updateProgress}=useApp();
  const [review,setReview]=useState<string|null>(null);
  const audioAvailable='speechSynthesis' in window;
  const saved=progress.savedWords.map(findWord).filter((item):item is {lesson:Lesson;word:Word}=>!!item);
  return <main className="page-wrap app-main"><h1 className="page-title">كلماتك المحفوظة</h1><p className="page-subtitle">احتفظ بالكلمات التي تود مراجعتها، واستمع إلى نطقها في أي وقت.</p>
    {saved.length===0?<div className="panel empty-state"><div className="empty-icon"><Bookmark size={26}/></div><h3>لا توجد كلمات محفوظة بعد</h3><p>اضغط «احفظ الكلمة» أثناء الدرس لتجدها هنا.</p><Link href="/learn" className="btn btn-primary" style={{marginTop:15}} data-testid="link-saved-browse-lessons">تصفّح الدروس</Link></div>:
     <div className="panel"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><strong style={{color:'#44347a'}}>{saved.length} كلمات</strong><button className="btn btn-quiet btn-small" onClick={()=>setReview(review?'':saved[0]?.word.id||'')} data-testid="button-review-saved"><RotateCcw size={16}/> مراجعة سريعة</button></div><div className="saved-list">{saved.map(({lesson,word})=><div className="saved-row" key={word.id} data-testid={`row-saved-word-${word.id}`}><div><div className="saved-term">{word.term}</div><div className="saved-meaning">{word.arabicMeaning}</div><div style={{color:'#a29baa',fontSize:'.8rem',marginTop:4}}>{lesson.topic} · {languages.find(l=>l.id===lesson.languageId)?.name}</div>{review===word.id&&<div className="notice" style={{marginTop:9}}>مثال: <span dir="ltr">{word.example}</span><div dir="rtl">{word.exampleArabic}</div></div>}</div><div style={{display:'flex',gap:4}}><button className="btn btn-quiet" disabled={!audioAvailable||!soundEnabled()} onClick={()=>{if(soundEnabled()&&audioAvailable){const u=new SpeechSynthesisUtterance(word.term);u.lang={english:'en-US',french:'fr-FR',spanish:'es-ES',german:'de-DE',italian:'it-IT'}[lesson.languageId];speechSynthesis.speak(u);}}} aria-label="استمع للكلمة" data-testid={`button-speak-saved-${word.id}`}><Volume2 size={18}/></button><button className="btn btn-quiet" onClick={()=>updateProgress(old=>({...old,savedWords:old.savedWords.filter(id=>id!==word.id)}))} aria-label="إزالة الكلمة" data-testid={`button-remove-saved-${word.id}`}><Trash2 size={17}/></button></div></div>)}</div></div>}
  </main>;
}
function ProfilePage() {
  const {progress,localOnly}=useApp();const {user,isSignedIn}=useUser();
  const name=user?.fullName||user?.firstName||'متعلّم Wordora';
  return <main className="page-wrap app-main"><h1 className="page-title">ملفك الشخصي</h1><p className="page-subtitle">مكانك الصغير في عالم الكلمات.</p><section className="panel"><div className="profile-head"><div className="avatar">{name.trim().slice(0,1)}</div><div style={{flex:1}}><h2 data-testid="text-profile-name">{name}</h2><p data-testid="text-profile-email">{user?.primaryEmailAddress?.emailAddress||'ملف محلي على هذا الجهاز'}</p></div><span className="badge">{localOnly?'ملف محلي':'حساب Wordora'}</span></div>
    <div className="notice">{localOnly?'تقدّمك محفوظ على هذا الجهاز فقط. أنشئ حساباً مجانياً لمزامنته بين أجهزتك.':'حسابك متصل، ويجري حفظ تقدّمك سحابياً.'}</div>{localOnly&&<div style={{display:'flex',gap:10,marginTop:16,flexWrap:'wrap'}}><Link className="btn btn-primary" href="/sign-up" data-testid="link-profile-sign-up">إنشاء حساب</Link><Link className="btn btn-outline" href="/sign-in" data-testid="link-profile-sign-in">لدي حساب بالفعل</Link></div>}
    {!isSignedIn&&<div style={{marginTop:20,color:'#817b8e'}}>التفضيل الحالي: {languages.find(l=>l.id===progress.selectedLanguage)?.arabicName||'لم تختر لغة بعد'}</div>}</section>
    <div className="stat-strip"><div className="stat"><strong>{progress.points}</strong><span>نقطة</span></div><div className="stat"><strong>{progress.completedLessons.length}</strong><span>درس مكتمل</span></div><div className="stat"><strong>{progress.savedWords.length}</strong><span>كلمة محفوظة</span></div></div><Link href="/settings" className="btn btn-outline" data-testid="link-profile-settings"><Settings size={17}/> إعدادات التعلّم</Link>
  </main>;
}
type Preferences={dailyGoal:number; sound:boolean; darkMode:boolean};
const preferencesKey='wordora-preferences-v1';
const readPreferences=():Preferences=>{try{return {...{dailyGoal:10,sound:true,darkMode:false},...JSON.parse(localStorage.getItem(preferencesKey)||'{}')};}catch{return {dailyGoal:10,sound:true,darkMode:false};}};
function SettingsPage() {
  const [prefs,setPrefs]=useState<Preferences>(readPreferences);
  useEffect(()=>{document.documentElement.classList.toggle('dark',prefs.darkMode);localStorage.setItem(preferencesKey,JSON.stringify(prefs));},[prefs]);
  const toggle=(key:'sound'|'darkMode')=>setPrefs(old=>({...old,[key]:!old[key]}));
  return <main className="page-wrap app-main"><h1 className="page-title">الإعدادات</h1><p className="page-subtitle">عدّل تجربتك لتناسب يومك. تُحفظ الخيارات على هذا الجهاز.</p><section className="panel" style={{maxWidth:720}}><h2 style={{marginTop:0,color:'#3c2b70'}}>تفضيلات التعلّم</h2><label className="field"><span>هدفك اليومي</span><select value={prefs.dailyGoal} onChange={e=>setPrefs(old=>({...old,dailyGoal:Number(e.target.value)}))} data-testid="select-daily-goal"><option value={5}>٥ دقائق</option><option value={10}>١٠ دقائق</option><option value={15}>١٥ دقيقة</option><option value={20}>٢٠ دقيقة</option></select></label><div className="toggle-row"><div><strong>الصوت</strong><small>إتاحة الاستماع إلى نطق الكلمات والأمثلة</small></div><button className={`toggle ${prefs.sound?'on':''}`} onClick={()=>toggle('sound')} aria-label="تفعيل الصوت" aria-pressed={prefs.sound} data-testid="toggle-sound"><span/></button></div><div className="toggle-row"><div><strong>الوضع الليلي</strong><small>واجهة مريحة للإضاءة المنخفضة</small></div><button className={`toggle ${prefs.darkMode?'on':''}`} onClick={()=>toggle('darkMode')} aria-label="تفعيل الوضع الليلي" aria-pressed={prefs.darkMode} data-testid="toggle-dark-mode"><span/></button></div><div className="notice" style={{marginTop:20}}>تفضيلاتك محفوظة محلياً في متصفحك.</div></section></main>;
}
function AboutPage() {
  return <main className="page-wrap app-main"><div className="hero-kicker">عن Wordora</div><h1 className="page-title" style={{marginTop:10}}>الكلمات تفتح عوالم جديدة.</h1><p className="page-subtitle" style={{maxWidth:720}}>Wordora مساحة تعلّم لغات للناطقين بالعربية، صُممت لتجعل البداية بسيطة ومشجعة. نؤمن أن جملة واحدة تقولها بثقة قد تكون بداية حكاية جديدة.</p><div className="feature-grid"><article className="feature-panel"><BookOpen size={24}/><h3>بدايات واضحة</h3><p>محتوى A1 عملي مقسّم إلى موضوعات مألوفة، من التحية إلى السفر.</p></article><article className="feature-panel alt"><Globe2 size={24}/><h3>خمس لغات، خطوة واحدة</h3><p>الإنجليزية والفرنسية والإسبانية والألمانية والإيطالية — تعلّم من خلال العربية.</p></article></div><div className="panel" style={{marginTop:18,maxWidth:760}}><h2 style={{marginTop:0,color:'#3c2b70'}}>خصوصيتك أولاً</h2><p style={{lineHeight:1.8,color:'#777286',marginBottom:0}}>يمكنك تجربة Wordora دون حساب. يُحفظ تقدّم الملف المحلي على جهازك، وعند إنشاء حساب يمكنك مزامنته. لا نعرض إحصاءات تقديرية؛ إنجازك يعكس ما أنهيته فعلاً.</p></div><Link href="/contact" className="btn btn-primary" style={{marginTop:22}} data-testid="link-about-contact">تواصل معنا</Link></main>;
}
function ContactPage() {
  const [subject,setSubject]=useState('ملاحظة حول Wordora');const [message,setMessage]=useState('');
  const mailto=`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  return <main className="page-wrap app-main"><h1 className="page-title">يسعدنا أن نسمع منك</h1><p className="page-subtitle">اقتراح أو سؤال؟ اكتب رسالتك وسيفتح تطبيق البريد لديك مسودة جاهزة.</p><section className="panel" style={{maxWidth:700}}><label className="field">موضوع الرسالة<input value={subject} onChange={e=>setSubject(e.target.value)} data-testid="input-contact-subject"/></label><label className="field">رسالتك<textarea rows={5} value={message} onChange={e=>setMessage(e.target.value)} placeholder="أخبرنا بما يدور في بالك..." data-testid="input-contact-message"/></label><a href={mailto} className="btn btn-primary" aria-disabled={!message.trim()} onClick={e=>{if(!message.trim())e.preventDefault();}} data-testid="link-send-contact"><MessageCircle size={17}/> افتح البريد لإرسال الرسالة</a><p style={{color:'#928b9e',fontSize:'.82rem',marginBottom:0}}>لم يُضف عنوان بريد رسمي للدعم بعد؛ أدخلي عنوان التواصل في خانة المستلم قبل الإرسال.</p></section></main>;
}
function ClerkCacheInvalidator() {
  const {addListener}=useClerk();
  useEffect(()=>addListener(()=>{queryClient.clear();}),[addListener]);
  return null;
}
function ClerkWithRoutes(){
  const [,setLocation]=useLocation();
  return <ClerkProvider publishableKey={clerkPubKey} proxyUrl={clerkProxyUrl} appearance={appAppearance} signInUrl={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`}
    localization={{...arSA,signIn:{...(arSA.signIn??{}),start:{...(arSA.signIn?.start??{}),title:'مرحباً بعودتك',subtitle:'سجّل الدخول لمتابعة رحلتك'}},signUp:{...(arSA.signUp??{}),start:{...(arSA.signUp?.start??{}),title:'ابدأ رحلتك مع Wordora',subtitle:'أنشئ حسابك واحفظ تقدّمك'}}}}
    routerPush={to=>setLocation(stripBase(to))} routerReplace={to=>setLocation(stripBase(to),{replace:true})}>
    <ClerkCacheInvalidator/><WordoraRoot/>
  </ClerkProvider>;
}
function App() {
  return <QueryClientProvider client={queryClient}><WouterRouter base={basePath}><ClerkWithRoutes/></WouterRouter></QueryClientProvider>;
}
export default App;
