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
      className={`group block scroll-reveal ${isVisible ? "visible" : ""} hover:opacity-95 transition-opacity`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <ImageWithSkeleton
          src={service.image}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* title centered */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h3 className="text-white text-lg md:text-xl font-semibold drop-shadow text-center">{service.title}</h3>
        </div>
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
      title: t("services.items.safetyInspections.title"),
      description: t("services.items.safetyInspections.description"),
      image: demolitionOrdersImage,
      link: "/demolition-orders",
    },
    {
      title: t("services.items.anchoring.title"),
      description: t("services.items.anchoring.description"),
      image: pipingGuttersImage,
      link: "/piping-gutters",
    },
    {
      title: t("services.items.generalRenovations.title"),
      description: t("services.items.generalRenovations.description"),
      image: heightSolutionsImage,
      link: "/height-solutions",
    },
  ];

  return (
    <section ref={ref} id="services" className={`py-16 bg-background scroll-reveal ${isVisible ? "visible" : ""}`}>
      {/* אם אתה רוצה FULL BLEED עד הקצה: החלף את השורה הזו ל: <div className="w-full"> */}
      <div className="w-full max-w-none px-0">
        <div className="text-center mb-10 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t("services.title")}</h2>
          <p className="text-muted-foreground">{t("services.subtitle")}</p>
        </div>

        {/* Tiles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-black/10">
          {services.map((service, index) => (
            <ServiceTile key={service.link} service={service} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
