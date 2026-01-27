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
      {/* יותר גבוה = נראה "גדול" */}
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-none">
        <ImageWithSkeleton
          src={service.image}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover rounded-none transition-transform duration-700 group-hover:scale-110"
        />

        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* title bottom */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-white text-lg md:text-xl font-semibold drop-shadow text-right">{service.title}</h3>
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
    <section ref={ref} id="services" className={`bg-background scroll-reveal ${isVisible ? "visible" : ""}`}>
      {/* FULL BLEED */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="text-center mb-6 px-4 pt-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("services.title")}</h2>
          <p className="text-muted-foreground">{t("services.subtitle")}</p>
        </div>

        {/* יותר גדול בדסקטופ = 3 עמודות במקום 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-black/10">
          {services.map((service, index) => (
            <ServiceTile key={service.link} service={service} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
