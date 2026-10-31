const base = import.meta.env.BASE_URL;
export default function Slide08() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-08">
    <style>{`
      @keyframes wordoraPhoto08 { 0%,100% { transform: translateY(0) rotate(-.7deg) scale(1); } 50% { transform: translateY(-2vh) rotate(.7deg) scale(1.03); } }
      .motion-slide-08 > .deck-image { animation: wordoraPhoto08 4.4s ease-in-out infinite; }
      .slide .motion-slide-08 > .deck-image { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-08 > .deck-image { animation: none; transform: none; } }
    `}</style>
    <h1 className="deck-title">قليل كل يوم… تقدّم يستمر</h1>
    <svg className="deck-image decor-star left-[2vw] top-[19vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="deck-image decor-tile right-[2vw] top-[75vh]" aria-hidden="true"/>
    <div className="decor-zigzag left-[2vw] top-[76vh]" aria-hidden="true"/>
    <div className="organic left-[1vw] top-[28vh] w-[45vw] h-[59vh]"/>
    <img src={`${base}images/daily.webp`} crossOrigin="anonymous" alt="تقويم يومي وكأس إنجاز، صورة AI" className="deck-image left-[0vw] top-[26vh] w-[47vw] h-[62vh]"/>
    <div className="absolute right-[6vw] top-[28vh] w-[46vw] clean-list">
      <p>حدّد هدفًا يوميًا تقدر على الالتزام به</p>
      <p>ابدأ بدرس، ثم راجع بعض الكلمات</p>
      <p>تابع سلسلة أيام التعلّم</p>
      <p>اجمع نقاطًا وشارات بإنجاز حقيقي</p>
      <p>مكافآت عادلة، بلا زيادة مفتوحة عند إعادة الاختبار</p>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>08</span></div>
  </div>;
}
