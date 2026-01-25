import { useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/lib/i18n";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

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
  parallaxDepth: number; // translateZ value for CSS parallax
}

// Desktop grid layout configuration (4x2 grid, RTL order)
const scatterConfigs = [
  // Top row (right to left in RTL)
  { openX: "42%", openY: "-44%", zIndex: 8, width: "24%" },
  { openX: "14%", openY: "-44%", zIndex: 7, width: "24%" },
  { openX: "-14%", openY: "-44%", zIndex: 6, width: "24%" },
  { openX: "-42%", openY: "-44%", zIndex: 5, width: "24%" },
  // Bottom row (right to left in RTL)
  { openX: "42%", openY: "44%", zIndex: 4, width: "24%" },
  { openX: "14%", openY: "44%", zIndex: 3, width: "24%" },
  { openX: "-14%", openY: "44%", zIndex: 2, width: "24%" },
  { openX: "-42%", openY: "44%", zIndex: 1, width: "24%" },
];

// Parallax depth layers - different Z values create different scroll speeds
// More negative = moves slower (appears further back)
const parallaxDepths = [-8, -4, -2, -6, -3, -7, -5, -1];

// Calculate scale to compensate for translateZ (maintains visual size)
const getScaleForDepth = (depth: number, perspective: number): number => {
  // scale = 1 + (Math.abs(depth) / perspective)
  return 1 + (Math.abs(depth) / perspective);
};

const PERSPECTIVE = 10; // perspective value in px

const ServiceCard = ({ service, index, isVisible, isMobile, parallaxDepth }: ServiceCardProps) => {
  const config = scatterConfigs[index] || scatterConfigs[0];
  const scale = getScaleForDepth(parallaxDepth, PERSPECTIVE);
  
  if (isMobile) {
    return (
      <Link
        to={service.link}
        className={`group block scroll-reveal ${isVisible ? 'visible' : ''}`}
        style={{ 
          animationDelay: `${index * 0.1}s`,
          transformStyle: "preserve-3d",
        }}
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

  // Desktop: CSS Parallax with translateZ - no JavaScript scroll listeners!
  return (
    <Link
      to={service.link}
      className="absolute group cursor-pointer"
      style={{
        left: "50%",
        top: "50%",
        width: config.width,
        zIndex: config.zIndex,
        // CSS Parallax: translateZ creates depth, scale compensates for size
        transform: `translate(${config.openX}, ${config.openY}) translateZ(${parallaxDepth}px) scale(${scale})`,
        transformStyle: "preserve-3d",
        transition: "box-shadow 0.4s ease, filter 0.4s ease",
      }}
    >
      <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500">
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
  const sectionRef = useRef<HTMLElement>(null);
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

  // Mobile layout - simple grid
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
                parallaxDepth={0}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop: Pure CSS Parallax with perspective container
  return (
    <section
      ref={sectionRef}
      id="services"
      className={`relative scroll-reveal ${isVisible ? 'visible' : ''}`}
      style={{ 
        height: "200vh", // Extra height for scroll distance
      }}
    >
      {/* Parallax Container with perspective */}
      <div 
        ref={ref as React.RefObject<HTMLDivElement>}
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          perspective: `${PERSPECTIVE}px`,
          perspectiveOrigin: "center center",
        }}
      >
        {/* Background Layer - moves slowest */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"
          style={{
            transform: "translateZ(-15px) scale(2.5)",
            transformStyle: "preserve-3d",
          }}
          aria-hidden="true"
        />

        {/* Cards Container */}
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div 
            className="relative w-full max-w-6xl mx-auto" 
            style={{ 
              height: "85vh",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Section Title - front layer */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: "translateZ(2px) scale(0.8)",
                zIndex: 20,
              }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground drop-shadow-lg">
                {t("services.title")}
              </h2>
            </div>
            
            {/* Service Cards with varying depths */}
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                service={service}
                index={index}
                isVisible={isVisible}
                isMobile={false}
                parallaxDepth={parallaxDepths[index]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
