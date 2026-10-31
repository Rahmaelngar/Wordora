const base = import.meta.env.BASE_URL;
export default function Slide03() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame motion-slide-03">
    <style>{`
      @keyframes wordoraPhoto03 { 0%,100% { transform: translateY(0) rotate(-1deg) scale(1); } 50% { transform: translateY(-2vh) rotate(1deg) scale(1.035); } }
      .motion-slide-03 > .deck-image { animation: wordoraPhoto03 5s ease-in-out infinite; }
      .motion-slide-03 .language-friend-card .friend-pair { animation: wordoraPhoto03 5s ease-in-out infinite; }
      .motion-slide-03 .language-friend-card:nth-child(even) .friend-pair { animation-delay: -2.5s; }
      .slide .motion-slide-03 > .deck-image { animation: none; transform: none; }
      .slide .motion-slide-03 .language-friend-card .friend-pair { animation: none; transform: none; }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-03 > .deck-image { animation: none; transform: none; } }
      @media (prefers-reduced-motion: reduce), print { .motion-slide-03 .language-friend-card .friend-pair { animation: none; transform: none; } }
    `}</style>
    <h1 className="deck-title">ست لغات… وبداية تناسبك</h1>
    <svg className="deck-image decor-star left-[2vw] top-[20vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="deck-image decor-tile right-[2vw] top-[75vh]" aria-hidden="true"/>
    <p className="absolute right-[6vw] left-[6vw] top-[22vh] deck-copy">شرح عربي، ومحتوى متدرّج، وتجربة ترافقك على الموبايل والكمبيوتر.</p>
    <div className="absolute right-[6vw] left-[6vw] top-[33vh] flex gap-[1vw]" dir="ltr">
      <div className="language-friend-card">
        <div className="friend-pair h-[32vh]"><img src={`${base}images/language-friends/english-animated.svg`} alt="شخصية الإنجليزية" className="friend-live" crossOrigin="anonymous"/><img src={`${base}images/language-friends/english.svg`} alt="شخصية الإنجليزية" className="friend-still" crossOrigin="anonymous"/></div>
        <p className="text-[1.65vw] font-bold leading-[1.6]" dir="rtl">الإنجليزية</p><p className="text-[1.5vw] leading-[1.5] text-primary">English</p>
      </div>
      <div className="language-friend-card">
        <div className="friend-pair h-[32vh]"><img src={`${base}images/language-friends/french-animated.svg`} alt="شخصية الفرنسية" className="friend-live" crossOrigin="anonymous"/><img src={`${base}images/language-friends/french.svg`} alt="شخصية الفرنسية" className="friend-still" crossOrigin="anonymous"/></div>
        <p className="text-[1.65vw] font-bold leading-[1.6]" dir="rtl">الفرنسية</p><p className="text-[1.5vw] leading-[1.5] text-primary">French</p>
      </div>
      <div className="language-friend-card">
        <div className="friend-pair h-[32vh]"><img src={`${base}images/language-friends/spanish-animated.svg`} alt="شخصية الإسبانية" className="friend-live" crossOrigin="anonymous"/><img src={`${base}images/language-friends/spanish.svg`} alt="شخصية الإسبانية" className="friend-still" crossOrigin="anonymous"/></div>
        <p className="text-[1.65vw] font-bold leading-[1.6]" dir="rtl">الإسبانية</p><p className="text-[1.5vw] leading-[1.5] text-primary">Spanish</p>
      </div>
      <div className="language-friend-card">
        <div className="friend-pair h-[32vh]"><img src={`${base}images/language-friends/german-animated.svg`} alt="شخصية الألمانية" className="friend-live" crossOrigin="anonymous"/><img src={`${base}images/language-friends/german.svg`} alt="شخصية الألمانية" className="friend-still" crossOrigin="anonymous"/></div>
        <p className="text-[1.65vw] font-bold leading-[1.6]" dir="rtl">الألمانية</p><p className="text-[1.5vw] leading-[1.5] text-primary">German</p>
      </div>
      <div className="language-friend-card">
        <div className="friend-pair h-[32vh]"><img src={`${base}images/language-friends/italian-animated.svg`} alt="شخصية الإيطالية" className="friend-live" crossOrigin="anonymous"/><img src={`${base}images/language-friends/italian.svg`} alt="شخصية الإيطالية" className="friend-still" crossOrigin="anonymous"/></div>
        <p className="text-[1.65vw] font-bold leading-[1.6]" dir="rtl">الإيطالية</p><p className="text-[1.5vw] leading-[1.5] text-primary">Italian</p>
      </div>
      <div className="language-friend-card">
        <div className="friend-pair h-[32vh]"><img src={`${base}images/language-friends/turkish-animated.svg`} alt="شخصية التركية" className="friend-live" crossOrigin="anonymous"/><img src={`${base}images/language-friends/turkish.svg`} alt="شخصية التركية" className="friend-still" crossOrigin="anonymous"/></div>
        <p className="text-[1.65vw] font-bold leading-[1.6]" dir="rtl">التركية</p><p className="text-[1.5vw] leading-[1.5] text-primary">Turkish</p>
      </div>
    </div>
    <p className="absolute right-[6vw] left-[6vw] top-[84vh] text-center text-[1.9vw] font-bold text-primary">اختر لغة واحدة، وابدأ بخطوة صغيرة.</p>
    <div className="deck-footer"><span>Wordora</span><span>03</span></div>
  </div>;
}
