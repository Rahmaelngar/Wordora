const base = import.meta.env.BASE_URL;
export default function Slide08() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame">
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
    <p className="image-credit">صورة مولّدة بالذكاء الاصطناعي</p>
    <div className="deck-footer"><span>Wordora</span><span>08</span></div>
  </div>;
}
