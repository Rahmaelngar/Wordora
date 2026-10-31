const base = import.meta.env.BASE_URL;
export default function Slide12() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-12">
    <style>{`
      @keyframes wordoraPhoto12 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-1vh) rotate(0.5deg); } }
      .motion-slide-12 > .deck-image { animation: wordoraPhoto12 7s ease-in-out infinite; }
      .slide .motion-slide-12 > .deck-image { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-12 > .deck-image { animation: none; transform: none; } }
    `}</style>
    <div className="organic left-[2vw] top-[17vh] w-[43vw] h-[68vh]"/>
    <img src={`${base}images/thanks.webp`} crossOrigin="anonymous" alt="فقاعات موف ونجوم احتفالية، صورة AI" className="deck-image left-[0vw] top-[18vh] w-[48vw] h-[66vh]"/>
    <img src={`${base}images/wordora.webp`} crossOrigin="anonymous" alt="شعار Wordora" className="absolute right-[6vw] top-[5vh] w-[9vw] h-[15vh] object-contain"/>
    <div className="absolute right-[6vw] top-[25vh] w-[47vw] z-10">
      <h1 dir="ltr" className="text-right text-[4.6vw] font-black leading-[1.3] text-primary">Thank You.💜</h1>
      <p className="deck-copy mt-[3vh]">مع Wordora، كل كلمة بداية لعالم جديد</p>
      <p className="deck-copy mt-[1.5vh]">رحلتكم لتعلم اللغة تبدأ هنا</p>
      <div className="mt-[3vh]">
        <p className="flex gap-[1vw] items-baseline text-[2vw] leading-[1.5]"><span>إعداد:</span><span dir="ltr" className="font-bold">Rahma Magdy Ibrahim Elnaggar</span></p>
        <p className="text-[1.8vw] leading-[1.5] mt-[1vh]">إشراف:</p>
        <p dir="ltr" className="text-right text-[2vw] font-bold leading-[1.5]">Taha Mahmoud Metwally Nour El-Dein</p>
      </div>
    </div>
    <div className="absolute right-[6vw] bottom-[5vh] flex items-center gap-[2.4vw] z-10">
      <img src={`${base}images/replit-logo.png`} crossOrigin="anonymous" alt="Replit" className="w-[9vw] h-[6vh] object-contain"/>
      <img src={`${base}images/nordpoints.webp`} crossOrigin="anonymous" alt="Nordpoints" className="w-[16vw] h-[7vh] object-contain"/>
    </div>
    <p className="absolute left-[6vw] bottom-[4vh] text-[1.5vw] text-muted" dir="ltr">Wordora | Replit | Nordpoints</p>
  </div>;
}
