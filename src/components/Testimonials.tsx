import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
}

const Testimonials = () => {
  const { ref, isVisible } = useScrollReveal();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "דוד כהן",
      role: "מנהל פרויקטים",
      company: "חברת בנייה כהן ושות'",
      text: "עבדנו עם החברה על מספר פרויקטים מורכבים של שיקום מעטפות. המקצועיות, האמינות והבטיחות שהם מפגינים היא ברמה הגבוהה ביותר. ממליץ בחום!",
      rating: 5,
    },
    {
      id: 2,
      name: "שרה לוי",
      role: "מנהלת תחזוקה",
      company: "ועד בית משותף רמת אביב",
      text: "הצוות שיקם את חזית הבניין שלנו בצורה מושלמת. העבודה בוצעה במקצועיות, בזמן ובתקציב. הדיירים מרוצים מאוד מהתוצאה.",
      rating: 5,
    },
    {
      id: 3,
      name: "יוסי אברהם",
      role: "מנכ״ל",
      company: "קבוצת אברהם נדל״ן",
      text: "כשצריך עבודות גובה מורכבות, יש רק כתובת אחת. הם פתרו לנו בעיות שאף אחד אחר לא היה מוכן לטפל בהן. שירות יוצא מן הכלל!",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section ref={ref} id="testimonials" className={`py-16 lg:py-24 bg-background scroll-reveal ${isVisible ? 'visible' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            לקוחות ממליצים
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            מה הלקוחות שלנו אומרים על השירות והמקצועיות
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card border border-card-border rounded-card p-8 md:p-12 shadow-card">
            <Quote className="absolute top-6 right-6 text-primary/20" size={48} />

            <div key={currentTestimonial.id} className="relative z-10 animate-fade-in-up">
              {/* Rating */}
              <div className="flex gap-1 mb-6 justify-center md:justify-start">
                {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                  <Star key={i} className="text-primary fill-primary" size={20} />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 text-center md:text-right">
                "{currentTestimonial.text}"
              </p>

              {/* Client Info */}
              <div className="text-center md:text-right">
                <p className="font-semibold text-foreground text-lg">
                  {currentTestimonial.name}
                </p>
                <p className="text-muted-foreground">
                  {currentTestimonial.role} | {currentTestimonial.company}
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-full"
              aria-label="המלצה קודמת"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-full"
              aria-label="המלצה הבאה"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted"
                }`}
                aria-label={`עבור להמלצה ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* All Testimonials Grid (hidden on mobile, shown on large screens) */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 mt-16">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card border border-card-border rounded-card p-6 hover:shadow-card-hover transition-all"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="text-primary fill-primary" size={16} />
                ))}
              </div>
              <p className="text-sm text-foreground mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
