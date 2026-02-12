// src/pages/Index.tsx  (החלף את כל הבלוק העליון עד סוף ה-HERO SECTION)

return (
  <div className="min-h-screen bg-black">
    <FloatingLanguageSwitcher />
    <ScrollToTopButton />

    {/* Right side */}
    <RappellingFigure />

    {/* Left side */}
    <RappellingFigureLeft />

    <main>
      {/* HERO WRAPPER: כולל Header בתוך ה-100vh */}
      <section className="relative z-10 w-full h-screen overflow-hidden">
        {/* Header בתוך ההירו */}
        <div className="absolute top-0 left-0 right-0 z-[1000]">
          <Header />
        </div>

        {/* הוידאו ממלא הכל */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
        >
          <source src="/hero.webm" type="video/webm" />
        </video>

        <div className="absolute inset-0 bg-black/45" />

        {/* Scroll icon */}
        <button
          type="button"
          onClick={scrollToNext}
          aria-label="גלול למטה"
          className="absolute left-1/2 -translate-x-1/2 z-[99999] bottom-[12px] sm:bottom-[14px] flex flex-col items-center"
        >
          <div className="relative w-[28px] h-[56px] rounded-full border-2 border-[#e8d5a3] bg-black/40 backdrop-blur-sm">
            <div className="absolute left-1/2 top-[10px] -translate-x-1/2 w-[6px] h-[10px] rounded-full bg-[#e8d5a3] heroScrollDot" />
          </div>

          <div className="mt-2 w-[10px] h-[10px] border-b-2 border-r-2 border-[#e8d5a3] rotate-45 opacity-90" />
        </button>
      </section>

      {/* SERVICES SCROLL CARDS */}
      <section id="next-section" className="relative z-0">
        <ServicesScrollCards title={t("home.servicesTitle")} className="bg-[#bfe7d6]" items={services} />
      </section>

      {/* everything after services should be above the pinned cards */}
      <div className="relative z-10">
        <HomeStatsSection
          titleGold={t("home.statsGold")}
          titleBlack={t("home.statsBlack")}
          stats={[
            { value: "500+", label: t("home.statsProjects") },
            { value: "15", label: t("home.statsExperience") },
            { value: "50+", label: t("home.statsCities") },
          ]}
          images={[statsImage1, statsImage2, statsImage3, statsImage4]}
        />

        <HomeUrbanRenewalHero
          images={urbanImages}
          titleTop={t("home.urbanTitleTop")}
          titleGold={t("home.urbanTitleGold")}
          subtitle={t("home.urbanSubtitle")}
        />

        <section className="relative w-full bg-white h-[200px] sm:h-[280px] lg:h-[350px] overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </section>

        <TrustStrip />
        <HomeTestimonials />
        <Contact />
      </div>
    </main>

    <Footer />
  </div>
);
