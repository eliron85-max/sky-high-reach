import React, { useRef, useEffect, useState } from "react";

const LaptopMockup: React.FC = () => {
  const laptopRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [laptopVisible, setLaptopVisible] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === laptopRef.current && entry.isIntersecting) {
            setLaptopVisible(true);
          }
          if (entry.target === phoneRef.current && entry.isIntersecting) {
            setPhoneVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (laptopRef.current) observer.observe(laptopRef.current);
    if (phoneRef.current) observer.observe(phoneRef.current);

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
          backgroundSize: "80px 80px",
        }}
      />

      {/* Title */}
      <div className="relative z-10 text-center mb-12 sm:mb-16 px-4">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          style={{ fontFamily: "'Heebo', sans-serif" }}
        >
          האתר שלנו{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#c9a84c] to-[#e8d5a3]">
            בפעולה
          </span>
        </h2>
        <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto" style={{ fontFamily: "'Heebo', sans-serif" }}>
          חווית משתמש מתקדמת בכל מכשיר
        </p>
      </div>

      {/* Devices container */}
      <div className="relative z-10 flex items-end justify-center gap-6 sm:gap-10 lg:gap-14 px-4">
        {/* Laptop mockup */}
        <div
          ref={laptopRef}
          className="w-full max-w-[700px] lg:max-w-[800px] transition-all duration-1000 ease-out"
          style={{
            opacity: laptopVisible ? 1 : 0,
            transform: laptopVisible ? "translateY(0)" : "translateY(80px)",
          }}
        >
          {/* Screen bezel */}
          <div className="relative bg-[#1c1c1c] rounded-t-2xl border border-[#333] p-[6px] sm:p-[10px] shadow-[0_0_80px_rgba(201,168,76,0.15)]">
            <div className="absolute top-[8px] sm:top-[12px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#333] border border-[#444]" />
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mt-2 sm:mt-3">
              <video
                src="/hero.webm"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Laptop base / hinge */}
          <div className="relative">
            <div
              className="w-full h-4 sm:h-5 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-b-lg"
              style={{ clipPath: "polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)" }}
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-[5px] bg-[#333] rounded-b-md" />
          </div>
          <div className="w-[90%] mx-auto h-3 bg-black/40 rounded-[50%] blur-md mt-1" />
        </div>

        {/* Phone mockup */}
        <div
          ref={phoneRef}
          className="hidden sm:block w-[140px] sm:w-[160px] lg:w-[200px] flex-shrink-0 -mb-4 transition-all duration-1000 ease-out"
          style={{
            opacity: phoneVisible ? 1 : 0,
            transform: phoneVisible ? "translateY(0)" : "translateY(100px)",
            transitionDelay: "200ms",
          }}
        >
          <div className="relative bg-[#1c1c1c] rounded-[24px] lg:rounded-[30px] border-2 border-[#333] p-[5px] lg:p-[6px] shadow-[0_0_60px_rgba(201,168,76,0.12)]">
            <div className="absolute top-[6px] lg:top-[8px] left-1/2 -translate-x-1/2 w-14 lg:w-16 h-[4px] lg:h-[5px] bg-[#333] rounded-full z-20" />
            <div className="relative w-full rounded-[20px] lg:rounded-[24px] overflow-hidden bg-black" style={{ aspectRatio: "9/19.5" }}>
              <video
                src="/hero-stone-veneer.webm"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-[80%] mx-auto h-2 bg-black/40 rounded-[50%] blur-md mt-1" />
        </div>
      </div>
    </section>
  );
};

export default LaptopMockup;
