const base = import.meta.env.BASE_URL;
export default function Slide02() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame">
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
