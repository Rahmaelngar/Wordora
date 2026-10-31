const base = import.meta.env.BASE_URL;
export default function Slide02() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-02">
    <style>{`
      @keyframes wordoraPhoto02 { 0%,100% { transform: translateY(0) rotate(-.6deg) scale(1); } 50% { transform: translateY(-2vh) rotate(.6deg) scale(1.025); } }
      .motion-slide-02 > .deck-image { animation: wordoraPhoto02 4.5s ease-in-out infinite; }
      .slide .motion-slide-02 > .deck-image { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-02 > .deck-image { animation: none; transform: none; } }
    `}</style>
    <h1 className="deck-title">تعلّم لغة جديدة… من أين تبدأ؟</h1>
    <svg className="deck-image decor-star left-[2vw] top-[19vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="deck-image decor-tile right-[2vw] top-[68vh]" aria-hidden="true"/>
    <div className="decor-zigzag left-[2vw] top-[76vh]" aria-hidden="true"/>
    <div className="organic-soft left-[2vw] top-[30vh] w-[43vw] h-[57vh]"/>
    <img src={`${base}images/problem.webp`} crossOrigin="anonymous" alt="طالبة تبحث عن بداية منظّمة، صورة AI" className="deck-image left-[1vw] top-[27vh] w-[46vw] h-[62vh]"/>
    <div className="absolute right-[6vw] top-[32vh] w-[46vw] clean-list">
      <p>مصادر كثيرة، وخطة غير واضحة</p>
      <p>كلمات محفوظة… بلا ممارسة</p>
      <p>حماس في البداية، ثمّ انقطاع</p>
      <p>الحاجة إلى شرح عربي وخطوات سهلة</p>
    </div>
    <p className="absolute right-[6vw] top-[82vh] w-[46vw] text-[1.8vw] font-bold text-primary leading-[1.6]">Wordora يجمع الخطوات في تجربة واحدة.</p>
    <div className="deck-footer"><span>Wordora</span><span>02</span></div>
  </div>;
}
