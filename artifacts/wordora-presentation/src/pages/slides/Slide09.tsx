const base = import.meta.env.BASE_URL;
export default function Slide09() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-09">
    <style>{`
      @keyframes wordoraPhoto09 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-2vh) scale(1.04); } }
      .motion-slide-09 > .deck-image { animation: wordoraPhoto09 3.8s ease-in-out infinite; }
      .slide .motion-slide-09 > .deck-image { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-09 > .deck-image { animation: none; transform: none; } }
    `}</style>
    <h1 className="deck-title">GPT Ieon: رفيقك لفهم اللغة</h1>
    <svg className="deck-image decor-star left-[2vw] top-[19vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="deck-image decor-tile right-[2vw] top-[67vh]" aria-hidden="true"/>
    <div className="decor-zigzag left-[2vw] top-[75vh]" aria-hidden="true"/>
    <div className="organic-soft left-[2vw] top-[24vh] w-[43vw] h-[45vh]"/>
    <img src={`${base}images/assistant.webp`} crossOrigin="anonymous" alt="مساعد رقمي وفقاعات حوار، صورة AI" className="deck-image left-[1vw] top-[22vh] w-[44vw] h-[48vh]"/>
    <div className="absolute right-[6vw] top-[32vh] w-[46vw]">
      <p className="text-[4.4vw] font-black leading-[1.35] text-primary">اسأل بالعربية. افهم بوضوح.</p>
      <p className="deck-copy mt-[3vh]">شرح للكلمات والقواعد، وأمثلة على الاستخدام.</p>
    </div>
    <div className="absolute right-[6vw] left-[6vw] top-[74vh] grid grid-cols-3 gap-[4vw] border-t border-primary/25 pt-[2vh]">
      <p className="deck-copy">اطلب مثالًا باللغة التي تتعلّمها</p>
      <p className="deck-copy">استخدم المحادثة لدعم فهم الدرس</p>
      <p className="deck-copy">راجِع الإجابات؛ المساعد قد يخطئ.</p>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>09</span></div>
  </div>;
}
