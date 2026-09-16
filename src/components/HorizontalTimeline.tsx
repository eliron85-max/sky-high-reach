import { motion } from "framer-motion";

const milestones = [
  {
    year: "2008",
    title: "ההתחלה",
    description: "הקמת החברה עם צוות קטן ומסור, התמחות ראשונית בעבודות סנפלינג",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
  },
  {
    year: "2010",
    title: "הסמכות",
    description: "קבלת הסמכות מקצועיות לעבודות גובה ותקני בטיחות בינלאומיים",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80",
  },
  {
    year: "2013",
    title: "התרחבות",
    description: "הרחבת מגוון השירותים לאיטום, שיקום מבנים וצביעת חזיתות",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
  },
  {
    year: "2015",
    title: "פרויקטים גדולים",
    description: "כניסה לפרויקטים מסחריים גדולים ושיתופי פעולה עם קבלנים מובילים",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
  },
  {
    year: "2018",
    title: "חדשנות",
    description: "אימוץ טכנולוגיות מתקדמות וחומרי איטום חדשניים מהעולם",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
  },
  {
    year: "2020",
    title: "צמיחה",
    description: "הגעה ליותר מ-500 לקוחות מרוצים ופרויקטים בכל רחבי הארץ",
    image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=600&q=80",
  },
  {
    year: "2022",
    title: "מצוינות",
    description: "קבלת תו איכות ארצי ושיתופי פעולה עם רשויות מקומיות",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
  },
  {
    year: "2024",
    title: "העתיד",
    description: "המשך צמיחה, הכשרת דור חדש של מקצוענים והרחבת פעילות",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  },
];

const HorizontalTimeline = () => {
  const topRow = milestones.slice(0, 4);
  const bottomRow = milestones.slice(4);

  return (
    <section className="relative bg-hero-dark py-24 md:py-32 overflow-hidden cinematic-grain" dir="rtl">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[500px] w-[500px] rounded-full blur-[140px] opacity-30"
        style={{ background: "radial-gradient(circle, #c9a84c 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[500px] w-[500px] rounded-full blur-[140px] opacity-20"
        style={{ background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)" }}
      />

      <motion.div
        className="relative text-center mb-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="inline-block text-[#c9a84c] text-xs md:text-sm tracking-[0.45em] uppercase mb-5">
          המסע שלנו
        </span>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tight leading-[0.95]">
          <span className="gold-shimmer-text">ציוני</span>{" "}
          <span className="text-white/95">דרך</span>
        </h2>
        <div className="mx-auto mt-8 h-px w-32 gold-divider" />
        <p className="mt-6 text-white/55 max-w-xl mx-auto text-base md:text-lg leading-relaxed font-light">
          רצף של רגעים מכוננים — מהיום הראשון ועד המהפכה הבאה
        </p>
      </motion.div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 space-y-10 lg:space-y-12">
        {[topRow, bottomRow].map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {row.map((m, i) => (
              <motion.article
                key={m.year}
                className="group relative glass-panel glass-panel-hover rounded-3xl overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={m.image}
                    alt={m.title}
                    className="w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/30 to-transparent" />
                  <div className="absolute top-5 right-5">
                    <span
                      className="block text-4xl lg:text-5xl font-light tracking-tight text-gold-gradient"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {m.year}
                    </span>
                  </div>
                </div>

                <div className="relative p-8 lg:p-10 min-h-[170px] flex flex-col justify-center">
                  <h3 className="text-2xl lg:text-3xl font-medium text-white mb-4 transition-colors duration-500 group-hover:text-[#f4e4a8]">
                    {m.title}
                  </h3>
                  <p className="text-white/55 leading-relaxed text-base lg:text-lg font-light">
                    {m.description}
                  </p>
                  <span className="absolute bottom-0 right-6 left-6 h-px gold-divider scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right" />
                </div>
              </motion.article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HorizontalTimeline;
