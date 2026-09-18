import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "פנייה ראשונית",
    description:
      "משאירים פרטים, מתקשרים או שולחים וואטסאפ – נחזור אליכם בהקדם ונבין את הצורך שלכם.",
  },
  {
    number: 2,
    title: "פגישה וייעוץ",
    description:
      "פגישה אישית להיכרות עם המקרה, הערכת מצב מפורטת וגיבוש אסטרטגיה.",
  },
  {
    number: 3,
    title: "ליווי צמוד",
    description:
      "טיפול מקצועי ושיתוף פעולה לאורך כל הדרך – אתם אף פעם לא לבד.",
  },
  {
    number: 4,
    title: "השגת התוצאה",
    description:
      "חתירה לתוצאה המיטבית עבורכם – בהסכמה, בגישור או בבית המשפט.",
  },
];

export default function ProcessStepsSection() {
  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden bg-white dark:bg-black py-24 lg:py-32"
    >

      <div className="relative mx-auto w-full max-w-[1500px] px-6 lg:px-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="block mb-5 text-xs md:text-sm tracking-[0.45em] text-[#a88735]">
            איך זה עובד
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight leading-[1.05] text-[#0a1628] dark:text-white">
            <span>הדרך </span>
            <span className="gold-shimmer-text">לפתרון</span>
            <span className="text-[#0a1628] dark:text-white">
              {" "}– בארבעה צעדים
            </span>
          </h2>

          <div className="mx-auto mt-8 h-px w-24 gold-divider" />
        </motion.div>

        <div className="relative mt-20 lg:mt-24">
          <div
            aria-hidden
            className="absolute top-[38px] right-[12.5%] left-[12.5%] h-px bg-[#c9a84c]/25 hidden lg:block"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative text-center"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="relative z-10 mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full border border-[#b58b2a] bg-white dark:bg-black shadow-[0_0_0_8px_rgba(255,255,255,0.85)] dark:shadow-[0_0_0_8px_rgba(0,0,0,0.85)]">
                  <span
                    className="text-2xl font-medium text-[#80621f]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {step.number}
                  </span>
                </div>

                <div className="mt-8 px-2">
                  <h3 className="text-xl lg:text-2xl font-medium text-[#0a1628] dark:text-white mb-4">
                    {step.title}
                  </h3>

                  <p className="text-base lg:text-lg leading-relaxed font-light text-black/55 dark:text-white/55 max-w-[330px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mx-auto mt-20 h-px w-32 gold-divider"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.5 }}
        />
      </div>
    </section>
  );
}
