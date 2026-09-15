import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ArrowLeft, MapPin, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Project images - using existing assets
import facadeBeforeImg from "@/assets/facade-before.jpg";
import facadeAfterImg from "@/assets/facade-after.jpg";
import stoneVeneerBeforeImg from "@/assets/stone-veneer-before.jpg";
import stoneVeneerAfterImg from "@/assets/stone-veneer-after.jpg";
import stoneVeneerBefore2Img from "@/assets/stone-veneer-before-2.jpg";
import stoneVeneerAfter2Img from "@/assets/stone-veneer-after-2.jpg";
import stoneVeneerBefore3Img from "@/assets/stone-veneer-before-3.jpg";
import stoneVeneerAfter3Img from "@/assets/stone-veneer-after-3.jpg";
import facadeRestorationImage from "@/assets/facade-restoration.webp";
import waterproofingImage from "@/assets/waterproofing.webp";

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  units?: number;
  images: string[];
  description?: string;
}

const ProjectCard = ({ 
  project, 
  onOpen 
}: { 
  project: Project; 
  onOpen: (project: Project) => void 
}) => {
  return (
    <div
      className="group relative overflow-hidden cursor-pointer"
      onClick={() => onOpen(project)}
    >
      {/* Card Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Image */}
        <img 
          src={project.images[project.images.length - 1]}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Hover Info Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{project.location}</span>
          </div>
          {project.units && (
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Building2 className="w-4 h-4 text-primary" />
              <span>יחידות דיור: {project.units}</span>
            </div>
          )}
        </div>
        
        {/* Project Title - Always Visible */}
        <div className="absolute bottom-0 inset-x-0 p-4 text-center">
          <h3 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#e4d9bc] via-[#ddc189] to-[#c9a84c] drop-shadow-lg">
            {project.title}
          </h3>
        </div>
      </div>
    </div>
  );
};

// Decorative cross pattern component
const DecorativePattern = ({ className }: { className?: string }) => (
  <div className={`absolute pointer-events-none ${className}`}>
    <div className="grid grid-cols-5 gap-8">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className="w-3 h-3 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

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
      units: 85,
      images: [facadeBeforeImg, facadeAfterImg],
      description: "שיקום מלא של מעטפת הבניין כולל טיפול בסדקים, איטום וצביעה מחודשת."
    },
    {
      id: 2,
      title: "חיפוי אבן טבעית",
      category: "חיפוי אבן",
      location: "ירושלים",
      units: 120,
      images: [stoneVeneerBeforeImg, stoneVeneerAfterImg],
      description: "התקנת חיפוי אבן טבעית על חזית הבניין עם עיגון מקצועי."
    },
    {
      id: 3,
      title: "שיפוץ בניין מגורים",
      category: "שיקום מעטפת",
      location: "חיפה",
      units: 64,
      images: [stoneVeneerBefore2Img, stoneVeneerAfter2Img],
      description: "שיפוץ כללי של חזית הבניין כולל תיקון נזקי רטיבות."
    },
    {
      id: 4,
      title: "עיגון אבני חזית",
      category: "חיפוי אבן",
      location: "רמת גן",
      units: 48,
      images: [stoneVeneerBefore3Img, stoneVeneerAfter3Img],
      description: "עיגון מחדש של אבני חזית שהשתחררו עם אבטחה מקצועית."
    },
    {
      id: 5,
      title: "פרויקט מגדלי הנוריות",
      category: "שיקום מעטפת",
      location: "נתניה",
      units: 156,
      images: [facadeRestorationImage],
      description: "שיקום מקיף של מגדלי מגורים כולל חידוש חזיתות."
    },
    {
      id: 6,
      title: "איטום ושיפוץ",
      category: "איטום",
      location: "באר שבע",
      units: 72,
      images: [waterproofingImage],
      description: "עבודות איטום מקיפות ושיפוץ חזיתות."
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
      className={`py-16 lg:py-24 bg-[#050f1a] relative overflow-hidden scroll-reveal ${isVisible ? 'visible' : ''}`}
    >
      {/* Decorative Patterns - Left & Right */}
      <DecorativePattern className="top-1/4 -left-8 opacity-60 hidden lg:block" />
      <DecorativePattern className="top-1/2 -right-8 opacity-60 hidden lg:block" />
      <DecorativePattern className="bottom-20 -left-8 opacity-60 hidden lg:block" />
      <DecorativePattern className="bottom-1/4 -right-8 opacity-60 hidden lg:block" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header - oaharon style */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#e4d9bc] via-[#ddc189] to-[#8a6b2e]">
            פרויקטים נבחרים
          </h2>
          <div className="w-1.5 h-12 md:h-16 bg-gradient-to-b from-[#ddc189] via-[#c9a84c] to-[#8a6b2e] rounded-full" />
        </div>

        {/* Projects Grid - 3x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-white/5 p-1 mb-12">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={openProject}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-transparent border-2 border-primary/50 text-primary-foreground hover:bg-primary/10 hover:border-primary transition-all duration-300 group px-8"
          >
            <Link to="/projects" className="flex items-center gap-2">
              לפרויקטים שלנו
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Project Modal */}
        <Dialog open={!!selectedProject} onOpenChange={closeProject}>
          <DialogContent 
            className="max-w-4xl bg-gradient-to-br from-[#0c1d2f] to-[#050f1a] border border-primary/30" 
            dir="rtl"
          >
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#e4d9bc] to-primary">
                    {selectedProject.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      <strong className="text-primary">קטגוריה:</strong> {selectedProject.category}
                    </span>
                    <span className="text-muted-foreground">
                      <strong className="text-primary">מיקום:</strong> {selectedProject.location}
                    </span>
                  </div>

                  {/* Image Carousel */}
                  <div className="relative rounded-xl overflow-hidden border border-primary/20 aspect-video">
                    <img 
                      src={selectedProject.images[currentImageIndex]} 
                      alt={`${selectedProject.title} - תמונה ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Image Label */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-sm text-foreground border border-primary/30">
                      {currentImageIndex === 0 ? "לפני" : "אחרי"}
                    </div>

                    {selectedProject.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-primary/20 text-foreground rounded-full p-2 border border-primary/30 transition-all duration-300"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-primary/20 text-foreground rounded-full p-2 border border-primary/30 transition-all duration-300"
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
                              ? 'bg-primary w-6' 
                              : 'bg-primary/30 hover:bg-primary/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {selectedProject.description && (
                    <div className="prose max-w-none">
                      <p className="text-muted-foreground">
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
