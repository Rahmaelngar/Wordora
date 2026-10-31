const base = import.meta.env.BASE_URL;
export default function Slide03() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-03">
    <style>{`
      @keyframes wordoraPhoto03 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-1.2vh) rotate(0.6deg); } }
      .motion-slide-03 > .deck-image { animation: wordoraPhoto03 8s ease-in-out infinite; }
      .slide .motion-slide-03 > .deck-image { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-03 > .deck-image { animation: none; transform: none; } }
    `}</style>
    <h1 className="deck-title">Wordora: رحلة تعلّم واضحة وممتعة</h1>
    <div className="organic left-[1vw] top-[25vh] w-[45vw] h-[63vh]"/>
    <img src={`${base}images/globe.webp`} crossOrigin="anonymous" alt="كرة أرضية وفقاعات محادثة، صورة AI" className="deck-image left-[0vw] top-[24vh] w-[48vw] h-[64vh]"/>
    <div className="absolute right-[6vw] top-[31vh] w-[46vw]">
      <p className="text-[2.5vw] font-bold leading-[1.55]">منصة لتعلّم اللغات بشرح عربي</p>
      <div className="mt-[5vh] py-[3vh] border-y border-primary/25 text-[2.3vw] leading-[1.9]">
        <p>الإنجليزية • الفرنسية • الإسبانية</p>
        <p>الألمانية • الإيطالية • التركية</p>
      </div>
      <p className="deck-copy mt-[4vh]">تصميم متجاوب للموبايل والكمبيوتر</p>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>03</span></div>
  </div>;
}
