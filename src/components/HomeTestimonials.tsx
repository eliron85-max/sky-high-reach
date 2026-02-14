import * as React from "react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  initials: string;
  avatarBg: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "דודו בוזגלו",
    role: "מנהל פרויקטים",
    text: "עבדנו עם החברה על מספר פרויקטים מורכבים. המקצועיות והאמינות שהם מפגינים היא ברמה הגבוהה ביותר. ממליץ בחום!",
    initials: "דב",
    avatarBg: "bg-amber-500",
  },
  {
    id: 2,
    name: "שרה לוי",
    role: "יזמית נדל״ן",
    text: "תוצאות מעולות בשיפוץ חזית הבניין שלנו. הצוות היה מקצועי, עמד בלוחות הזמנים והתוצאה עלתה על הציפיות.",
    initials: "של",
    avatarBg: "bg-emerald-500",
  },
  {
    id: 3,
    name: "משה אברהם",
    role: "וועד בית, רמת גן",
    text: "פתרון מקצועי לבעיית הרטיבות שנמשכה שנים. עבודה יסודית ומקיפה עם אחריות מלאה. תודה רבה!",
    initials: "מא",
    avatarBg: "bg-blue-500",
  },
  {
    id: 4,
    name: "רחל גולדשטיין",
    role: "מנהלת נכסים",
    text: "שירות אדיב, מקצועי ואמין. ביצעו עבודות גובה מורכבות בבניין שלנו בצורה מושלמת ובטוחה.",
    initials: "רג",
    avatarBg: "bg-purple-500",
  },
  {
    id: 5,
    name: "יוסי כהן",
    role: "קבלן שיפוצים",
    text: "עבודה ברמה גבוהה מאוד, צוות מקצועי שמבין את העבודה לעומק. שיתוף פעולה מעולה מתחילת הפרויקט ועד סופו.",
    initials: "יכ",
    avatarBg: "bg-rose-500",
  },
  {
    id: 6,
    name: "מיכל דוד",
    role: "דיירת, תל אביב",
    text: "הגיעו בזמן, עבדו בצורה נקייה ומסודרת, והתוצאה הסופית פשוט מדהימה. הבניין נראה כמו חדש!",
    initials: "מד",
    avatarBg: "bg-teal-500",
  },
  {
    id: 7,
    name: "אבי ישראלי",
    role: "מהנדס בניין",
    text: "מקצוענים אמיתיים. טיפלו בבעיות איטום מורכבות עם פתרונות חכמים ויצירתיים. ממליץ לכל פרויקט גובה.",
    initials: "אי",
    avatarBg: "bg-indigo-500",
  },
];

const BACKGROUND_TEXT = "לקוחות ממליצים עלינו";

const HomeTestimonials = () => {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportH = window.innerHeight;
      const scrolled = (viewportH - rect.top) / (sectionHeight);
      setProgress(Math.max(0, Math.min(1, scrolled)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Map progress to a continuous float index
  const floatIndex = progress * testimonials.length;

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      dir="rtl"
      className="relative overflow-hidden"
      style={{ height: `${(testimonials.length + 1) * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ background: "hsl(100 30% 72%)" }}
      >
        {/* Large background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <p
            className="text-[14vw] sm:text-[11vw] font-black leading-[0.9] text-center whitespace-pre-wrap break-words"
            style={{
              color: "hsl(140 30% 22%)",
              opacity: 0.35,
              fontFamily: "'Ploni', sans-serif",
              maxWidth: "100vw",
            }}
          >
            {BACKGROUND_TEXT}
          </p>
        </div>

        {/* Stacked cards */}
        <div className="relative w-[85vw] max-w-[480px]" style={{ height: "60vh", maxHeight: "520px" }}>
          {testimonials.map((t, i) => {
            const diff = i - floatIndex;

            // Smooth interpolation for each card
            // Active card: diff ~ 0, behind: diff < 0, ahead: diff > 0
            const rotate = -6 + diff * 3;
            const translateY = diff * 40;
            const translateX = diff * -15;
            const scale = 1 - Math.abs(diff) * 0.04;
            const opacity = Math.abs(diff) > 2.5 ? 0 : 1 - Math.abs(diff) * 0.35;
            const zIndex = 100 - Math.round(Math.abs(diff) * 10);

            // Floating/breathing effect via CSS animation offset per card
            const floatDelay = i * 0.4;

            return (
              <div
                key={t.id}
                className="absolute inset-0"
                style={{
                  transform: `rotate(${rotate}deg) translateY(${translateY}px) translateX(${translateX}px) scale(${Math.max(0.8, scale)})`,
                  opacity: Math.max(0, Math.min(1, opacity)),
                  zIndex,
                  transition: "transform 0.15s ease-out, opacity 0.2s ease-out",
                  animation: `testimonialFloat 4s ease-in-out ${floatDelay}s infinite`,
                }}
              >
                <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8 flex flex-col justify-between">
                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm",
                            t.avatarBg
                          )}
                        >
                          {t.initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base">{t.name}</h4>
                          <p className="text-gray-500 text-sm">{t.role}</p>
                        </div>
                      </div>
                      <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#c9a84c]" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>

                    <p className="text-gray-800 text-lg sm:text-xl leading-relaxed font-medium">
                      {t.text}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-gray-400 text-sm">
                      א.א פרויקטים וגובה
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes testimonialFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
};

export default HomeTestimonials;
