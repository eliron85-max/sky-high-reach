import { motion } from "framer-motion";

const milestones = [
  {
    year: "2008",
    title: "ההתחלה",
    description: "הקמת החברה עם צוות קטן ומסור, התמחות ראשונית בעבודות סנפלינג",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
  },
  {
    year: "2010",
    title: "הסמכות",
    description: "קבלת הסמכות מקצועיות לעבודות גובה ותקני בטיחות בינלאומיים",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=80",
  },
  {
    year: "2013",
    title: "התרחבות",
    description: "הרחבת מגוון השירותים לאיטום, שיקום מבנים וצביעת חזיתות",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
  },
  {
    year: "2015",
    title: "פרויקטים גדולים",
    description: "כניסה לפרויקטים מסחריים גדולים ושיתופי פעולה עם קבלנים מובילים",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80",
  },
  {
    year: "2018",
    title: "חדשנות",
    description: "אימוץ טכנולוגיות מתקדמות וחומרי איטום חדשניים מהעולם",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
  },
  {
    year: "2020",
    title: "צמיחה",
    description: "הגעה ליותר מ-500 לקוחות מרוצים ופרויקטים בכל רחבי הארץ",
    image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=400&q=80",
  },
  {
    year: "2022",
    title: "מצוינות",
    description: "קבלת תו איכות ארצי ושיתופי פעולה עם רשויות מקומיות",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80",
  },
  {
    year: "2024",
    title: "העתיד",
    description: "המשך צמיחה, הכשרת דור חדש של מקצוענים והרחבת פעילות",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
  },
];

const HorizontalTimeline = () => {
  const topRow = milestones.slice(0, 4);
  const bottomRow = milestones.slice(4);

  return (
    <section className="bg-hero-dark py-16 md:py-24">
      <div className="text-center mb-12 px-4">
        <span className="text-[#dfc798] text-sm tracking-[0.3em] uppercase">המסע שלנו</span>
        <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">ציוני דרך</h2>
      </div>

      <div className="container mx-auto px-4 space-y-10">
        {[topRow, bottomRow].map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {row.map((m, i) => (
              <motion.div
                key={m.year}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="rounded-2xl overflow-hidden border border-[#dfc798]/20 mb-4">
                  <img
                    src={m.image}
                    alt={m.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="text-[#dfc798] text-2xl font-bold" style={{ fontFamily: "Montserrat, sans-serif" }}>{m.year}</span>
                <h3 className="text-lg font-bold mt-2 mb-1 text-white">{m.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">{m.description}</p>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HorizontalTimeline;
