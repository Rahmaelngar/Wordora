const base = import.meta.env.BASE_URL;
export default function Slide04() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-04">
    <style>{`
      @keyframes levelSpark04 { 0%,100% { transform: scale(1); opacity: .6; } 50% { transform: scale(1.12); opacity: 1; } }
      @keyframes levelJourney04 { 0%,100% { transform: translateY(0) rotate(-.6deg) scale(1); } 50% { transform: translateY(-1.2vh) rotate(.6deg) scale(1.025); } }
      .motion-slide-04 .level-journey-04 { animation: levelJourney04 4.2s ease-in-out infinite; }
      .motion-slide-04 .decor-star,.motion-slide-04 .decor-tile { animation: levelSpark04 2.6s ease-in-out infinite; }
      .slide .motion-slide-04 .level-journey-04 { animation: none; transform: none; }
      .slide .motion-slide-04 .decor-star,.slide .motion-slide-04 .decor-tile { animation: none; transform: none; opacity: 1; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-04 .level-journey-04 { animation: none; transform: none; } }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-04 .decor-star,.motion-slide-04 .decor-tile { animation: none; transform: none; opacity: 1; } }
    `}</style>
    <h1 className="deck-title">ستة مستويات تواكب تقدّمك</h1>
    <svg className="decor-star left-[2vw] top-[21vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="decor-tile right-[2vw] top-[73vh]" aria-hidden="true"/>
    <div className="decor-zigzag left-[2vw] top-[77vh]" aria-hidden="true"/>
    <div className="organic left-[4vw] top-[28vh] w-[41vw] h-[60vh]"/>
    <img src={`${base}images/levels-journey-cartoon.webp`} crossOrigin="anonymous" alt="شخصية كرتونية تصعد درجات التعلّم نحو نجمة الإنجاز" className="deck-image level-journey-04 left-[4vw] top-[24vh] w-[41vw] h-[41vh]"/>
    <div className="absolute left-[7vw] top-[68vh] w-[35vw] text-center">
      <div className="flex items-baseline justify-center gap-[.7vw]">
        <p className="text-[4.5vw] leading-[1.1] font-black text-primary" dir="ltr">1350</p>
        <p className="text-[2vw] leading-[1.5]">عنصرًا تعليميًا لكل لغة</p>
      </div>
      <p className="text-[1.9vw] font-bold leading-[1.7] mt-[1.4vh] text-primary">8100 عنصر تعليمي عبر اللغات الست</p>
    </div>
    <div className="absolute right-[6vw] top-[26vh] w-[43vw]">
      <div className="level-line"><strong dir="ltr">A1:</strong><p>100 كلمة وتعبير</p></div>
      <div className="level-line"><strong dir="ltr">A2:</strong><p>150 كلمة وتعبير</p></div>
      <div className="level-line"><strong dir="ltr">B1:</strong><p>200 جملة وموقف</p></div>
      <div className="level-line"><strong dir="ltr">B2:</strong><p>250 جملة وتعبير</p></div>
      <div className="level-line"><strong dir="ltr">C1:</strong><p>300 جملة وتعبير</p></div>
      <div className="level-line"><strong dir="ltr">C2:</strong><p>350 جملة وتعبير</p></div>
      <p className="deck-copy mt-[2vh]">تُفتح المستويات الأعلى تدريجيًا بإنجاز الدروس.</p>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>04</span></div>
  </div>;
}
