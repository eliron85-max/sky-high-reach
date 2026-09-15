import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import logoImage from "@/assets/logo-new.webp";

// Service Images
import facadeRestorationImage from "@/assets/facade-restoration.webp";
import waterproofingImage from "@/assets/waterproofing.webp";
import birdControlImage from "@/assets/bird-control.webp";
import specialProjectsImage from "@/assets/special-projects.webp";
import stoneVeneerImage from "@/assets/stone-cladding.jpg";
import demolitionOrdersImage from "@/assets/demolition-orders.webp";
import pipingGuttersImage from "@/assets/piping-gutters.webp";
import heightSolutionsImage from "@/assets/height-solutions.webp";
interface ServiceCard {
  title: string;
  image: string;
  link: string;
}
const HeroWithCards = () => {
  const {
    t,
    dir
  } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);

  // All 8 services for hero cards
  const heroServices: ServiceCard[] = [{
    title: t("services.items.facadeRestoration.title"),
    image: facadeRestorationImage,
    link: "/facade-restoration"
  }, {
    title: t("services.items.stoneVeneer.title"),
    image: stoneVeneerImage,
    link: "/stone-veneer"
  }, {
    title: t("services.items.waterproofing.title"),
    image: waterproofingImage,
    link: "/waterproofing"
  }, {
    title: t("services.items.birdControl.title"),
    image: birdControlImage,
    link: "/bird-control"
  }, {
    title: t("services.items.specialWorks.title"),
    image: specialProjectsImage,
    link: "/special-projects"
  }, {
    title: t("services.items.safetyInspections.title"),
    image: demolitionOrdersImage,
    link: "/demolition-orders"
  }, {
    title: t("services.items.anchoring.title"),
    image: pipingGuttersImage,
    link: "/special-projects"
  }, {
    title: t("services.items.generalRenovations.title"),
    image: heightSolutionsImage,
    link: "/special-projects"
  }];
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <section ref={heroRef} dir={dir} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Video background */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/hero.webm" type="video/webm" />
      </video>

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Gold gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4">
        {/* Top Logo Section with Dark Rounded Background */}
        <div className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2">
          
        </div>

        {/* Main Title */}
        <div className="text-center mt-4 md:mt-8 mb-4 md:mb-12">
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-1 md:mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#e4d9bc] to-[#c9a84c]">
              {t("hero.slide1Title")}
            </span>
          </h1>
          <p className="text-sm md:text-2xl text-[#e4d9bc]/80 max-w-2xl mx-auto px-2">
            {t("hero.slide1Subtitle")}
          </p>
        </div>

        {/* Service Cards - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 lg:gap-6 max-w-6xl mx-auto px-4">
        {heroServices.map((service, index) => <Link key={index} to={service.link} className="group relative overflow-hidden rounded-xl md:rounded-2xl aspect-[4/3] shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-[fade-in_0.6s_ease-out_forwards]">
              {/* Solid dark background to prevent video bleed-through */}
              <div className="absolute inset-0 bg-black" />

              {/* Card Image */}
              <ImageWithSkeleton src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

              {/* Glass overlay effect - full coverage */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

              {/* Decorative border */}
              <div className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-[#c9a84c]/30 group-hover:border-[#c9a84c]/60 transition-colors duration-300" />

              {/* Card Title */}
              <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
                <h3 className="text-white text-xs md:text-base lg:text-lg font-bold text-center drop-shadow-lg leading-tight">
                  {service.title}
                </h3>
              </div>
            </Link>)}
        </div>

        {/* Scroll Down Arrow */}
        <button onClick={() => scrollToSection("services")} className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer group" aria-label={t("hero.nextSlide")}>
          <div className="flex flex-col items-center">
            <ChevronDown size={40} className="text-[#c9a84c] group-hover:text-[#e4d9bc] transition-colors duration-300" strokeWidth={3} />
            <ChevronDown size={40} className="text-[#c9a84c]/50 group-hover:text-[#e4d9bc]/50 transition-colors duration-300 -mt-6" strokeWidth={3} />
          </div>
        </button>
      </div>
    </section>;
};
export default HeroWithCards;