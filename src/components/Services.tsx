import { useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/lib/i18n";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSharedParallax } from "@/hooks/useSharedParallax";

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
  isMobile?: boolean;
}

// Desktop grid layout configuration (4x2 grid, RTL order)
const scatterConfigs = [
  // Top row (right to left in RTL)
  { openX: "42%", openY: "-44%", openRotate: 0, scale: 1, zIndex: 8, width: "24%" },
  { openX: "14%", openY: "-44%", openRotate: 0, scale: 1, zIndex: 7, width: "24%" },
  { openX: "-14%", openY: "-44%", openRotate: 0, scale: 1, zIndex: 6, width: "24%" },
  { openX: "-42%", openY: "-44%", openRotate: 0, scale: 1, zIndex: 5, width: "24%" },
  // Bottom row (right to left in RTL)
  { openX: "42%", openY: "44%", openRotate: 0, scale: 1, zIndex: 4, width: "24%" },
  { openX: "14%", openY: "44%", openRotate: 0, scale: 1, zIndex: 3, width: "24%" },
  { openX: "-14%", openY: "44%", openRotate: 0, scale: 1, zIndex: 2, width: "24%" },
  { openX: "-42%", openY: "44%", openRotate: 0, scale: 1, zIndex: 1, width: "24%" },
];

const ServiceCard = ({ service, index, isVisible, isMobile }: ServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { offset } = useSharedParallax(cardRef, { speed: 0.03 });
  const config = scatterConfigs[index] || scatterConfigs[0];
  
  if (isMobile) {
    return (
      <Link
        to={service.link}
        className={`group block scroll-reveal ${isVisible ? 'visible' : ''}`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="overflow-hidden rounded-xl bg-card border border-card-border shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="aspect-[4/3] overflow-hidden">
            <ImageWithSkeleton
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-bold text-foreground text-base mb-1">
              {service.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // Desktop: Scattered parallax layout - overlay title on image
  return (
    <Link
      to={service.link}
      className="absolute group cursor-pointer transform-gpu will-change-transform"
      style={{
        left: "50%",
        top: "50%",
        width: config.width,
        zIndex: config.zIndex,
        transform: `translate(${config.openX}, ${config.openY}) rotate(${config.openRotate}deg) scale(${config.scale}) translateY(${offset * (index % 2 === 0 ? 1 : -1) * 0.5}px)`,
        transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div ref={cardRef} className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="aspect-[4/3] overflow-hidden">
          <ImageWithSkeleton
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        {/* Overlay with title on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
          <h3 className="font-bold text-white text-lg drop-shadow-md">
            {service.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

const Services = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal();
  const isMobile = useIsMobile();

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

  // Mobile layout
  if (isMobile) {
    return (
      <section
        ref={ref}
        id="services"
        className={`py-16 bg-background scroll-reveal ${isVisible ? 'visible' : ''}`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              {t("services.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("services.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                service={service}
                index={index}
                isVisible={isVisible}
                isMobile={true}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop: Scattered parallax layout
  return (
    <section
      ref={ref}
      id="services"
      className={`relative bg-background scroll-reveal ${isVisible ? 'visible' : ''}`}
      style={{ height: "120vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-6xl mx-auto" style={{ height: "85vh" }}>
          {/* Section Title */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground drop-shadow-lg">
              {t("services.title")}
            </h2>
          </div>
          
          {/* Service Cards */}
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              index={index}
              isVisible={isVisible}
              isMobile={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
