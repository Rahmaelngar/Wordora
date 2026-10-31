export default function Slide04() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-04">
    <style>{`
      @keyframes levelSpark04 { 0%,100% { transform: scale(1); opacity: .6; } 50% { transform: scale(1.12); opacity: 1; } }
      .motion-slide-04 .decor-star,.motion-slide-04 .decor-tile { animation: levelSpark04 2.6s ease-in-out infinite; }
      .slide .motion-slide-04 .decor-star,.slide .motion-slide-04 .decor-tile { animation: none; transform: none; opacity: 1; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-04 .decor-star,.motion-slide-04 .decor-tile { animation: none; transform: none; opacity: 1; } }
    `}</style>
    <h1 className="deck-title">من أول كلمة… إلى مستوى متقدّم</h1>
    <svg className="decor-star left-[2vw] top-[21vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="decor-tile right-[2vw] top-[73vh]" aria-hidden="true"/>
    <div className="decor-zigzag left-[2vw] top-[77vh]" aria-hidden="true"/>
    <div className="organic left-[4vw] top-[28vh] w-[41vw] h-[60vh]"/>
    <div className="absolute left-[7vw] top-[34vh] w-[35vw] text-center">
      <p className="text-[11vw] leading-[1.1] font-black text-primary" dir="ltr">1350</p>
      <p className="text-[2vw] leading-[1.7]">عنصرًا تعليميًا في كل لغة</p>
      <p className="text-[1.9vw] font-bold leading-[1.7] mt-[1.4vh] text-primary">8100 عنصر عبر اللغات الست</p>
      <p className="deck-copy mt-[3vh]">تتفتح المستويات تدريجيًا مع إنجازك للدروس.</p>
    </div>
    <div className="absolute right-[6vw] top-[29vh] w-[43vw]">
      <div className="level-line"><strong dir="ltr">A1:</strong><p>100 كلمة وتعبير</p></div>
      <div className="level-line"><strong dir="ltr">A2:</strong><p>150 كلمة وتعبير</p></div>
      <div className="level-line"><strong dir="ltr">B1:</strong><p>200 جملة وموقف</p></div>
      <div className="level-line"><strong dir="ltr">B2:</strong><p>250 جملة وتعبير</p></div>
      <div className="level-line"><strong dir="ltr">C1:</strong><p>300 جملة وتعبير</p></div>
      <div className="level-line"><strong dir="ltr">C2:</strong><p>350 جملة وتعبير</p></div>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>04</span></div>
  </div>;
}
