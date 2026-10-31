export default function Slide07() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-07">
    <style>{`
      @keyframes quizSpark07 { 0%,100% { transform: rotate(-8deg) scale(1); } 50% { transform: rotate(12deg) scale(1.15); } }
      .motion-slide-07 .decor-star,.motion-slide-07 .decor-tile { animation: quizSpark07 3s ease-in-out infinite; }
      .slide .motion-slide-07 .decor-star,.slide .motion-slide-07 .decor-tile { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-07 .decor-star,.motion-slide-07 .decor-tile { animation: none; transform: none; } }
    `}</style>
    <h1 className="deck-title">اختبر فهمك… وتعلّم من أخطائك</h1>
    <svg className="decor-star left-[2vw] top-[19vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="decor-tile right-[2vw] top-[73vh]" aria-hidden="true"/>
    <div className="decor-zigzag left-[2vw] top-[76vh]" aria-hidden="true"/>
    <div className="absolute right-[6vw] left-[6vw] top-[32vh] grid grid-cols-3 gap-[4vw]">
      <div className="flex flex-col items-center text-center">
        <svg className="column-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m3 6 2 2 3-4M11 6h10M3 13l2 2 3-4M11 13h10M3 20l2 2 3-4M11 20h10"/></svg>
        <p className="deck-copy font-bold mt-[1vh]">اختيار من متعدّد والترجمة الصحيحة</p>
      </div>
      <div className="flex flex-col items-center text-center">
        <svg className="column-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m10 13 4-4M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M16 8l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(1 0) scale(.9)"/></svg>
        <p className="deck-copy font-bold mt-[1vh]">توصيل الكلمة أو العبارة بمعناها</p>
      </div>
      <div className="flex flex-col items-center text-center">
        <svg className="column-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m4 16 12-12 4 4L8 20H4ZM13 7l4 4M13 21h8"/></svg>
        <p className="deck-copy font-bold mt-[1vh]">إكمال الجملة وكتابة الترجمة</p>
      </div>
    </div>
    <div className="absolute right-[6vw] left-[6vw] top-[68vh] flex gap-[6vw] border-t border-primary/25 pt-[4vh]">
      <p className="deck-copy w-[45vw]">تصحيح فوري وإظهار الإجابة الصحيحة عند الخطأ</p>
      <p className="deck-copy w-[37vw]">نتيجة واضحة ورسالة تشجيعية</p>
    </div>
    <div className="deck-footer"><span>Wordora</span><span>07</span></div>
  </div>;
}
