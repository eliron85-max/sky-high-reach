import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useNavigate } from "react-router-dom";

const PricingPage = () => {
  const { ref, isVisible } = useScrollReveal();
  const navigate = useNavigate();
  
  const plans = [
    {
      name: "עבודת תחזוקה",
      priceRange: "₪2,000 - ₪5,000",
      description: "מתאים לעבודות קטנות ותחזוקה שוטפת",
      features: [
        "סקר ראשוני חינם",
        "ביצוע עד יום עבודה אחד",
        "ציוד בסיסי כלול במחיר",
        "אחריות לשנה",
        "תמיכה טכנית",
      ],
    },
    {
      name: "פרויקט שיקום",
      priceRange: "₪10,000 - ₪50,000",
      description: "מתאים לפרויקטי שיקום ושיפוץ בינוניים",
      features: [
        "סקר מפורט וייעוץ",
        "ביצוע 3-7 ימי עבודה",
        "ציוד מקצועי מתקדם",
        "אחריות ל-3 שנים",
        "מעקב ובקרת איכות",
        "דוחות צילום מפורטים",
      ],
      featured: true,
    },
    {
      name: "פרויקט מעטפת מלא",
      priceRange: "₪100,000+",
      description: "מתאים לפרויקטים גדולים ומורכבים",
      features: [
        "ייעוץ ותכנון מקיף",
        "ניהול פרויקט מלא",
        "ביצוע בשלבים מתוזמנים",
        "ציוד מיוחד וצוות מורחב",
        "אחריות ל-5 שנים",
        "תחזוקה שוטפת לשנה",
        "דיווח שבועי",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[80px] lg:pt-[170px]">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-hero-dark text-white overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">מחירון</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
              המחירים משתנים בהתאם למורכבות הפרויקט. צרו קשר לקבלת הצעת מחיר מדויקת
            </p>
          </div>
        </section>

        {/* Pricing Grid */}
        <section ref={ref} className={`py-16 lg:py-24 bg-secondary scroll-reveal ${isVisible ? 'visible' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-card border rounded-card p-8 relative hover:shadow-card-hover transition-all animate-fade-in ${
                    plan.featured
                      ? "border-primary shadow-card-hover scale-105"
                      : "border-card-border"
                  }`}
                  style={{ animationDelay: `${0.1 + index * 0.15}s`, animationFillMode: 'both' }}
                >
                  {plan.featured && (
                    <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        פופולרי ביותר
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-3xl font-bold text-primary mb-2 font-rubik">{plan.priceRange}</p>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <Check className="text-primary flex-shrink-0 mt-0.5" size={20} />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => navigate("/contact")}
                    className={
                      plan.featured
                        ? "w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                        : "w-full"
                    }
                    variant={plan.featured ? "default" : "outline"}
                  >
                    בקשת הצעת מחיר
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                * המחירים הם אומדן בלבד. המחיר הסופי ייקבע לאחר סקר מקצועי במקום.
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
