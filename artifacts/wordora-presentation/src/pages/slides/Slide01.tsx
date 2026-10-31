const base = import.meta.env.BASE_URL;
export default function Slide01() {
  return <div className="w-screen h-screen overflow-hidden relative wordora-frame">
    <svg className="decor-star left-[22vw] top-[22vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <svg className="decor-star right-[23vw] top-[67vh]" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 0 40 24 64 32 40 40 32 64 24 40 0 32 24 24Z" fill="currentColor"/></svg>
    <div className="decor-tile right-[18vw] top-[23vh]" aria-hidden="true"/>
    <div className="decor-zigzag left-[24vw] top-[71vh]" aria-hidden="true"/>
    <div className="absolute inset-x-0 top-[7vh] h-[68vh] flex items-center justify-center">
      <img src={`${base}images/wordora-vector.svg`} crossOrigin="anonymous" alt="لوجو Wordora متجهي بخلفية شفافة" className="w-[48vw] h-[66vh] object-contain"/>
    </div>
    <div className="absolute inset-x-[15vw] bottom-[7vh] flex items-center justify-center gap-[5vw]">
      <img src={`${base}images/replit-logo.png`} crossOrigin="anonymous" alt="Replit" className="w-[13vw] h-[7vh] object-contain"/>
      <img src={`${base}images/nordpoints.webp`} crossOrigin="anonymous" alt="Nordpoints" className="w-[21vw] h-[7vh] object-contain"/>
    </div>
  </div>;
}
