import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";

const PricingPage = () => {
  const { ref, isVisible } = useScrollReveal();
  const navigate = useNavigate();
  const { t, tArray } = useTranslation();

  const planKeys = ["maintenance", "renovation", "fullProject"] as const;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-header-offset lg:pt-header-offset-lg">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-hero-dark text-white overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">{t("pricingPage.heroTitle")}</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
              {t("pricingPage.heroSubtitle")}
            </p>
          </div>
        </section>

        {/* Pricing Grid */}
        <section ref={ref} className={`py-16 lg:py-24 bg-secondary scroll-reveal ${isVisible ? 'visible' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {planKeys.map((key, index) => {
                const featured = key === "renovation";
                const name = t(`pricingPage.plans.${key}.name`);
                const priceRange = t(`pricingPage.plans.${key}.priceRange`);
                const description = t(`pricingPage.plans.${key}.description`);
                const features = tArray(`pricingPage.plans.${key}.features`);

                return (
                  <div
                    key={key}
                    className={`bg-card border rounded-card p-8 relative hover:shadow-card-hover transition-all animate-fade-in ${
                      featured
                        ? "border-primary shadow-card-hover scale-105"
                        : "border-card-border"
                    }`}
                    style={{ animationDelay: `${0.1 + index * 0.15}s`, animationFillMode: 'both' }}
                  >
                    {featured && (
                      <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2">
                        <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                          {t("pricingPage.mostPopular")}
                        </span>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{name}</h3>
                      <p className="text-3xl font-bold text-primary mb-2 font-rubik">{priceRange}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <Check className="text-primary flex-shrink-0 mt-0.5" size={20} />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => navigate("/contact")}
                      className={
                        featured
                          ? "w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                          : "w-full"
                      }
                      variant={featured ? "default" : "outline"}
                    >
                      {t("pricingPage.requestQuote")}
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                {t("pricingPage.disclaimer")}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
