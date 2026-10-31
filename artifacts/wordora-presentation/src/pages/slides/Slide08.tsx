const base = import.meta.env.BASE_URL;
export default function Slide08() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-08">
    <style>{`
      @keyframes wordoraPhoto08 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-1vh) rotate(0.4deg); } }
      .motion-slide-08 > .deck-image { animation: wordoraPhoto08 7.5s ease-in-out infinite; }
      .slide .motion-slide-08 > .deck-image { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-08 > .deck-image { animation: none; transform: none; } }
    `}</style>
    <h1 className="deck-title">خطة يومية تساعدك على الاستمرار</h1>
    <div className="organic left-[1vw] top-[28vh] w-[45vw] h-[59vh]"/>
    <img src={`${base}images/daily.webp`} crossOrigin="anonymous" alt="تقويم يومي وكأس إنجاز، صورة AI" className="deck-image left-[0vw] top-[26vh] w-[47vw] h-[62vh]"/>
    <div className="absolute right-[6vw] top-[28vh] w-[46vw] clean-list">
      <p>هدف يومي قابل للتعديل</p>
      <p>درس مقترح وكلمات للمراجعة</p>
      <p>تتبّع أيام الاستمرار في التعلّم</p>
      <p>نقاط وشارات مرتبطة بإنجاز حقيقي</p>
      <p>إعادة الاختبار لا تمنح مكافآت متكررة بلا حدود</p>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>08</span></div>
  </div>;
}
