import React from "react";

const LaptopMockup: React.FC = () => {
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

      {/* Laptop mockup */}
      <div className="relative z-10 flex justify-center px-4">
        <div className="w-full max-w-[900px]">
          {/* Screen bezel */}
          <div className="relative bg-[#1c1c1c] rounded-t-2xl border border-[#333] p-[6px] sm:p-[10px] shadow-[0_0_80px_rgba(201,168,76,0.15)]">
            {/* Camera dot */}
            <div className="absolute top-[8px] sm:top-[12px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#333] border border-[#444]" />

            {/* Screen */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mt-2 sm:mt-3">
              <iframe
                src={window.location.origin}
                title="אתר א.א פרויקטים וגובה"
                className="w-full h-full border-0 pointer-events-none"
                loading="lazy"
                style={{ transform: "scale(1)", transformOrigin: "top left" }}
              />
              {/* Overlay to prevent interaction */}
              <div className="absolute inset-0 bg-transparent" />
            </div>
          </div>

          {/* Laptop base / hinge */}
          <div className="relative">
            <div
              className="w-full h-4 sm:h-5 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-b-lg"
              style={{
                clipPath: "polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)",
              }}
            />
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-[5px] bg-[#333] rounded-b-md" />
          </div>

          {/* Shadow underneath */}
          <div className="w-[90%] mx-auto h-3 bg-black/40 rounded-[50%] blur-md mt-1" />
        </div>
      </div>
    </section>
  );
};

export default LaptopMockup;
