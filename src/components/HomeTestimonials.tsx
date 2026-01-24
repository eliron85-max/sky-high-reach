import { Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  initials: string;
}

const HomeTestimonials = () => {
  const { ref, isVisible } = useScrollReveal();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "דודו בוזגלו",
      role: "מנהל פרויקטים, חברת בנייה",
      text: "עבדנו עם החברה על מספר פרויקטים מורכבים. המקצועיות והאמינות שהם מפגינים היא ברמה הגבוהה ביותר. ממליץ בחום!",
      initials: "דב",
    },
    {
      id: 2,
      name: "שרה לוי",
      role: "יזמית נדל״ן",
      text: "תוצאות מעולות בשיפוץ חזית הבניין שלנו. הצוות היה מקצועי, עמד בלוחות הזמנים והתוצאה עלתה על הציפיות.",
      initials: "של",
    },
    {
      id: 3,
      name: "משה אברהם",
      role: "וועד בית, רמת גן",
      text: "פתרון מקצועי לבעיית הרטיבות שנמשכה שנים. עבודה יסודית ומקיפה עם אחריות מלאה. תודה רבה!",
      initials: "מא",
    },
    {
      id: 4,
      name: "רחל גולדשטיין",
      role: "מנהלת נכסים",
      text: "שירות אדיב, מקצועי ואמין. ביצעו עבודות גובה מורכבות בבניין שלנו בצורה מושלמת ובטוחה.",
      initials: "רג",
    },
  ];

  const clientAvatars = [
    { initials: "דב", bg: "bg-amber-500" },
    { initials: "של", bg: "bg-emerald-500" },
    { initials: "מא", bg: "bg-blue-500" },
    { initials: "רג", bg: "bg-purple-500" },
    { initials: "יכ", bg: "bg-rose-500" },
  ];

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section
      ref={ref}
      id="testimonials"
      className={`py-20 md:py-28 bg-background transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="container mx-auto px-4">
        {/* Client Avatars Row */}
        <div className="flex justify-center mb-8">
          <div className="flex -space-x-3 rtl:space-x-reverse">
            {clientAvatars.map((avatar, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-full ${avatar.bg} flex items-center justify-center text-white text-sm font-medium border-2 border-background shadow-md`}
                style={{ zIndex: clientAvatars.length - index }}
              >
                {avatar.initials}
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          מה הלקוחות שלנו אומרים
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          לקוחות מרוצים משתפים את החוויה שלהם מעבודה איתנו
        </p>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            direction: "rtl",
          }}
          plugins={[autoplayPlugin.current]}
          setApi={setApi}
          className="w-full max-w-5xl mx-auto"
          onMouseEnter={() => autoplayPlugin.current.stop()}
          onMouseLeave={() => autoplayPlugin.current.play()}
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="bg-card rounded-2xl p-6 shadow-lg border border-border h-full flex flex-col">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <p className="text-foreground/80 leading-relaxed flex-grow mb-4">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                current === index 
                  ? "bg-primary w-6" 
                  : "bg-muted-foreground/30 w-2.5 hover:bg-muted-foreground/50"
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`עבור להמלצה ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
