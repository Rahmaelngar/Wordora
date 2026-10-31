const base = import.meta.env.BASE_URL;
export default function Slide11() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame">
    <h1 className="deck-title">رحلة بسيطة من البداية إلى الإنجاز</h1>
    <div className="organic left-[1vw] top-[28vh] w-[38vw] h-[56vh]"/>
    <img src={`${base}images/journey.webp`} crossOrigin="anonymous" alt="مسار تعلّم من الكتاب إلى التواصل والإنجاز، صورة AI" className="deck-image left-[0vw] top-[25vh] w-[41vw] h-[61vh]"/>
    <div className="absolute right-[6vw] top-[28vh] w-[51vw] flex flex-col gap-[2vh]">
      <p className="deck-copy border-b border-primary/25 pb-[1.6vh]"><b className="text-primary">1.</b> اختر لغتك ومستواك المتاح</p>
      <p className="deck-copy border-b border-primary/25 pb-[1.6vh]"><b className="text-primary">2.</b> تعلّم كلمة أو جملة واستمع إليها</p>
      <p className="deck-copy border-b border-primary/25 pb-[1.6vh]"><b className="text-primary">3.</b> اختبر فهمك وراجع أخطاءك</p>
      <p className="deck-copy border-b border-primary/25 pb-[1.6vh]"><b className="text-primary">4.</b> تابع خطتك اليومية وشاهد تقدّمك</p>
      <p className="deck-copy font-bold text-primary mt-[1vh]">خطوات صغيرة ومتواصلة نحو تواصل أكثر ثقة</p>
    </div>
    <p className="image-credit">صورة مولّدة بالذكاء الاصطناعي</p>
    <div className="deck-footer"><span>Wordora</span><span>11</span></div>
  </div>;
}
