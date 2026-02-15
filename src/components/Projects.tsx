import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import useEmblaCarousel from "embla-carousel-react";
import facadeProject1 from "@/assets/facade-project-4.webp";
import facadeProject5 from "@/assets/facade-project-5.webp";
import netanyaProject from "@/assets/netanya-new.webp";
import facadeRestorationNew from "@/assets/facade-restoration-new.webp";

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  images: string[];
}

const Projects = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.01 });
  const [selectedCategory, setSelectedCategory] = useState("הכל");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSnap, setSelectedSnap] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
    containScroll: false,
    direction: "rtl"
  });

  const categories = [
  "הכל",
  "שיקום ושיפוץ מעטפת"];

  const projects: Project[] = [
  { id: 1, title: "שיקום מעטפת בניין משרדים", category: "שיקום ושיפוץ מעטפת", location: "תל אביב", images: [facadeProject1] },
  { id: 6, title: "שיקום חזית היסטורית", category: "שיקום ושיפוץ מעטפת", location: "יפו", images: [netanyaProject] },
  { id: 10, title: "שיפוץ מעטפת בניין מגורים", category: "שיקום ושיפוץ מעטפת", location: "מרכז", images: [facadeProject5] },
  { id: 11, title: "שיקום מעטפת חיצונית", category: "שיקום ושיפוץ מעטפת", location: "מרכז", images: [facadeRestorationNew] }];


  const filteredProjects =
  selectedCategory === "הכל" ?
  projects :
  projects.filter((p) => p.category === selectedCategory);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedSnap(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Re-init carousel when category changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      setSelectedSnap(0);
    }
  }, [selectedCategory, emblaApi]);

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
    <section ref={ref} id="projects" className={`py-16 lg:py-24 scroll-reveal ${isVisible ? 'visible' : ''} bg-white dark:bg-[hsl(222_20%_5%)]`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">
            הפרויקטים שלנו
          </h2>
          <p className="text-black/60 dark:text-white/60 max-w-2xl mx-auto">
            גלריה של פרויקטים מוצלחים שביצענו ברחבי הארץ
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) =>
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? "default" : "outline"}
            className={
            selectedCategory === category ?
            "bg-transparent border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-full shadow-[0_0_8px_rgba(201,168,76,0.3)]" :
            "bg-transparent border border-[#c9a84c]/50 text-black dark:text-foreground hover:border-[#c9a84c] hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-full"
            }>

              {category}
            </Button>
          )}
        </div>

        {/* Projects Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef} dir="rtl">
            <div className="flex gap-4">
              {filteredProjects.map((project, index) =>
              <div
                key={project.id}
                className="flex-none cursor-pointer transition-all duration-500"
                style={{ width: "60%", minWidth: 0 }}
                onClick={() => openProject(project)}>

                  <div
                  className={`relative overflow-hidden rounded-xl transition-all duration-500 ${
                  index === selectedSnap ?
                  "scale-100 opacity-100 shadow-2xl" :
                  "scale-90 opacity-60"}`
                  }>

                    <div className="aspect-[4/3] bg-white dark:bg-black overflow-hidden">
                      {project.images[0] && project.images[0] !== '' ?
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy" /> :


                    <div className="w-full h-full flex items-center justify-center bg-muted">
                          <p className="text-muted-foreground">קרית עקרון</p>
                        </div>
                    }
                    </div>
                    {/* Info overlay at bottom */}
                    <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-500 ${
                  index === selectedSnap ? "opacity-100" : "opacity-0"}`
                  }>
                      <h3 className="font-semibold text-white text-lg">{project.title}</h3>
                      <p className="text-sm text-white/80">{project.location}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          {filteredProjects.length > 1 &&
          <>
              <button
              onClick={scrollNext}
              className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-black/70 hover:bg-white dark:hover:bg-black text-black dark:text-white rounded-full p-3 shadow-lg transition-all border border-[#c9a84c]/30">

                <ChevronRight size={24} />
              </button>
              <button
              onClick={scrollPrev}
              className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-black/70 hover:bg-white dark:hover:bg-black text-black dark:text-white rounded-full p-3 shadow-lg transition-all border border-[#c9a84c]/30">

                <ChevronLeft size={24} />
              </button>
            </>
          }

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {filteredProjects.map((_, index) =>
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === selectedSnap ?
              "bg-[#c9a84c] w-6" :
              "bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40"}`
              } />

            )}
          </div>
        </div>

        {/* Project Modal */}
        <Dialog open={!!selectedProject} onOpenChange={closeProject}>
          <DialogContent className="max-w-4xl" dir="rtl">
            {selectedProject &&
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
                  <div className="relative bg-muted rounded-card aspect-video flex items-center justify-center overflow-hidden">
                    {selectedProject.images[currentImageIndex] && selectedProject.images[currentImageIndex] !== '' ?
                  <img src={selectedProject.images[currentImageIndex]} alt={selectedProject.title} className="w-full h-full object-cover" /> :

                  <p className="text-muted-foreground">תמונת פרויקט {currentImageIndex + 1}</p>
                  }

                    {selectedProject.images.length > 1 &&
                  <>
                        <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow-lg">

                          <ChevronLeft size={24} />
                        </button>
                        <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow-lg">

                          <ChevronRight size={24} />
                        </button>
                      </>
                  }
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-muted-foreground">
                      תיאור מפורט של הפרויקט, אתגרים שהתמודדנו איתם, הפתרונות שמצאנו והתוצאות
                      המרשימות. כאן יופיע טקסט מפורט על כל פרויקט.
                    </p>
                  </div>
                </div>
              </>
            }
          </DialogContent>
        </Dialog>
      </div>
    </section>);

};

export default Projects;