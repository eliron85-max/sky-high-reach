 import { Phone, FileCheck, Calendar, Wrench, CheckCircle2, Star } from "lucide-react";
 import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";
 import { cn } from "@/lib/utils";

const Process = () => {
  const steps = [
    {
      number: 1,
      icon: Phone,
      title: "פניה ראשונית",
      description: "צרו איתנו קשר טלפוני או דרך האתר. נשמע את הצרכים שלכם ונקבע פגישת ייעוץ.",
    },
    {
      number: 2,
      icon: FileCheck,
      title: "סקר והערכה",
      description: "נבצע סקר מקצועי במקום, נזהה את האתגרים ונמליץ על הפתרון המתאים ביותר.",
    },
    {
      number: 3,
      icon: Calendar,
      title: "הצעת מחיר",
      description: "תקבלו הצעת מחיר מפורטת והוגנת, עם לוחות זמנים ברורים לביצוע העבודה.",
    },
    {
      number: 4,
      icon: Wrench,
      title: "ביצוע העבודה",
      description: "הצוות המקצועי שלנו יבצע את העבודה באיכות גבוהה תוך שמירה על בטיחות מקסימלית.",
    },
    {
      number: 5,
      icon: CheckCircle2,
      title: "בדיקות איכות",
      description: "נבצע בדיקות איכות קפדניות ונוודא שהעבודה עומדת בסטנדרטים הגבוהים ביותר.",
    },
    {
      number: 6,
      icon: Star,
      title: "מעקב ואחריות",
      description: "נספק אחריות מלאה לעבודה ונישאר זמינים למעקב ותחזוקה עתידית.",
    },
  ];

  return (
     <section id="process" className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            תהליך העבודה שלנו
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
             מהרעיון ועד להשקה - צעד אחר צעד
          </p>
        </div>

         {/* Zigzag Timeline Layout */}
         <div className="max-w-5xl mx-auto relative">
           {/* Center Line */}
           <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" 
                style={{ transform: 'translateX(-50%)' }} />
           
          {steps.map((step, index) => {
            const Icon = step.icon;
             const isLeft = index % 2 === 0;
             const { ref, isVisible, style } = useStaggeredReveal({ 
               index, 
               baseDelay: 150,
               threshold: 0.2 
             });
             
            return (
               <div 
                 key={step.number} 
                 ref={ref as React.RefObject<HTMLDivElement>}
                 className={cn(
                   "relative mb-16 last:mb-0 transition-all duration-700",
                   "md:grid md:grid-cols-2 md:gap-8 md:items-center",
                   !isVisible && "opacity-0 translate-y-8"
                 )}
                 style={style}
               >
                 {/* Mobile/Tablet: Simple Layout */}
                 <div className="md:hidden flex gap-4">
                   {/* Icon Circle */}
                   <div className="flex-shrink-0">
                     <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                       <Icon className="w-6 h-6 text-primary-foreground" />
                     </div>
                </div>
                   
                   {/* Content */}
                   <div className="flex-1">
                     <div className="text-sm font-semibold text-primary mb-1">שלב {step.number}</div>
                     <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                     <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
                 
                 {/* Desktop: Alternating Layout */}
                 <div className="hidden md:block">
                   {/* Left Side Content */}
                   {isLeft && (
                     <>
                       <div className="text-right pr-12">
                         <div className="inline-block">
                           <div className="text-sm font-semibold text-primary mb-2">שלב {step.number}</div>
                           <div className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
                             <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                             <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                           </div>
                         </div>
                       </div>
                       
                       {/* Center Icon */}
                       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                         <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-xl border-4 border-background">
                           <Icon className="w-7 h-7 text-primary-foreground" />
                         </div>
                       </div>
                       
                       {/* Right Side Empty */}
                       <div />
                     </>
                   )}
                   
                   {/* Right Side Content */}
                   {!isLeft && (
                     <>
                       {/* Left Side Empty */}
                       <div />
                       
                       {/* Center Icon */}
                       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                         <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-xl border-4 border-background">
                           <Icon className="w-7 h-7 text-primary-foreground" />
                         </div>
                       </div>
                       
                       {/* Right Side Content */}
                       <div className="text-left pl-12">
                         <div className="inline-block">
                           <div className="text-sm font-semibold text-primary mb-2">שלב {step.number}</div>
                           <div className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
                             <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                             <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                           </div>
                         </div>
                       </div>
                     </>
                   )}
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
