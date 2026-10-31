export default function Slide07() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame">
    <div className="organic-soft right-[3vw] top-[30vh] w-[28vw] h-[52vh]"/>
    <h1 className="deck-title">اختبارات مرتبطة بما تعلّمته</h1>
    <div className="absolute right-[6vw] left-[6vw] top-[32vh] grid grid-cols-3 gap-[4vw]">
      <div><svg className="column-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m3 6 2 2 3-4M11 6h10M3 13l2 2 3-4M11 13h10M3 20l2 2 3-4M11 20h10"/></svg><p className="deck-copy font-bold">اختيار من متعدد والترجمة الصحيحة</p></div>
      <div><svg className="column-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m10 13 4-4M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M16 8l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(1 0) scale(.9)"/></svg><p className="deck-copy font-bold">توصيل الكلمة أو العبارة بمعناها</p></div>
      <div><svg className="column-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m4 16 12-12 4 4L8 20H4ZM13 7l4 4M13 21h8"/></svg><p className="deck-copy font-bold">إكمال الجملة وكتابة الترجمة</p></div>
    </div>
    <div className="absolute right-[6vw] left-[6vw] top-[68vh] flex gap-[6vw] border-t border-primary/25 pt-[4vh]">
      <p className="deck-copy w-[45vw]">تصحيح مباشر وإظهار الإجابة الصحيحة</p>
      <p className="deck-copy w-[37vw]">نتيجة نهائية ورسالة تشجيعية</p>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>07</span></div>
  </div>;
}
