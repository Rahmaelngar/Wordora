const base = import.meta.env.BASE_URL;
export default function Slide06() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-06">
    <style>{`
      @keyframes wordoraPhoto06 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-1.7vh) scale(1.04); } }
      .motion-slide-06 > .deck-image { animation: wordoraPhoto06 3.8s ease-in-out infinite; }
      @keyframes wordoraSound06 { 0%,100% { transform: scaleY(.4); } 50% { transform: scaleY(1); } }
      .motion-slide-06 .sound-bar { animation: wordoraSound06 1.2s ease-in-out infinite; transform-origin: center; }
      .motion-slide-06 .sound-bar:nth-child(2n) { animation-delay: -.4s; }
      .motion-slide-06 .sound-bar:nth-child(3n) { animation-delay: -.8s; }
      .slide .motion-slide-06 .sound-bar { animation: none; transform: none; }
      .slide .motion-slide-06 > .deck-image { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-06 > .deck-image { animation: none; transform: none; } }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-06 .sound-bar { animation: none; transform: none; } }
    `}</style>
    <h1 className="deck-title">اسمع الكلمة… وشاهد كيف تُستخدم</h1>
    <svg className="deck-image decor-star left-[2vw] top-[20vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="deck-image decor-tile right-[2vw] top-[73vh]" aria-hidden="true"/>
    <div className="decor-zigzag right-[2vw] top-[26vh]" aria-hidden="true"/>
    <div className="organic right-[1vw] top-[26vh] w-[45vw] h-[63vh]"/>
    <img src={`${base}images/audio.webp`} crossOrigin="anonymous" alt="سماعات وتشغيل فيديو، صورة AI" className="deck-image right-[0vw] top-[25vh] w-[48vw] h-[64vh]"/>
    <div className="absolute left-[6vw] top-[32vh] w-[46vw] clean-list">
      <p>استمع إلى الكلمات والجمل باللغة المختارة</p>
      <p>أعِد الاستماع حتى يصبح النطق مألوفًا</p>
      <p>شاهد فيديو تعليميًا مرويًا عند الطلب</p>
      <p>اقرأ الجملة وترجمتها العربية مع الصوت</p>
    </div>
    <div className="absolute left-[10vw] top-[79vh] h-[7vh] flex items-center gap-[.7vw]" aria-hidden="true">
      <div className="sound-bar w-[.55vw] h-[3vh] rounded-full bg-primary"/>
      <div className="sound-bar w-[.55vw] h-[5vh] rounded-full bg-[#b17adf]"/>
      <div className="sound-bar w-[.55vw] h-[7vh] rounded-full bg-primary"/>
      <div className="sound-bar w-[.55vw] h-[4vh] rounded-full bg-[#b17adf]"/>
      <div className="sound-bar w-[.55vw] h-[6vh] rounded-full bg-primary"/>
      <div className="sound-bar w-[.55vw] h-[3vh] rounded-full bg-[#b17adf]"/>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>06</span></div>
  </div>;
}
