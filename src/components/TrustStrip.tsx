import React from "react";
import { BadgeCheck, ThumbsUp, Users, HardHat, Sparkles } from "lucide-react";

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
    <section dir="rtl" className="relative w-full overflow-hidden bg-black isolate">
      {/* Top spacer - חוסם זליגה מלמעלה */}
      <div className="w-full h-8 bg-black" />

      {/* Gold top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#dfc798]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {items.map(({ kicker, title, Icon }) => (
            <div key={title} className="text-center">
              {/* Icon box */}
              <div className="mx-auto w-14 h-14 rounded-2xl border border-[#dfc798]/50 bg-black flex items-center justify-center">
                <Icon className="w-7 h-7 text-[#dfc798]" />
              </div>

              {/* Kicker */}
              <div className="mt-4 text-xs text-[#dfc798]/80">{kicker}</div>

              {/* Title */}
              <div className="mt-2 text-base md:text-lg font-semibold text-white">{title}</div>

              {/* Divider */}
              <div className="mx-auto mt-3 h-px w-10 bg-[#dfc798]/60" />
            </div>
          ))}
        </div>
      </div>

      {/* Gold bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#dfc798]" />

      {/* Bottom spacer - חוסם זליגה מלמטה */}
      <div className="w-full h-8 bg-black" />
    </section>
  );
}
