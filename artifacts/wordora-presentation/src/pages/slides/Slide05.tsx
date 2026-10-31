const base = import.meta.env.BASE_URL;
export default function Slide05() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-05">
    <style>{`
      @keyframes wordoraPhoto05 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-1vh) rotate(-0.5deg); } }
      .motion-slide-05 > .deck-image { animation: wordoraPhoto05 6.5s ease-in-out infinite; }
      .slide .motion-slide-05 > .deck-image { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-05 > .deck-image { animation: none; transform: none; } }
    `}</style>
    <h1 className="deck-title">ركّز على عنصر واحد في كل مرة</h1>
    <div className="organic-soft left-[2vw] top-[27vh] w-[44vw] h-[59vh]"/>
    <img src={`${base}images/lesson.webp`} crossOrigin="anonymous" alt="بطاقة تعلّم وكتاب، صورة AI" className="deck-image left-[0vw] top-[26vh] w-[47vw] h-[63vh]"/>
    <div className="absolute right-[6vw] top-[28vh] w-[46vw] clean-list">
      <p>كلمة أو جملة واضحة مع معناها بالعربي</p>
      <p>طريقة نطق مبسّطة ومثال مترجم</p>
      <p>التالي والسابق ومؤشر لتقدّم الدرس</p>
      <p>حفظ العناصر للعودة إليها في المراجعة</p>
      <p>استكمال الدرس من آخر نقطة محفوظة</p>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>05</span></div>
  </div>;
}
