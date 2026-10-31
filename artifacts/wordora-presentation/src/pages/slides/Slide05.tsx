const base = import.meta.env.BASE_URL;
export default function Slide05() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-05">
    <style>{`
      @keyframes wordoraPhoto05 { 0%,100% { transform: translateY(0) rotate(-1deg) scale(1); } 50% { transform: translateY(-2vh) rotate(.8deg) scale(1.025); } }
      .motion-slide-05 > .deck-image { animation: wordoraPhoto05 4.2s ease-in-out infinite; }
      .slide .motion-slide-05 > .deck-image { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-05 > .deck-image { animation: none; transform: none; } }
    `}</style>
    <h1 className="deck-title">كلمة واحدة. تركيز أكبر. تعلّم أعمق.</h1>
    <svg className="deck-image decor-star left-[2vw] top-[19vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="deck-image decor-tile right-[2vw] top-[73vh]" aria-hidden="true"/>
    <div className="decor-zigzag left-[2vw] top-[75vh]" aria-hidden="true"/>
    <div className="organic-soft left-[2vw] top-[27vh] w-[44vw] h-[59vh]"/>
    <img src={`${base}images/lesson.webp`} crossOrigin="anonymous" alt="بطاقة تعلّم وكتاب، صورة AI" className="deck-image left-[0vw] top-[26vh] w-[47vw] h-[63vh]"/>
    <div className="absolute right-[6vw] top-[28vh] w-[46vw] clean-list">
      <p>كلمة أو جملة واحدة، ومعناها بالعربي</p>
      <p>نطق مبسّط ومثال مترجم يوضّح الاستخدام</p>
      <p>تنقّل سهل ومؤشر يوضّح مكانك في الدرس</p>
      <p>احفظ العناصر التي تريد مراجعتها</p>
      <p>عُد إلى آخر نقطة حُفظت في الدرس</p>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>05</span></div>
  </div>;
}
