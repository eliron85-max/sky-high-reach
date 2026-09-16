import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/lib/i18n";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { Link } from "react-router-dom";

// Import service images
import facadeRestorationImage from "@/assets/facade-restoration.webp";
import stoneVeneerImage from "@/assets/stone-veneer.webp";
import waterproofingImage from "@/assets/waterproofing.webp";
import birdControlImage from "@/assets/bird-control.webp";
import specialProjectsImage from "@/assets/special-projects.webp";
import demolitionOrdersImage from "@/assets/demolition-orders.webp";
import pipingGuttersImage from "@/assets/piping-gutters.webp";
import heightSolutionsImage from "@/assets/height-solutions.webp";

interface ServiceCardProps {
  service: {
    title: string;
    description: string;
    image: string;
    link: string;
  };
  index: number;
  isVisible: boolean;
}

const ServiceTile = ({ service, index, isVisible }: ServiceCardProps) => {
  return (
    <Link
      to={service.link}
      className={`group block scroll-reveal ${isVisible ? "visible" : ""} transition-all duration-500`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="relative w-full aspect-[3/2] overflow-hidden">
        <ImageWithSkeleton
          src={service.image}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="py-3 px-1 text-right">
        <h3 className="text-foreground text-sm md:text-base font-medium tracking-wide">{service.title}</h3>
        <div className="mt-1 h-px w-0 bg-[#c9a84c] transition-all duration-500 group-hover:w-full mr-0 ml-auto" />
      </div>
    </Link>
  );
};

const Services = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal();

  const services = [
    {
      title: t("services.items.facadeRestoration.title"),
      description: t("services.items.facadeRestoration.description"),
      image: facadeRestorationImage,
      link: "/facade-restoration",
    },
    {
      title: t("services.items.stoneVeneer.title"),
      description: t("services.items.stoneVeneer.description"),
      image: stoneVeneerImage,
      link: "/stone-veneer",
    },
    {
      title: t("services.items.waterproofing.title"),
      description: t("services.items.waterproofing.description"),
      image: waterproofingImage,
      link: "/waterproofing",
    },
    {
      title: t("services.items.birdControl.title"),
      description: t("services.items.birdControl.description"),
      image: birdControlImage,
      link: "/bird-control",
    },
    {
      title: t("services.items.specialWorks.title"),
      description: t("services.items.specialWorks.description"),
      image: specialProjectsImage,
      link: "/special-projects",
    },
    {
      title: t("services.items.demolitionOrders.title"),
      description: t("services.items.demolitionOrders.description"),
      image: demolitionOrdersImage,
      link: "/demolition-orders",
    },
    {
      title: t("services.items.pipingGutters.title"),
      description: t("services.items.pipingGutters.description"),
      image: pipingGuttersImage,
      link: "/piping-gutters",
    },
    {
      title: t("services.items.heightSolutions.title"),
      description: t("services.items.heightSolutions.description"),
      image: heightSolutionsImage,
      link: "/height-solutions",
    },
    {
      title: t("services.items.heightSolutions.title"),
      description: t("services.items.heightSolutions.description"),
      image: heightSolutionsImage,
      link: "/height-solutions",
    },
  ];

  return (
    <section ref={ref} id="services" className={`bg-background scroll-reveal ${isVisible ? "visible" : ""}`}>
      {/* FULL BLEED */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="text-center mb-6 px-4 pt-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("services.title")}</h2>
          <p className="text-muted-foreground">{t("services.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-6 md:px-12 lg:px-20 pb-10">
          {services.map((service, index) => (
            <ServiceTile key={`${service.link}-${index}`} service={service} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
