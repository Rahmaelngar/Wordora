const base = import.meta.env.BASE_URL;
export default function Slide12() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame">
    <div className="organic left-[2vw] top-[17vh] w-[43vw] h-[68vh]"/>
    <img src={`${base}images/thanks.webp`} crossOrigin="anonymous" alt="فقاعات موف ونجوم احتفالية، صورة AI" className="deck-image left-[0vw] top-[18vh] w-[48vw] h-[66vh]"/>
    <img src={`${base}images/wordora.webp`} crossOrigin="anonymous" alt="شعار Wordora" className="absolute right-[6vw] top-[5vh] w-[9vw] h-[15vh] object-contain"/>
    <div className="absolute right-[6vw] top-[25vh] w-[47vw] z-10">
      <h1 className="text-[4.6vw] font-black leading-[1.3] text-primary">شكرًا لحسن استماعكم</h1>
      <p className="deck-copy mt-[3vh]">مع Wordora، كل كلمة بداية لعالم جديد</p>
      <div className="mt-[4vh]">
        <p className="credit-line"><span>إعداد:</span><span dir="ltr">Rahma magdy elngar</span></p>
        <p className="text-[1.5vw] leading-[1.7] mt-[1vh]">إشراف:</p>
        <p dir="ltr" className="text-right text-[1.6vw] leading-[1.7]">Taha Mahmoud Metwally Nour El-Dein</p>
      </div>
      <p className="text-[2vw] font-bold mt-[3vh]">أسئلتكم وملاحظاتكم</p>
    </div>
    <div className="absolute right-[6vw] bottom-[5vh] flex items-center gap-[2.4vw] z-10">
      <img src={`${base}images/replit-logo.png`} crossOrigin="anonymous" alt="Replit" className="w-[9vw] h-[6vh] object-contain"/>
      <img src={`${base}images/nordpoints.webp`} crossOrigin="anonymous" alt="Nordpoints" className="w-[16vw] h-[7vh] object-contain"/>
    </div>
    <p className="absolute left-[6vw] bottom-[4vh] text-[1.5vw] text-muted" dir="ltr">Wordora | Replit | Nordpoints</p>
  </div>;
}
