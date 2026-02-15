import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { useTranslation } from "@/lib/i18n";

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
  const { t } = useTranslation();
  
  const services = [
    {
      image: facadeRestorationImage,
      title: t("servicesPage.items.facadeRestoration.title"),
      description: t("servicesPage.items.facadeRestoration.description"),
      link: "/facade-restoration",
    },
    {
      image: stoneVeneerImage,
      title: t("servicesPage.items.stoneVeneer.title"),
      description: t("servicesPage.items.stoneVeneer.description"),
      link: "/stone-veneer",
    },
    {
      image: waterproofingImage,
      title: t("servicesPage.items.waterproofing.title"),
      description: t("servicesPage.items.waterproofing.description"),
      link: "/waterproofing",
    },
    {
      image: birdControlImage,
      title: t("servicesPage.items.birdControl.title"),
      description: t("servicesPage.items.birdControl.description"),
      link: "/bird-control",
    },
    {
      image: specialProjectsImage,
      title: t("servicesPage.items.specialWorks.title"),
      description: t("servicesPage.items.specialWorks.description"),
      link: "/special-projects",
    },
    {
      image: demolitionOrdersImage,
      title: t("servicesPage.items.demolitionOrders.title"),
      description: t("servicesPage.items.demolitionOrders.description"),
      link: "/demolition-orders",
    },
    {
      image: pipingGuttersImage,
      title: t("servicesPage.items.pipingGutters.title"),
      description: t("servicesPage.items.pipingGutters.description"),
      link: "/piping-gutters",
    },
    {
      image: heightSolutionsImage,
      title: t("servicesPage.items.heightSolutions.title"),
      description: t("servicesPage.items.heightSolutions.description"),
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
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">{t("servicesPage.heroTitle")}</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
              {t("servicesPage.heroSubtitle")}
            </p>
          </div>
         </section>

         <SectionDivider />

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
