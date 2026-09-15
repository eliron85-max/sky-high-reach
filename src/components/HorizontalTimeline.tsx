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
  const rows = [
    milestones.slice(0, 3),
    milestones.slice(3, 6),
    milestones.slice(6),
  ];

  return (
    <section
      className="relative bg-hero-dark py-24 md:py-32 overflow-hidden cinematic-grain"
      dir="rtl"
    >
      {/* ambient gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[500px] w-[500px] rounded-full blur-[140px] opacity-30"
        style={{
          background:
            "radial-gradient(circle, #c9a84c 0%, transparent 70%)",
        }}
      />

      {/* ambient blue glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[500px] w-[500px] rounded-full blur-[140px] opacity-20"
        style={{
          background:
            "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
        }}
      />

      {/* heading */}
      <motion.div
        className="relative text-center mb-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
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

      {/* timeline grid */}
      <div className="relative container mx-auto px-4 space-y-10 lg:space-y-14">
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          >
            {row.map((m, i) => (
              <motion.article
                key={m.year}
                className="
                  group
                  relative
                  glass-panel
                  glass-panel-hover
                  rounded-3xl
                  overflow-hidden
                  border
                  border-white/10
                  bg-[#0b1220]/80
                "
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* visual area */}
                <div className="relative px-5 pt-6 pb-2 sm:px-6 sm:pt-7">
                  {/* glow behind laptop */}
                  <div
                    aria-hidden
                    className="
                      pointer-events-none
                      absolute
                      inset-x-8
                      top-8
                      h-40
                      rounded-full
                      blur-3xl
                      opacity-30
                      transition-opacity
                      duration-700
                      group-hover:opacity-50
                    "
                    style={{
                      background:
                        i % 2 === 0
                          ? "radial-gradient(circle, #c9a84c 0%, transparent 70%)"
                          : "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
                    }}
                  />

                  {/* laptop */}
                  <div className="relative z-10 mx-auto w-full">
                    {/* laptop screen frame */}
                    <div
                      className="
                        relative
                        mx-auto
                        w-full
                        max-w-[560px]
                        aspect-[16/10]
                        rounded-[18px]
                        border-[6px]
                        border-[#202936]
                        bg-[#080d15]
                        shadow-[0_25px_70px_rgba(0,0,0,0.55)]
                        overflow-hidden
                        transition-transform
                        duration-700
                        group-hover:-translate-y-1
                      "
                    >
                      {/* screen image */}
                      <div className="absolute inset-[5px] overflow-hidden rounded-[10px] bg-black">
                        <img
                          src={m.image}
                          alt={m.title}
                          className="
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-[1400ms]
                            ease-[cubic-bezier(0.16,1,0.3,1)]
                            group-hover:scale-105
                          "
                          loading="lazy"
                          decoding="async"
                        />

                        {/* cinematic overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a]/70 via-transparent to-transparent" />
                      </div>

                      {/* camera dot */}
                      <div
                        aria-hidden
                        className="
                          absolute
                          top-1
                          left-1/2
                          -translate-x-1/2
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-[#3f4a57]
                        "
                      />
                    </div>

                    {/* laptop base */}
                    <div
                      aria-hidden
                      className="
                        relative
                        mx-auto
                        -mt-1
                        h-3
                        w-[88%]
                        rounded-b-[12px]
                        bg-gradient-to-b
                        from-[#aeb8c4]
                        via-[#727d89]
                        to-[#3f4751]
                        shadow-[0_18px_28px_rgba(0,0,0,0.45)]
                      "
                    />

                    {/* laptop bottom lip */}
                    <div
                      aria-hidden
                      className="
                        relative
                        mx-auto
                        h-2
                        w-[68%]
                        rounded-b-full
                        bg-[#4a535d]
                        opacity-70
                      "
                    />
                  </div>

                  {/* year */}
                  <div className="absolute top-8 right-8 z-20">
                    <span
                      className="
                        block
                        text-3xl
                        sm:text-4xl
                        lg:text-5xl
                        font-light
                        tracking-tight
                        text-gold-gradient
                      "
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {m.year}
                    </span>
                  </div>
                </div>

                {/* content */}
                <div className="relative px-6 pb-7 pt-4 lg:px-7 lg:pb-8 lg:pt-5 text-center">
                  <h3
                    className="
                      text-2xl
                      lg:text-3xl
                      font-medium
                      text-white
                      mb-3
                      transition-colors
                      duration-500
                      group-hover:text-[#f4e4a8]
                    "
                  >
                    {m.title}
                  </h3>

                  <p
                    className="
                      text-white/55
                      leading-relaxed
                      text-sm
                      lg:text-[15px]
                      font-light
                      max-w-md
                      mx-auto
                    "
                  >
                    {m.description}
                  </p>

                  {/* hover gold underline */}
                  <span
                    className="
                      absolute
                      bottom-0
                      right-8
                      left-8
                      h-px
                      gold-divider
                      scale-x-0
                      group-hover:scale-x-100
                      transition-transform
                      duration-700
                      origin-center
                    "
                  />
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
