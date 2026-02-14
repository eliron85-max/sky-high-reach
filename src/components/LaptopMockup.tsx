import React, { useRef, useEffect, useState } from "react";

const LaptopMockup: React.FC = () => {
  const desktopRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  const [desktopVisible, setDesktopVisible] = useState(false);
  const [laptopVisible, setLaptopVisible] = useState(false);
  const [tabletVisible, setTabletVisible] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === desktopRef.current) setDesktopVisible(true);
            if (entry.target === laptopRef.current) setLaptopVisible(true);
            if (entry.target === tabletRef.current) setTabletVisible(true);
            if (entry.target === phoneRef.current) setPhoneVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    [desktopRef, laptopRef, tabletRef, phoneRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full py-20 sm:py-28 lg:py-36 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] overflow-hidden">
      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
          "linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px"
        }} />

      {/* Title */}
      <div className="relative z-10 text-center mb-12 sm:mb-16 px-4">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          style={{ fontFamily: "'Heebo', sans-serif" }}>
          האתר שלנו{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#c9a84c] to-[#e8d5a3]">
            בפעולה
          </span>
        </h2>
        <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto" style={{ fontFamily: "'Heebo', sans-serif" }}>
          חווית משתמש מתקדמת בכל מכשיר
        </p>
      </div>

      {/* Row 1: Desktop monitor */}
      <div className="relative z-10 flex justify-center px-4 mb-10 sm:mb-14">
        <div
          ref={desktopRef}
          className="w-full max-w-[900px] transition-all duration-1000 ease-out"
          style={{
            opacity: desktopVisible ? 1 : 0,
            transform: desktopVisible ? "translateY(0)" : "translateY(80px)"
          }}>
          {/* iMac-style screen */}
          <div className="relative bg-[#1c1c1c] rounded-2xl border border-[#333] p-[8px] sm:p-[12px] shadow-[0_0_100px_rgba(201,168,76,0.18)]">
            <div className="absolute top-[10px] sm:top-[14px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#333] border border-[#444]" />
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mt-3 sm:mt-4">
              <video src="/hero.webm" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Stand */}
          <div className="flex flex-col items-center">
            <div className="w-16 sm:w-20 h-12 sm:h-16 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border-x border-[#333]" />
            <div
              className="w-32 sm:w-44 h-3 sm:h-4 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-b-lg border border-t-0 border-[#333]"
              style={{ clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)" }} />
          </div>
          <div className="w-[70%] mx-auto h-3 bg-black/40 rounded-[50%] blur-md mt-1" />
        </div>
      </div>

      {/* Row 2: Laptop, Tablet, Phone */}
      <div className="relative z-10 flex items-end justify-center gap-4 sm:gap-8 lg:gap-12 px-4">
        {/* Laptop mockup */}
        <div
          ref={laptopRef}
          className="hidden md:block w-full max-w-[500px] lg:max-w-[550px] transition-all duration-1000 ease-out"
          style={{
            opacity: laptopVisible ? 1 : 0,
            transform: laptopVisible ? "translateY(0)" : "translateY(80px)",
            transitionDelay: "100ms"
          }}>
          <div className="relative bg-[#1c1c1c] rounded-t-xl border border-[#333] p-[5px] sm:p-[8px] shadow-[0_0_60px_rgba(201,168,76,0.12)]">
            <div className="absolute top-[6px] sm:top-[10px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#333] border border-[#444]" />
            <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black mt-1.5 sm:mt-2">
              <video src="/hero.webm" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="relative">
            <div
              className="w-full h-3 sm:h-4 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-b-lg"
              style={{ clipPath: "polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)" }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-[4px] bg-[#333] rounded-b-md" />
          </div>
          <div className="w-[85%] mx-auto h-2 bg-black/40 rounded-[50%] blur-md mt-1" />
        </div>

        {/* Tablet mockup */}
        <div
          ref={tabletRef}
          className="hidden sm:block w-[180px] sm:w-[200px] lg:w-[240px] flex-shrink-0 -mb-2 transition-all duration-1000 ease-out"
          style={{
            opacity: tabletVisible ? 1 : 0,
            transform: tabletVisible ? "translateY(0)" : "translateY(90px)",
            transitionDelay: "200ms"
          }}>
          <div className="relative bg-[#1c1c1c] rounded-[16px] lg:rounded-[20px] border-2 border-[#333] p-[5px] lg:p-[7px] shadow-[0_0_50px_rgba(201,168,76,0.1)]">
            <div className="absolute top-[5px] lg:top-[7px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#333] border border-[#444] z-20" />
            <div className="relative w-full rounded-[12px] lg:rounded-[14px] overflow-hidden bg-black mt-1" style={{ aspectRatio: "3/4" }}>
              <video src="/hero.webm" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
            <div className="mx-auto mt-1 w-4 h-4 lg:w-5 lg:h-5 rounded-full border border-[#444] bg-[#222]" />
          </div>
          <div className="w-[75%] mx-auto h-2 bg-black/40 rounded-[50%] blur-md mt-1" />
        </div>

        {/* Phone mockup */}
        <div
          ref={phoneRef}
          className="w-[100px] sm:w-[120px] lg:w-[150px] flex-shrink-0 -mb-4 transition-all duration-1000 ease-out"
          style={{
            opacity: phoneVisible ? 1 : 0,
            transform: phoneVisible ? "translateY(0)" : "translateY(100px)",
            transitionDelay: "300ms"
          }}>
          <div className="relative bg-[#1c1c1c] rounded-[20px] lg:rounded-[26px] border-2 border-[#333] p-[4px] lg:p-[5px] shadow-[0_0_50px_rgba(201,168,76,0.1)]">
            <div className="absolute top-[5px] lg:top-[7px] left-1/2 -translate-x-1/2 w-12 lg:w-14 h-[3px] lg:h-[4px] bg-[#333] rounded-full z-20" />
            <div className="relative w-full rounded-[16px] lg:rounded-[22px] overflow-hidden bg-black" style={{ aspectRatio: "9/19.5" }}>
              <video src="/hero-stone-veneer.webm" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="w-[75%] mx-auto h-2 bg-black/40 rounded-[50%] blur-md mt-1" />
        </div>
      </div>
    </section>
  );
};

export default LaptopMockup;
