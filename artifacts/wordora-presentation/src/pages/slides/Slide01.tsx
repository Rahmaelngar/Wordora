const base = import.meta.env.BASE_URL;
export default function Slide01() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame">
    <div className="organic left-[1vw] top-[12vh] w-[47vw] h-[76vh]"/>
    <div className="organic-soft right-[62vw] top-[8vh] w-[30vw] h-[30vh]"/>
    <img src={`${base}images/cover-logo.webp`} crossOrigin="anonymous" alt="لوجو Wordora المرفق" className="deck-image left-[4vw] top-[17vh] w-[42vw] h-[66vh]"/>
    <div className="absolute right-[6vw] top-[24vh] w-[47vw] z-10">
      <h1 className="font-display text-[4.3vw] font-black leading-[1.22] text-primary">Wordora — الكلمات تفتح عوالم جديدة</h1>
      <p dir="ltr" className="text-right text-[2vw] leading-[1.6] mt-[3vh]">Learn a New Language. Open a New World.</p>
      <div className="mt-[4vh]">
        <p className="credit-line"><span>إعداد:</span><span dir="ltr">Rahma magdy elngar</span></p>
        <p className="text-[1.5vw] leading-[1.7] mt-[1vh]">إشراف:</p>
        <p dir="ltr" className="text-right text-[1.6vw] leading-[1.7]">Taha Mahmoud Metwally Nour El-Dein</p>
      </div>
    </div>
    <div className="absolute right-[6vw] bottom-[5vh] flex items-center gap-[2.4vw] z-10">
      <img src={`${base}images/replit-logo.png`} crossOrigin="anonymous" alt="Replit" className="w-[9vw] h-[6vh] object-contain"/>
      <img src={`${base}images/nordpoints.webp`} crossOrigin="anonymous" alt="Nordpoints" className="w-[16vw] h-[7vh] object-contain"/>
    </div>
    <p className="absolute left-[6vw] bottom-[4vh] text-[1.5vw] text-muted" dir="ltr">Wordora | Replit | Nordpoints</p>
  </div>;
}
