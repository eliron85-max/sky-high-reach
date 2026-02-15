import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSharedParallax as useParallax } from "@/hooks/useSharedParallax";
import facadeProject1 from "@/assets/facade-project-4.webp";

import facadeProject5 from "@/assets/facade-project-5.webp";
import netanyaProject from "@/assets/netanya-project.webp";


interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  images: string[];
}

const ProjectCard = ({ project, index, onOpen }: { project: Project; index: number; onOpen: (project: Project) => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const parallaxOffset = useParallax(cardRef, 0.3);

  return (
    <div
      ref={cardRef}
      className="group relative rounded-card overflow-hidden cursor-pointer hover:shadow-card-hover transition-all duration-300"
      onClick={() => onOpen(project)}
    >
      {/* Image Placeholder with Parallax */}
      <div className="bg-muted flex items-center justify-center overflow-hidden relative aspect-[4/3] md:aspect-[3/2] lg:h-[100vh]">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20"
          style={{ 
            transform: `translateY(${parallaxOffset}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {project.images[0] && project.images[0] !== '' ? (
            <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <p className="text-muted-foreground flex items-center justify-center h-full">תמונת פרויקט</p>
          )}
        </div>
      </div>


      {/* Card Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1">{project.title}</h3>
        <p className="text-sm text-white/60">{project.location}</p>
      </div>
    </div>
  );
};

const Projects = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.01 });
  const [selectedCategory, setSelectedCategory] = useState("הכל");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = [
    "הכל",
    "שיקום ושיפוץ מעטפת",
    "חיפוי ועיגון אבנים",
    "איטום בגובה",
    "הרחקת מעופפים",
    "עבודות גובה מיוחדות",
  ];

  const projects: Project[] = [
    {
      id: 1,
      title: "שיקום מעטפת בניין משרדים",
      category: "שיקום ושיפוץ מעטפת",
      location: "תל אביב",
      images: [facadeProject1],
    },
    {
      id: 2,
      title: "חיפוי אבן טבעית",
      category: "חיפוי ועיגון אבנים",
      location: "ירושלים",
      images: ["project2.jpg"],
    },
    {
      id: 3,
      title: "איטום גג בניין מגורים",
      category: "איטום בגובה",
      location: "חיפה",
      images: ["project3.jpg"],
    },
    {
      id: 4,
      title: "התקנת רשתות הרחקת יונים",
      category: "הרחקת מעופפים",
      location: "רמת גן",
      images: ["project4.jpg"],
    },
    {
      id: 5,
      title: "פרויקט אמנות בגובה",
      category: "עבודות גובה מיוחדות",
      location: "הרצליה",
      images: ["project5.jpg"],
    },
    {
      id: 6,
      title: "שיקום חזית היסטורית",
      category: "שיקום ושיפוץ מעטפת",
      location: "יפו",
      images: [netanyaProject],
    },
    {
      id: 10,
      title: "שיפוץ מעטפת בניין מגורים",
      category: "שיקום ושיפוץ מעטפת",
      location: "מרכז",
      images: [facadeProject5],
    },
    {
      id: 7,
      title: "עיגון אבני חזית",
      category: "חיפוי ועיגון אבנים",
      location: "נתניה",
      images: ["project7.jpg"],
    },
    {
      id: 8,
      title: "איטום מרפסות פנטהאוז",
      category: "איטום בגובה",
      location: "תל אביב",
      images: ["project8.jpg"],
    },
    {
      id: 9,
      title: "הרחקת עופות ממגדלים",
      category: "הרחקת מעופפים",
      location: "רמת גן",
      images: ["project9.jpg"],
    },
  ];

  const filteredProjects =
    selectedCategory === "הכל"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

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
    <section ref={ref} id="projects" className={`py-16 lg:py-24 scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: 'hsl(222 20% 5%)' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            הפרויקטים שלנו
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            גלריה של פרויקטים מוצלחים שביצענו ברחבי הארץ
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={
                selectedCategory === category
                  ? "bg-transparent border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-full shadow-[0_0_8px_rgba(201,168,76,0.3)]"
                  : "bg-transparent border border-[#c9a84c]/50 text-foreground hover:border-[#c9a84c] hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-full"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={openProject}
            />
          ))}
        </div>

        {/* Project Modal */}
        <Dialog open={!!selectedProject} onOpenChange={closeProject}>
          <DialogContent className="max-w-4xl" dir="rtl">
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      <strong>קטגוריה:</strong> {selectedProject.category}
                    </span>
                    <span className="text-muted-foreground">
                      <strong>מיקום:</strong> {selectedProject.location}
                    </span>
                  </div>

                  {/* Image Carousel */}
                  <div className="relative bg-muted rounded-card aspect-video flex items-center justify-center">
                    <p className="text-muted-foreground">תמונת פרויקט {currentImageIndex + 1}</p>

                    {selectedProject.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow-lg"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow-lg"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-muted-foreground">
                      תיאור מפורט של הפרויקט, אתגרים שהתמודדנו איתם, הפתרונות שמצאנו והתוצאות
                      המרשימות. כאן יופיע טקסט מפורט על כל פרויקט.
                    </p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Projects;
