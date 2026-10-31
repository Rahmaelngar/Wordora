const base = import.meta.env.BASE_URL;
export default function Slide09() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame">
    <h1 className="deck-title">GPT Ieon: مساعدك التعليمي</h1>
    <div className="organic-soft left-[2vw] top-[24vh] w-[43vw] h-[45vh]"/>
    <img src={`${base}images/assistant.webp`} crossOrigin="anonymous" alt="مساعد رقمي وفقاعات حوار، صورة AI" className="deck-image left-[1vw] top-[22vh] w-[44vw] h-[48vh]"/>
    <div className="absolute right-[6vw] top-[32vh] w-[46vw]">
      <p className="text-[4.4vw] font-black leading-[1.35] text-primary">اسأل بالعربية عن كلمة أو قاعدة</p>
    </div>
    <div className="absolute right-[6vw] left-[6vw] top-[74vh] grid grid-cols-3 gap-[4vw] border-t border-primary/25 pt-[2vh]">
      <p className="deck-copy">اطلب شرحًا أو مثالًا باللغة التي تتعلّمها</p>
      <p className="deck-copy">استخدم المحادثة لدعم فهم الدرس</p>
      <p className="deck-copy">راجع الإجابات بعناية؛ المساعد قد يخطئ</p>
    </div>
    <p className="absolute left-[6vw] top-[68vh] text-[1.5vw] text-muted">صورة مولّدة بالذكاء الاصطناعي</p>
    <div className="deck-footer"><span>Wordora</span><span>09</span></div>
  </div>;
}
