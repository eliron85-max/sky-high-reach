import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";

// Import service images
import facadeRestorationImage from "@/assets/facade-restoration.webp";
import stoneVeneerImage from "@/assets/stone-veneer.webp";
import waterproofingImage from "@/assets/waterproofing.webp";
import birdControlImage from "@/assets/bird-control.webp";
import specialProjectsImage from "@/assets/special-projects.webp";
import demolitionOrdersImage from "@/assets/demolition-orders.webp";
import pipingGuttersImage from "@/assets/piping-gutters.webp";
import heightSolutionsImage from "@/assets/height-solutions.webp";

const ServicesPage = () => {
  const { ref, isVisible } = useScrollReveal();
  
  const services = [
    {
      image: facadeRestorationImage,
      title: "שיקום ושיפוץ מעטפת",
      description: "תיקון ושיפוץ מעטפות בניינים, טיפול בסדקים, החלפת אלמנטים פגומים ושיקום מבני חזית.",
      link: "/facade-restoration",
    },
    {
      image: stoneVeneerImage,
      title: "חיפוי ועיגון אבנים",
      description: "התקנת חיפוי אבן בגובה, עיגון אבנים רופפות וטיפול במעטפות אבן טבעית ומלאכותית.",
      link: "/stone-veneer",
    },
    {
      image: waterproofingImage,
      title: "איטום בגובה",
      description: "איטום גגות, קירות חוץ, מרפסות וחלונות. מניעת חדירת מים ולחות לבניין.",
      link: "/waterproofing",
    },
    {
      image: birdControlImage,
      title: "הרחקת מעופפים",
      description: "התקנת מערכות הרחקת יונים ועופות, רשתות, קוצים ומערכות אלקטרוניות.",
      link: "/bird-control",
    },
    {
      image: specialProjectsImage,
      title: "עבודות גובה מיוחדות",
      description: "פרויקטים ייחודיים הדורשים גישה בחבלים, כולל התקנות מיוחדות ופרויקטי אמנות.",
      link: "/special-projects",
    },
    {
      image: demolitionOrdersImage,
      title: "ביטול צווי הריסה",
      description: "ליווי משפטי ומקצועי בתהליך הכשרת חריגות בנייה וטיפול בצווי הריסה.",
      link: "/demolition-orders",
    },
    {
      image: pipingGuttersImage,
      title: "התקנת צנרת ומרזבים",
      description: "התקנה ותיקון מערכות ניקוז, צנרות ומרזבים בגבהים.",
      link: "/piping-gutters",
    },
    {
      image: heightSolutionsImage,
      title: "פתרונות בגובה",
      description: "כל פתרון שדורש גישה בגובה - ניקוי, תיקון, התקנה ותחזוקה.",
      link: "/height-solutions",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-header-offset lg:pt-header-offset-lg">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-hero-dark text-white overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">השירותים שלנו</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
              מגוון רחב של שירותי עבודות גובה מקצועיים עם דגש על בטיחות, איכות ושירות אמין
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section ref={ref} className={`py-16 lg:py-24 bg-background scroll-reveal ${isVisible ? 'visible' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Link
                  key={index}
                  to={service.link}
                  className={`group block animate-fade-in`}
                  style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
                >
                  <div className="overflow-hidden rounded-xl bg-card border border-card-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <div className="aspect-[4/3] overflow-hidden">
                      <ImageWithSkeleton
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="font-bold text-foreground text-lg mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
