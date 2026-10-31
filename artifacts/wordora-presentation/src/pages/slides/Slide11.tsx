const base = import.meta.env.BASE_URL;
export default function Slide11() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-11">
    <style>{`
      @keyframes wordoraPhoto11 { 0%,100% { transform: translateY(0) rotate(-.6deg) scale(1); } 50% { transform: translateY(-2vh) rotate(.6deg) scale(1.03); } }
      .motion-slide-11 > .deck-image { animation: wordoraPhoto11 4.8s ease-in-out infinite; }
      .slide .motion-slide-11 > .deck-image { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-11 > .deck-image { animation: none; transform: none; } }
    `}</style>
    <h1 className="deck-title">ابدأ خطوتك الأولى… وكرّرها كل يوم</h1>
    <svg className="deck-image decor-star left-[2vw] top-[19vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="deck-image decor-tile right-[2vw] top-[75vh]" aria-hidden="true"/>
    <div className="decor-zigzag left-[2vw] top-[77vh]" aria-hidden="true"/>
    <div className="organic left-[1vw] top-[28vh] w-[38vw] h-[56vh]"/>
    <img src={`${base}images/journey.webp`} crossOrigin="anonymous" alt="مسار تعلّم من الكتاب إلى التواصل والإنجاز، صورة AI" className="deck-image left-[0vw] top-[25vh] w-[41vw] h-[61vh]"/>
    <div className="absolute right-[6vw] top-[28vh] w-[51vw] flex flex-col gap-[2vh]">
      <p className="deck-copy border-b border-primary/25 pb-[1.6vh]"><b className="text-primary">1.</b> اختر لغتك، وابدأ بالمستوى المتاح</p>
      <p className="deck-copy border-b border-primary/25 pb-[1.6vh]"><b className="text-primary">2.</b> تعلّم، واستمع، وجرّب النطق بنفسك</p>
      <p className="deck-copy border-b border-primary/25 pb-[1.6vh]"><b className="text-primary">3.</b> اختبر فهمك، وراجع ما يحتاج تدريبًا</p>
      <p className="deck-copy border-b border-primary/25 pb-[1.6vh]"><b className="text-primary">4.</b> واصل خطتك اليومية، وتابع إنجازك</p>
      <p className="deck-copy font-bold text-primary mt-[1vh]">كل خطوة صغيرة تقرّبك من تواصل أكثر ثقة.</p>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>11</span></div>
  </div>;
}
