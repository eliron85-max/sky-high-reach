import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Pricing = () => {
  const { ref, isVisible } = useScrollReveal();
  
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

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={ref} id="pricing" className={`py-16 lg:py-24 bg-secondary scroll-reveal ${isVisible ? 'visible' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">מחירון משוער</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            המחירים משתנים בהתאם למורכבות הפרויקט. צרו קשר לקבלת הצעת מחיר מדויקת
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-card border rounded-card p-8 relative hover:shadow-card-hover transition-all ${
                plan.featured
                  ? "border-primary shadow-card-hover scale-105"
                  : "border-card-border"
              }`}
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
                <p className="text-3xl font-bold text-primary mb-2">{plan.priceRange}</p>
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
                onClick={scrollToContact}
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
  );
};

export default Pricing;
