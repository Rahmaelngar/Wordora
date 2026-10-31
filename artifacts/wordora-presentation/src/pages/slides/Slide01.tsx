const base = import.meta.env.BASE_URL;
export default function Slide01() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame">
    <style>{`
      @keyframes wordoraLogoScale01 { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
      .wordora-cover-logo { animation: wordoraLogoScale01 7s ease-in-out infinite; }
      .slide .wordora-cover-logo { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .wordora-cover-logo { animation: none; transform: none; } }
    `}</style>
    <div className="absolute inset-x-0 top-[7vh] h-[68vh] flex items-center justify-center">
      <img src={`${base}images/wordora.webp`} crossOrigin="anonymous" alt="لوجو Wordora بدقته الأصلية وبدون خلفية" className="wordora-cover-logo w-[48vw] h-[66vh] object-contain"/>
    </div>
    <div className="absolute inset-x-[15vw] bottom-[7vh] flex items-center justify-center gap-[5vw]">
      <img src={`${base}images/replit-logo.png`} crossOrigin="anonymous" alt="Replit" className="w-[13vw] h-[7vh] object-contain"/>
      <img src={`${base}images/nordpoints.webp`} crossOrigin="anonymous" alt="Nordpoints" className="w-[21vw] h-[7vh] object-contain"/>
    </div>
  </div>;
}
