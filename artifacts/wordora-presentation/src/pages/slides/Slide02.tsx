const base = import.meta.env.BASE_URL;
export default function Slide02() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-02">
    <style>{`
      @keyframes wordoraPhoto02 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-1vh) rotate(-0.4deg); } }
      .motion-slide-02 > .deck-image { animation: wordoraPhoto02 7s ease-in-out infinite; }
      .slide .motion-slide-02 > .deck-image { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-02 > .deck-image { animation: none; transform: none; } }
    `}</style>
    <h1 className="deck-title">من أين نبدأ تعلّم لغة جديدة؟</h1>
    <div className="organic-soft left-[2vw] top-[30vh] w-[43vw] h-[57vh]"/>
    <img src={`${base}images/problem.webp`} crossOrigin="anonymous" alt="طالبة تبحث عن بداية منظّمة، صورة AI" className="deck-image left-[1vw] top-[27vh] w-[46vw] h-[62vh]"/>
    <div className="absolute right-[6vw] top-[32vh] w-[46vw] clean-list">
      <p>محتوى متفرّق يصعب تنظيمه</p>
      <p>حفظ كلمات بلا استخدام في جمل</p>
      <p>صعوبة الاستمرار دون خطة واضحة</p>
      <p>الحاجة إلى شرح عربي وتجربة سهلة</p>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>02</span></div>
  </div>;
}
