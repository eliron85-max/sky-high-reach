import { Phone, FileCheck, Calendar, Wrench, CheckCircle2, Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Process = () => {
  const { ref, isVisible } = useScrollReveal();
  
  const steps = [
    {
      number: 1,
      icon: Phone,
      title: "פניה ראשונית",
      description: "צרו איתנו קשר טלפוני או דרך האתר. נשמע את הצרכים שלכם ונקבע פגישת ייעוץ.",
    },
    {
      number: 2,
      icon: FileCheck,
      title: "סקר והערכה",
      description: "נבצע סקר מקצועי במקום, נזהה את האתגרים ונמליץ על הפתרון המתאים ביותר.",
    },
    {
      number: 3,
      icon: Calendar,
      title: "הצעת מחיר",
      description: "תקבלו הצעת מחיר מפורטת והוגנת, עם לוחות זמנים ברורים לביצוע העבודה.",
    },
    {
      number: 4,
      icon: Wrench,
      title: "ביצוע העבודה",
      description: "הצוות המקצועי שלנו יבצע את העבודה באיכות גבוהה תוך שמירה על בטיחות מקסימלית.",
    },
    {
      number: 5,
      icon: CheckCircle2,
      title: "בדיקות איכות",
      description: "נבצע בדיקות איכות קפדניות ונוודא שהעבודה עומדת בסטנדרטים הגבוהים ביותר.",
    },
    {
      number: 6,
      icon: Star,
      title: "מעקב ואחריות",
      description: "נספק אחריות מלאה לעבודה ונישאר זמינים למעקב ותחזוקה עתידית.",
    },
  ];

  return (
    <section ref={ref} id="process" className={`py-16 lg:py-24 bg-background scroll-reveal ${isVisible ? 'visible' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            תהליך העבודה שלנו
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            תהליך מובנה ומקצועי שמבטיח ביצוע מושלם של כל פרויקט
          </p>
        </div>

        {/* Desktop: Horizontal */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-10 left-1/2 w-full h-0.5 bg-primary/30" />
                )}

                {/* Circle with Number */}
                <div className="relative z-10 w-20 h-20 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-primary-foreground">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-3">
                  <Icon className="text-primary" size={32} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground text-center mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile/Tablet: Vertical */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative flex gap-6 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Left Side: Circle and Line */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-xl font-bold text-primary-foreground">{step.number}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-full bg-primary/30 mt-4" />
                  )}
                </div>

                {/* Right Side: Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="text-primary" size={28} />
                    <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
