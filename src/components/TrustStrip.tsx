import React from "react";
import { BadgeCheck, ThumbsUp, Users, HardHat, Sparkles } from "lucide-react";

import bgImage from "@/assets/stone-veneer-after-2.jpg";

type Item = {
  kicker: string;
  title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const items = [
  { kicker: "אנשי מקצוע מוסמכים", title: "צוות סנפלינג מקצועי", Icon: HardHat },
  { kicker: "מעל 15 שנות ניסיון", title: "עבודות גובה ומעטפת", Icon: Sparkles },
  { kicker: "חברה משפחתית", title: "אמינות ובטיחות", Icon: ThumbsUp },
  { kicker: "מאות פרויקטים", title: "ביצוע מוצלח בשטח", Icon: Users },
  { kicker: "תקן וביטוח מלא", title: "עבודה לפי תקן ישראלי", Icon: BadgeCheck },
];

export default function TrustStrip() {
  return (
    <section dir="rtl" className="relative w-full overflow-hidden mt-12">
      {/* Background image */}
      <img src={bgImage} className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm" />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(223,199,152,0.18),transparent_60%)]" />

      {/* Gold top/bottom lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#dfc798]/50" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#dfc798]/35" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {items.map(({ kicker, title, Icon }) => (
            <div key={title} className="text-center">
              {/* Icon box */}
              <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-xl border border-[#a79471] bg-black/40">
                <Icon className="w-8 h-8 text-[#dfc798]" strokeWidth={1.6} />
              </div>

              {/* Small text */}
              <div className="text-[13px] text-[#dfc798]">{kicker}</div>

              {/* Main text */}
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 500,
                }}
                className="mt-1 text-[20px] text-white leading-tight"
              >
                {title}
              </div>

              {/* underline */}
              <div className="mx-auto mt-3 h-[2px] w-12 bg-gradient-to-r from-transparent via-[#dfc798] to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
