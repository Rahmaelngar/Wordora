export default function Slide10() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame">
    <h1 className="deck-title">إنجاز واضح… وتقدّم محفوظ</h1>
    <svg className="decor-star left-[2vw] top-[19vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="decor-tile right-[2vw] top-[76vh]" aria-hidden="true"/>
    <div className="decor-zigzag left-[2vw] top-[76vh]" aria-hidden="true"/>
    <div className="absolute right-[6vw] top-[30vh] w-[40vw]">
      <svg className="column-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/></svg>
      <p className="deck-copy font-bold">حسابك وملفّك الشخصي وإعداداتك</p>
      <p className="deck-copy mt-[3vh]">لوحة تعرض إنجازك الفعلي ونقاطك</p>
      <svg className="column-icon mt-[4vh]" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 3h14v19l-7-4-7 4ZM8 9l3 3 5-5"/></svg>
      <p className="deck-copy">قائمة مراجعة للكلمات والعبارات المحفوظة</p>
    </div>
    <div className="absolute left-[7vw] top-[33vh] w-[34vw]">
      <svg className="column-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M6 19a5 5 0 0 1-1-10 7 7 0 0 1 13-1 6 6 0 0 1 0 11ZM12 11v6m-3-3 3 3 3-3"/></svg>
      <p className="deck-copy font-bold">عند تسجيل الدخول: حفظ سحابي لتقدّمك</p>
      <svg className="column-icon mt-[5vh]" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 3h14l3 12H2ZM2 15v6h20v-6M6 18h1m3 0h1"/></svg>
      <p className="deck-copy">للضيف: حفظ محلي مؤقّت في المتصفّح، وليس سحابيًا.</p>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>10</span></div>
  </div>;
}
