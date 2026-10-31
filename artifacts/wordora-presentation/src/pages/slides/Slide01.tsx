const base = import.meta.env.BASE_URL;
export default function Slide01() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-01">
    <style>{`
      @keyframes wordoraLogoScale01 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-1vh) scale(1.065); } }
      @keyframes wordoraSpark01 { 0%,100% { transform: rotate(-6deg) scale(1); } 50% { transform: rotate(12deg) scale(1.15); } }
      .motion-slide-01 .wordora-cover-logo { animation: wordoraLogoScale01 3.8s ease-in-out infinite; }
      .motion-slide-01 .decor-star,.motion-slide-01 .decor-tile { animation: wordoraSpark01 3s ease-in-out infinite; }
      .motion-slide-01 .wordora-cover-static { display: none; }
      .slide .motion-slide-01 .wordora-cover-animated { display: none; }
      .slide .motion-slide-01 .wordora-cover-static { display: block; }
      .slide .motion-slide-01 .wordora-cover-logo,.slide .motion-slide-01 .decor-star,.slide .motion-slide-01 .decor-tile { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print {
        .motion-slide-01 .wordora-cover-logo,.motion-slide-01 .decor-star,.motion-slide-01 .decor-tile { animation: none; transform: none; }
        .motion-slide-01 .wordora-cover-animated { display: none; }
        .motion-slide-01 .wordora-cover-static { display: block; }
      }
    `}</style>
    <svg className="decor-star left-[22vw] top-[22vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <svg className="decor-star right-[23vw] top-[67vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="decor-tile right-[18vw] top-[23vh]" aria-hidden="true"/>
    <div className="decor-zigzag left-[24vw] top-[71vh]" aria-hidden="true"/>
    <div className="absolute inset-x-0 top-[7vh] h-[68vh] flex items-center justify-center">
      <img src={`${base}images/wordora-logo-animated.svg`} crossOrigin="anonymous" alt="لوجو Wordora متحرك بخلفية شفافة" className="wordora-cover-logo wordora-cover-animated w-[48vw] h-[66vh] object-contain"/>
      <img src={`${base}images/wordora-vector.svg`} crossOrigin="anonymous" alt="لوجو Wordora متجهي بخلفية شفافة" className="wordora-cover-logo wordora-cover-static w-[48vw] h-[66vh] object-contain"/>
    </div>
    <div className="absolute inset-x-0 bottom-[16vh] z-10 flex flex-col items-center gap-[.3vh] text-center">
      <p className="cover-supervisor-label">إشراف</p>
      <p dir="ltr" className="cover-supervisor-name">Taha Mahmoud Metwally Nour El-Dein</p>
    </div>
    <div className="absolute inset-x-[15vw] bottom-[7vh] flex items-center justify-center gap-[5vw]">
      <img src={`${base}images/replit-logo.png`} crossOrigin="anonymous" alt="Replit" className="w-[13vw] h-[7vh] object-contain"/>
      <img src={`${base}images/nordpoints.webp`} crossOrigin="anonymous" alt="Nordpoints" className="w-[21vw] h-[7vh] object-contain"/>
    </div>
  </div>;
}
