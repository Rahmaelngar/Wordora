const base = import.meta.env.BASE_URL;
export default function Slide01() {
  return <div className="w-screen h-screen overflow-hidden relative bg-[#fdfcfe] flex items-center justify-center">
    <img src={`${base}images/cover-logo.webp`} crossOrigin="anonymous" alt="لوجو Wordora" className="w-[48vw] h-[72vh] object-contain"/>
  </div>;
}
