import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { usePreloadImage, getOptimizedUnsplashUrl } from "@/hooks/usePreloadImage";
import { useSharedParallax as useParallax } from "@/hooks/useSharedParallax";
import facadeBefore from "@/assets/facade-before.jpg";
import facadeAfter from "@/assets/facade-after.jpg";

const HERO_IMAGE = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00";

const FacadeRestoration = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const detailsRef = useScrollReveal();
  const beforeAfterRef = useScrollReveal();
  const projectsRef = useScrollReveal();

  // Parallax refs
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const serviceCardRef = useRef<HTMLDivElement>(null);
  const beforeAfterBgRef = useRef<HTMLDivElement>(null);
  
  const { style: heroImageStyle } = useParallax(heroImageRef, { speed: 0.3 });
  const { style: heroContentStyle } = useParallax(heroContentRef, { speed: 0.1 });
  const { style: serviceCardStyle } = useParallax(serviceCardRef, { speed: 0.08 });
  const { style: beforeAfterBgStyle } = useParallax(beforeAfterBgRef, { speed: 0.15 });
  
  // Staggered reveal for related projects
  const stagger0 = useStaggeredReveal({ index: 0, baseDelay: 100 });
  const stagger1 = useStaggeredReveal({ index: 1, baseDelay: 100 });
  const stagger2 = useStaggeredReveal({ index: 2, baseDelay: 100 });

  // Preload hero image for faster LCP
  usePreloadImage(getOptimizedUnsplashUrl(HERO_IMAGE, 1920, "webp"), {
    fetchpriority: "high",
    type: "image/webp"
  });

  const beforeAfterImages = [
    {
      before: facadeBefore,
      after: facadeAfter,
      title: "שיקום מעטפת בניין מגורים"
    },
    {
      before: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      after: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      title: "שיקום חזית בניין מגורים בתל אביב"
    },
    {
      before: "https://images.unsplash.com/photo-1590725121839-892b458a74fe?w=800",
      after: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800",
      title: "חידוש מעטפת בניין משרדים"
    },
    {
      before: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800",
      after: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
      title: "שיקום חזית אבן בירושלים"
    }
  ];

  const relatedProjects = [
    {
      id: 1,
      title: "שיקום בניין מגורים - רמת גן",
      category: "שיקום מעטפת",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      location: "רמת גן"
    },
    {
      id: 2,
      title: "שיקום חזית משרדים - הרצליה",
      category: "שיקום מעטפת",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      location: "הרצליה"
    },
    {
      id: 3,
      title: "חידוש מעטפת - פתח תקווה",
      category: "שיקום מעטפת",
      image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800",
      location: "פתח תקווה"
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % beforeAfterImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? beforeAfterImages.length - 1 : prev - 1
    );
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* Hero Section with Parallax */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-hero text-foreground overflow-hidden">
        <div ref={heroImageRef} className="absolute inset-0" style={heroImageStyle}>
          <img
            src={getOptimizedUnsplashUrl(HERO_IMAGE, 1920, "webp")}
            alt="שיקום מעטפת"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-30 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-hero/95 to-hero/80" />
        </div>
        
        <div 
          ref={heroContentRef}
          className="relative z-10 container mx-auto px-4 text-right"
          style={heroContentStyle}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            שיקום ושיפוץ מעטפת מבנים
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mr-auto leading-relaxed opacity-90">
            מומחים בשיקום חזיתות בניינים בטכניקות חבלים מתקדמות. אנו מבצעים עבודות שיפוץ
            והחלפת אלמנטים במעטפת המבנה תוך שמירה על בטיחות ואיכות מקסימלית.
          </p>
          <button
            onClick={scrollToContact}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-button font-medium hover:bg-primary/90 transition-all duration-300 shadow-button hover:shadow-button-hover"
          >
            בקשת הצעת מחיר
          </button>
        </div>
      </section>

      {/* Service Details */}
      <section ref={detailsRef.ref} className={`py-section bg-background scroll-reveal ${detailsRef.isVisible ? 'visible' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-right text-foreground">
              מה כולל שירות שיקום מעטפת?
            </h2>
            
            <div className="space-y-6 text-foreground/90 leading-relaxed">
              <p className="text-lg">
                שירות שיקום מעטפת מבנים הוא תהליך מקיף לשיפור, חידוש ושימור החזית החיצונית של המבנה.
                אנו משתמשים בטכניקות חבלים מתקדמות המאפשרות גישה לכל נקודה בגובה ללא צורך בפיגומים יקרים.
              </p>
              
              <div ref={serviceCardRef} style={serviceCardStyle} className="bg-card rounded-card p-8 border border-border">
                <h3 className="text-2xl font-bold mb-6 text-foreground">השירותים שלנו כוללים:</h3>
                <ul className="space-y-4 text-foreground/90">
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">•</span>
                    <span>תיקון סדקים ופגמים במעטפת הבניין</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">•</span>
                    <span>החלפת אלמנטים פגומים - חלונות, מעקות, חיפויים</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">•</span>
                    <span>שיפוץ וחידוש טיח חיצוני</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">•</span>
                    <span>צביעה וגימור של חזיתות בגובה</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">•</span>
                    <span>טיפול בנזקי מים ושחיקה</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">•</span>
                    <span>שיפור בידוד תרמי ואקוסטי</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">•</span>
                    <span>שיקום מעטפת לשימור מבנים היסטוריים</span>
                  </li>
                </ul>
              </div>

              <p className="text-lg">
                הצוות המקצועי שלנו מיומן בעבודה עם כל סוגי החומרים - בטון, אבן, טיח, מתכת וזכוכית.
                אנו מקפידים על בטיחות מקסימלית ועל עמידה בסטנדרטים הגבוהים ביותר.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section ref={beforeAfterRef.ref} className={`py-section bg-muted scroll-reveal relative overflow-hidden ${beforeAfterRef.isVisible ? 'visible' : ''}`}>
        <div ref={beforeAfterBgRef} style={beforeAfterBgStyle} className="absolute inset-0 bg-gradient-to-b from-muted via-muted to-background/50 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">
            לפני ואחרי
          </h2>
          
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Main Slider */}
            <BeforeAfterSlider
              beforeImage={beforeAfterImages[currentImageIndex].before}
              afterImage={beforeAfterImages[currentImageIndex].after}
              title={beforeAfterImages[currentImageIndex].title}
            />

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={nextImage}
                className="bg-background hover:bg-muted p-3 rounded-full transition-all duration-300 shadow-lg border border-border"
                aria-label="תמונה הבאה"
              >
                <ChevronRight className="w-6 h-6 text-foreground" />
              </button>
              
              {/* Indicators */}
              <div className="flex gap-2">
                {beforeAfterImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-primary w-8"
                        : "bg-muted-foreground/30 w-2"
                    }`}
                    aria-label={`תמונה ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={prevImage}
                className="bg-background hover:bg-muted p-3 rounded-full transition-all duration-300 shadow-lg border border-border"
                aria-label="תמונה קודמת"
              >
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section ref={projectsRef.ref} className={`py-section bg-background scroll-reveal ${projectsRef.isVisible ? 'visible' : ''}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">
            פרויקטים רלוונטיים
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {relatedProjects.map((project, index) => {
              const staggers = [stagger0, stagger1, stagger2];
              const { ref, isVisible, style } = staggers[index];
              return (
              <div
                key={project.id}
                ref={ref as any}
                style={style}
                className={`group bg-card rounded-card overflow-hidden border border-border hover:shadow-card-hover scroll-reveal-stagger ${isVisible ? 'visible' : ''}`}
              >
                <div className="relative overflow-hidden h-64">
                  <ImageWithSkeleton
                    src={project.image}
                    alt={project.title}
                    responsiveSizes={{ sm: 400, md: 500, lg: 600, xl: 800 }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-hero/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 right-0 left-0 p-6 text-right">
                      <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-button text-sm mb-3">
                        {project.category}
                      </span>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground">{project.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-muted">
        <Contact />
      </section>

      <Footer />
    </div>
  );
};

export default FacadeRestoration;