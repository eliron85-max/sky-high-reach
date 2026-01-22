import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ArrowLeft, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSharedParallax as useParallax } from "@/hooks/useSharedParallax";

// Project images - using existing assets
import facadeBeforeImg from "@/assets/facade-before.jpg";
import facadeAfterImg from "@/assets/facade-after.jpg";
import stoneVeneerBeforeImg from "@/assets/stone-veneer-before.jpg";
import stoneVeneerAfterImg from "@/assets/stone-veneer-after.jpg";
import stoneVeneerBefore2Img from "@/assets/stone-veneer-before-2.jpg";
import stoneVeneerAfter2Img from "@/assets/stone-veneer-after-2.jpg";
import stoneVeneerBefore3Img from "@/assets/stone-veneer-before-3.jpg";
import stoneVeneerAfter3Img from "@/assets/stone-veneer-after-3.jpg";

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  images: string[];
  description?: string;
}

const LuxuryProjectCard = ({ 
  project, 
  index, 
  onOpen 
}: { 
  project: Project; 
  index: number; 
  onOpen: (project: Project) => void 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { offset: parallaxOffset } = useParallax(cardRef, { speed: 0.15 });
  const { ref: staggerRef, isVisible, style: staggerStyle } = useStaggeredReveal({ index, baseDelay: 120 });

  return (
    <div
      ref={(el) => {
        cardRef.current = el;
        (staggerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      className={`group relative overflow-hidden cursor-pointer scroll-reveal-stagger ${isVisible ? 'visible' : ''}`}
      style={staggerStyle}
      onClick={() => onOpen(project)}
    >
      {/* Card Container with Gold Border */}
      <div className="relative rounded-xl overflow-hidden border border-[#c9a84c]/30 hover:border-[#c9a84c]/60 transition-all duration-500 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
        {/* Image Container with Parallax */}
        <div className="aspect-[4/3] overflow-hidden relative">
          <div 
            className="absolute inset-0"
            style={{ 
              transform: `translateY(${parallaxOffset}px) scale(1.1)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <img 
              src={project.images[project.images.length - 1]}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
          
          {/* Gold Corner Accents */}
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#c9a84c]/50 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#c9a84c]/50 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Hover Overlay with Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-16 h-16 rounded-full bg-[#c9a84c]/20 backdrop-blur-sm border border-[#c9a84c]/40 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500">
              <Eye className="w-7 h-7 text-[#e8d5a3]" />
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 relative">
          {/* Category Badge */}
          <span className="inline-block px-3 py-1 text-xs font-medium bg-[#c9a84c]/10 text-[#c9a84c] rounded-full border border-[#c9a84c]/20 mb-3">
            {project.category}
          </span>
          
          <h3 className="text-lg font-bold text-[#e8d5a3] mb-1 group-hover:text-white transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-[#e8d5a3]/60">{project.location}</p>
          
          {/* Gold Underline Animation */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </div>
      </div>
    </div>
  );
};

const HomeProjects = () => {
  const { ref, isVisible } = useScrollReveal();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const featuredProjects: Project[] = [
    {
      id: 1,
      title: "שיקום מעטפת מלון דן",
      category: "שיקום מעטפת",
      location: "תל אביב",
      images: [facadeBeforeImg, facadeAfterImg],
      description: "שיקום מלא של מעטפת הבניין כולל טיפול בסדקים, איטום וצביעה מחודשת."
    },
    {
      id: 2,
      title: "חיפוי אבן טבעית",
      category: "חיפוי אבן",
      location: "ירושלים",
      images: [stoneVeneerBeforeImg, stoneVeneerAfterImg],
      description: "התקנת חיפוי אבן טבעית על חזית הבניין עם עיגון מקצועי."
    },
    {
      id: 3,
      title: "שיפוץ בניין מגורים",
      category: "שיקום מעטפת",
      location: "חיפה",
      images: [stoneVeneerBefore2Img, stoneVeneerAfter2Img],
      description: "שיפוץ כללי של חזית הבניין כולל תיקון נזקי רטיבות."
    },
    {
      id: 4,
      title: "עיגון אבני חזית",
      category: "חיפוי אבן",
      location: "רמת גן",
      images: [stoneVeneerBefore3Img, stoneVeneerAfter3Img],
      description: "עיגון מחדש של אבני חזית שהשתחררו עם אבטחה מקצועית."
    },
  ];

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeProject = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length
      );
    }
  };

  return (
    <section 
      ref={ref} 
      id="home-projects" 
      className={`py-16 lg:py-24 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#1a1a1a] relative overflow-hidden scroll-reveal ${isVisible ? 'visible' : ''}`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c9a84c]/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 text-sm font-medium bg-[#c9a84c]/10 text-[#c9a84c] rounded-full border border-[#c9a84c]/20 mb-4">
            הפרויקטים המובילים שלנו
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-b from-[#e8d5a3] via-[#d4af37] to-[#c9a84c]">
            מציגים את העבודות שלנו
          </h2>
          <p className="text-[#e8d5a3]/60 max-w-2xl mx-auto text-lg">
            גלריה של פרויקטים מוצלחים שביצענו ברחבי הארץ, כולל תמונות לפני ואחרי
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProjects.map((project, index) => (
            <LuxuryProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={openProject}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-transparent border-2 border-[#c9a84c]/50 text-[#e8d5a3] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all duration-300 group px-8"
          >
            <Link to="/projects" className="flex items-center gap-2">
              לכל הפרויקטים
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Project Modal */}
        <Dialog open={!!selectedProject} onOpenChange={closeProject}>
          <DialogContent 
            className="max-w-4xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#c9a84c]/30" 
            dir="rtl"
          >
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]">
                    {selectedProject.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#e8d5a3]/70">
                      <strong className="text-[#c9a84c]">קטגוריה:</strong> {selectedProject.category}
                    </span>
                    <span className="text-[#e8d5a3]/70">
                      <strong className="text-[#c9a84c]">מיקום:</strong> {selectedProject.location}
                    </span>
                  </div>

                  {/* Image Carousel */}
                  <div className="relative rounded-xl overflow-hidden border border-[#c9a84c]/20 aspect-video">
                    <img 
                      src={selectedProject.images[currentImageIndex]} 
                      alt={`${selectedProject.title} - תמונה ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Image Label */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-sm text-[#e8d5a3] border border-[#c9a84c]/30">
                      {currentImageIndex === 0 ? "לפני" : "אחרי"}
                    </div>

                    {selectedProject.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#c9a84c]/20 text-[#e8d5a3] rounded-full p-2 border border-[#c9a84c]/30 transition-all duration-300"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#c9a84c]/20 text-[#e8d5a3] rounded-full p-2 border border-[#c9a84c]/30 transition-all duration-300"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedProject.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === currentImageIndex 
                              ? 'bg-[#c9a84c] w-6' 
                              : 'bg-[#c9a84c]/30 hover:bg-[#c9a84c]/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {selectedProject.description && (
                    <div className="prose max-w-none">
                      <p className="text-[#e8d5a3]/70">
                        {selectedProject.description}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default HomeProjects;
