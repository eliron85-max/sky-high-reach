import { Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
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

  const autoplayPlugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

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
      dir="rtl"
      className={cn(
        "bg-black py-12 sm:py-16 lg:py-20",
        "transition-opacity duration-700",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Client Avatars Row */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex -space-x-2 sm:-space-x-3 rtl:space-x-reverse">
            {clientAvatars.map((avatar, index) => (
              <div
                key={index}
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full",
                  avatar.bg,
                  "flex items-center justify-center text-white text-xs sm:text-sm font-medium",
                  "border-2 border-black shadow-md"
                )}
                style={{ zIndex: clientAvatars.length - index }}
              >
                {avatar.initials}
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 text-white">
          מה הלקוחות שלנו אומרים
        </h2>
        <p className="text-white/70 text-center mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
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
          <CarouselContent className="-ml-3 sm:-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-3 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-border h-full flex flex-col">
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary/20 mb-3 sm:mb-4" />
                  <p className="text-foreground/80 leading-relaxed flex-grow mb-3 sm:mb-4 text-sm sm:text-base">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-auto pt-3 sm:pt-4 border-t border-border/50">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs sm:text-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm sm:text-base">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 sm:h-2.5 rounded-full transition-all duration-300",
                current === index
                  ? "bg-primary w-5 sm:w-6"
                  : "bg-white/25 w-2 sm:w-2.5 hover:bg-white/40"
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
