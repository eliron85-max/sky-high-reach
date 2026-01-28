import React from "react";
import { BadgeCheck, ThumbsUp, Users, HardHat, Sparkles } from "lucide-react";

import bgImage from "@/assets/trust-bg.jpg";

type Item = {
  kicker: string;
  title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const items: Item[] = [
  { kicker: "תקן ובטיחות", title: "עבודה לפי תקן ישראלי", Icon: BadgeCheck },
  { kicker: "תוצאות בשטח", title: "ביצוע מדויק בשטח", Icon: Users },
  { kicker: "חברה משפחתית", title: "אמינות ובטיחות", Icon: ThumbsUp },
  { kicker: "מעל 15 שנות ניסיון", title: "עבודות גובה ומעטפת", Icon: Sparkles },
  { kicker: "אנשי מקצוע מוסמכים", title: "צוות סנפלינג מקצועי", Icon: HardHat },
];

export default function TrustStrip() {
  return (
    <section dir="rtl" className="relative isolate w-full overflow-hidden bg-black">
      {/* Solid black pads (prevents any bleed) */}
      <div className="w-full bg-black h-6" />

      {/* Background image */}
      <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm" />

      {/* Dark overlay (keeps it self-contained) */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Subtle gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(223,199,152,0.18),transparent_60%)]" />

      {/* TOP/BOTTOM lines - NOT transparent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#dfc798]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#dfc798]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {items.map(({ kicker, title, Icon }) => (
            <div key={title} className="text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl border border-[#dfc798]/40 bg-black/60 flex items-center justify-center">
                <Icon className="w-7 h-7 text-[#dfc798]" />
              </div>

              <div className="mt-4 text-xs text-[#dfc798]/80">{kicker}</div>

              <div className="mt-2 text-base md:text-lg font-semibold text-white">{title}</div>

              <div className="mx-auto mt-3 h-px w-10 bg-[#dfc798]/60" />
            </div>
          ))}
        </div>
      </div>

      {/* Solid black pads (prevents any bleed) */}
      <div className="w-full bg-black h-6" />
    </section>
  );
}
