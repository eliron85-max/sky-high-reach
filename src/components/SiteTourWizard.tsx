import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight, MapPin, Wrench, Phone, Star } from "lucide-react";

type TourStep = {
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
};

const TOUR_STEPS: TourStep[] = [
{
  title: "ברוכים הבאים!",
  description: "א.א פרויקטים וגובה - מומחים בעבודות גובה, שיקום מבנים וחיפוי אבן. בואו נכיר את השירותים שלנו.",
  icon: <MapPin className="w-6 h-6" />
},
{
  title: "השירותים שלנו",
  description: "מגוון רחב של שירותים מקצועיים: חיפוי אבן, שיקום מבנים, איטום, הרחקת יונים, פרויקטים מיוחדים ועוד.",
  icon: <Wrench className="w-6 h-6" />
},
{
  title: "ניסיון מוכח",
  description: "מעל 500 פרויקטים, 15 שנות ניסיון, פריסה ארצית ביותר מ-50 ערים. אנחנו כאן בשבילכם.",
  icon: <Star className="w-6 h-6" />
},
{
  title: "צרו קשר",
  description: "מוכנים להתחיל? השאירו פרטים ונחזור אליכם תוך 24 שעות עם הצעת מחיר מותאמת אישית.",
  icon: <Phone className="w-6 h-6" />
}];


export default function SiteTourWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [hasShown, setHasShown] = useState(false);

  // Show wizard after 8 seconds on first visit
  useEffect(() => {
    const shown = sessionStorage.getItem("tour-shown");
    if (shown) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasShown(true);
      sessionStorage.setItem("tour-shown", "1");
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => {setIsOpen(true);setStep(0);}}
        className={cn(
          "fixed bottom-24 left-4 z-[9999] w-12 h-12 rounded-full",
          "bg-[#c9a84c] text-black shadow-lg shadow-[#c9a84c]/30",
          "flex items-center justify-center hover:scale-110 transition-transform",
          !hasShown && "animate-bounce"
        )}
        aria-label="סיור באתר">

        
      </button>);

  }

  const currentStep = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;
  const isFirst = step === 0;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)} />


      {/* Wizard card */}
      <div className="relative w-full max-w-md bg-card/95 backdrop-blur-xl rounded-2xl border border-[#c9a84c]/30 shadow-[0_0_60px_rgba(201,168,76,0.2)] overflow-hidden animate-scale-in">
        {/* Close */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">

          <X className="w-4 h-4" />
        </button>

        {/* Progress */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8d5a3] transition-all duration-500"
            style={{ width: `${(step + 1) / TOUR_STEPS.length * 100}%` }} />

        </div>

        {/* Content */}
        <div className="p-8 sm:p-10">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] mb-6 mx-auto">
            {currentStep.icon}
          </div>

          {/* Step counter */}
          <div className="text-center text-xs text-[#c9a84c] tracking-[0.3em] uppercase mb-3">
            שלב {step + 1} מתוך {TOUR_STEPS.length}
          </div>

          <h3 className="text-2xl font-medium text-center text-foreground mb-4">
            {currentStep.title}
          </h3>

          <p className="text-muted-foreground text-center text-sm leading-relaxed mb-8">
            {currentStep.description}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={isFirst}
              className={cn(
                "flex items-center gap-1 px-4 py-2 rounded-full text-sm transition-all",
                isFirst ?
                "opacity-30 cursor-not-allowed text-muted-foreground" :
                "text-foreground hover:bg-white/10"
              )}>

              <ChevronRight className="w-4 h-4" />
              הקודם
            </button>

            {isLast ?
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 rounded-full bg-[#c9a84c] text-black text-sm font-medium hover:brightness-110 transition-all">

                סיימתי!
              </button> :

            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1 px-6 py-2 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] text-sm font-medium hover:bg-[#c9a84c]/20 transition-all">

                הבא
                <ChevronLeft className="w-4 h-4" />
              </button>
            }
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pb-6">
          {TOUR_STEPS.map((_, i) =>
          <button
            key={i}
            onClick={() => setStep(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              i === step ? "bg-[#c9a84c] w-6" : "bg-white/20 hover:bg-white/40"
            )} />

          )}
        </div>
      </div>
    </div>);

}