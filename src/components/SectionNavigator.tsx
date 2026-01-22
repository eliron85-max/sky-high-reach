import { useState, useEffect } from "react";

interface Section {
  id: string;
  label: string;
}

interface SectionNavigatorProps {
  sections: Section[];
}

const SectionNavigator = ({ sections }: SectionNavigatorProps) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(section.id);
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: "-20% 0px -20% 0px",
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="ניווט סקציות"
      className="
        fixed z-50
        
        /* Mobile: left side, below language switcher */
        left-3 top-[55%] -translate-y-1/2
        
        /* Desktop: right side, center */
        lg:left-auto lg:right-6 lg:top-1/2
        
        /* Container */
        flex flex-col items-center gap-3
        p-2 rounded-full
        bg-black/40 backdrop-blur-sm
        border border-white/10
      "
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        
        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            aria-label={`גלול ל${section.label}`}
            aria-current={isActive ? "true" : undefined}
            className={`
              relative group
              rounded-full
              transition-all duration-300
              
              ${isActive 
                ? "w-3 h-3 bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] shadow-[0_0_8px_rgba(201,168,76,0.5)]" 
                : "w-2 h-2 bg-white/50 hover:bg-white/80 hover:scale-125"
              }
            `}
          >
            {/* Tooltip */}
            <span
              className="
                absolute top-1/2 -translate-y-1/2
                
                /* Mobile: tooltip on right */
                left-full ml-3
                
                /* Desktop: tooltip on left */
                lg:left-auto lg:right-full lg:ml-0 lg:mr-3
                
                px-2 py-1
                text-xs text-white whitespace-nowrap
                bg-black/80 rounded
                opacity-0 group-hover:opacity-100
                pointer-events-none
                transition-opacity duration-200
              "
            >
              {section.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default SectionNavigator;
