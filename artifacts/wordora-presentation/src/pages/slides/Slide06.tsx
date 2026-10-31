const base = import.meta.env.BASE_URL;
export default function Slide06() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-06">
    <style>{`
      @keyframes wordoraPhoto06 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-0.8vh) scale(1.01); } }
      .motion-slide-06 > .deck-image { animation: wordoraPhoto06 6s ease-in-out infinite; }
      .slide .motion-slide-06 > .deck-image { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-06 > .deck-image { animation: none; transform: none; } }
    `}</style>
    <h1 className="deck-title">اسمع النطق وشاهد الاستخدام</h1>
    <div className="organic right-[1vw] top-[26vh] w-[45vw] h-[63vh]"/>
    <img src={`${base}images/audio.webp`} crossOrigin="anonymous" alt="سماعات وتشغيل فيديو، صورة AI" className="deck-image right-[0vw] top-[25vh] w-[48vw] h-[64vh]"/>
    <div className="absolute left-[6vw] top-[32vh] w-[46vw] clean-list">
      <p>صوت باللغة المختارة للكلمات والجمل</p>
      <p>إعادة الاستماع حسب الحاجة</p>
      <p>فيديو تعليمي مروي يُنشأ عند الطلب</p>
      <p>الجملة ومعناها بالعربي ظاهران أثناء التعلّم</p>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>06</span></div>
  </div>;
}
