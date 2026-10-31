const base = import.meta.env.BASE_URL;
export default function Slide12() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame">
    <svg className="deck-image decor-star left-[2vw] top-[17vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="deck-image decor-tile right-[2vw] top-[79vh]" aria-hidden="true"/>
    <div className="decor-zigzag left-[2vw] top-[79vh]" aria-hidden="true"/>
    <div className="organic left-[2vw] top-[17vh] w-[43vw] h-[68vh]"/>
    <img src={`${base}images/thanks.webp`} crossOrigin="anonymous" alt="فقاعات موف ونجوم احتفالية، صورة AI" className="deck-image left-[0vw] top-[18vh] w-[48vw] h-[66vh]"/>
    <div className="friend-pair absolute left-[4vw] top-[57vh] w-[12vw] h-[30vh] z-[2]">
      <img src={`${base}images/language-friends/spanish.svg`} alt="رفيق الإسبانية يحيّي الجمهور" crossOrigin="anonymous"/>
    </div>
    <div className="friend-pair absolute left-[28vw] top-[57vh] w-[12vw] h-[30vh] z-[2]">
      <img src={`${base}images/language-friends/french.svg`} alt="رفيقة الفرنسية تحيّي الجمهور" crossOrigin="anonymous"/>
    </div>
    <img src={`${base}images/wordora-vector.svg`} crossOrigin="anonymous" alt="شعار Wordora المتجهي" className="absolute right-[6vw] top-[5vh] w-[9vw] h-[15vh] object-contain"/>
    <div className="absolute right-[6vw] top-[25vh] w-[47vw] z-10">
      <h1 dir="ltr" className="text-right text-[4.6vw] font-black leading-[1.3] text-primary">Thank You.💜</h1>
      <p className="deck-copy mt-[3vh]">مع Wordora، كل كلمة بداية لعالم جديد</p>
      <p className="deck-copy mt-[1.5vh]">رحلتكم لتعلم اللغة تبدأ هنا</p>
      <div className="mt-[3vh]">
        <div className="closing-credit-block">
          <p className="closing-credit-label">إعداد</p>
          <p dir="ltr" className="closing-credit-name">Rahma Magdy Ibrahim Elnaggar</p>
        </div>
        <div className="closing-credit-block">
          <p className="closing-credit-label">إشراف</p>
          <p dir="ltr" className="closing-credit-name">Taha Mahmoud Metwally Nour El-Dein</p>
        </div>
      </div>
    </div>
    <div className="absolute right-[6vw] bottom-[5vh] flex items-center gap-[2.4vw] z-10">
      <img src={`${base}images/replit-logo.png`} crossOrigin="anonymous" alt="Replit" className="w-[9vw] h-[6vh] object-contain"/>
      <img src={`${base}images/nordpoints.webp`} crossOrigin="anonymous" alt="Nordpoints" className="w-[16vw] h-[7vh] object-contain"/>
    </div>
    <p className="absolute left-[6vw] bottom-[4vh] text-[1.5vw] text-muted" dir="ltr">Wordora | Replit | Nordpoints</p>
  </div>;
}
