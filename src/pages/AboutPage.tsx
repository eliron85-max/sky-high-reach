import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Shield, Users } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/lib/i18n";

const AboutPage = () => {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useTranslation();
  
  const stats = [
    { icon: Award, value: "15+", label: t("about.stats.experience") },
    { icon: Users, value: "500+", label: t("about.stats.projects") },
    { icon: Shield, value: "100%", label: t("about.stats.safety") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-header-offset lg:pt-header-offset-lg">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-hero-dark text-white overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">{t("aboutPage.heroTitle")}</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
              {t("aboutPage.heroSubtitle")}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section ref={ref} className={`py-16 lg:py-24 bg-secondary scroll-reveal ${isVisible ? 'visible' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  {t("about.title")}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>{t("about.paragraph1")}</p>
                  <p>{t("about.paragraph2")}</p>
                  <div className="bg-card p-6 rounded-card border border-card-border mt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {t("about.historyTitle")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("about.historyText")}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-8">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div 
                        key={index} 
                        className="text-center animate-fade-in"
                        style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'both' }}
                      >
                        <Icon className="mx-auto mb-2 text-primary" size={32} />
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Image Placeholder */}
              <div>
                <div className="bg-muted rounded-card aspect-[4/3] flex items-center justify-center">
                  <p className="text-muted-foreground text-center">{t("about.imagePlaceholder")}</p>
                </div>
              </div>
            </div>

            {/* Client Logos */}
            <div className="mt-16">
              <h3 className="text-center text-xl font-semibold text-foreground mb-8">
                {t("about.clientsTitle")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-card rounded-card border border-card-border p-6 flex items-center justify-center grayscale hover:grayscale-0 transition-all animate-fade-in"
                    style={{ animationDelay: `${0.1 * i}s`, animationFillMode: 'both' }}
                  >
                    <span className="text-muted-foreground text-sm">{t("about.logoPlaceholder")} {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
