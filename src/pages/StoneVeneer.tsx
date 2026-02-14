import { useState, useRef } from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight, Send, Loader2, CalendarIcon, Phone, Mail, MapPin } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { usePreloadImage, getOptimizedUnsplashUrl } from "@/hooks/usePreloadImage";
import { useSharedParallax as useParallax } from "@/hooks/useSharedParallax";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { z } from "zod";
import stoneVeneerBefore from "@/assets/stone-veneer-before.jpg";
import stoneVeneerAfter from "@/assets/stone-veneer-after.jpg";
import stoneVeneerBefore2 from "@/assets/stone-veneer-before-2.jpg";
import stoneVeneerAfter2 from "@/assets/stone-veneer-after-2.jpg";
import stoneVeneerBefore3 from "@/assets/stone-veneer-before-3.jpg";
import stoneVeneerAfter3 from "@/assets/stone-veneer-after-3.jpg";
const HERO_IMAGE = "https://images.unsplash.com/photo-1487958449943-2429e8be8625";

// Validation schema for quote form
const quoteFormSchema = z.object({
  fullName: z.string().trim().min(2, "שם מלא חייב להכיל לפחות 2 תווים").max(100),
  phone: z.string().trim().min(9, "מספר טלפון לא תקין").max(15),
  email: z.string().trim().email("כתובת אימייל לא תקינה").max(255),
  buildingType: z.string().min(1, "יש לבחור סוג מבנה"),
  area: z.string().min(1, "יש להזין שטח משוער"),
  message: z.string().trim().max(1000).optional(),
  preferredDate: z.date().optional(),
});
type QuoteFormData = z.infer<typeof quoteFormSchema>;

// Dedicated Quote Form Component
const StoneVeneerQuoteForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: "",
    phone: "",
    email: "",
    buildingType: "",
    area: "",
    message: "",
    preferredDate: undefined,
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      preferredDate: date,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    const result = quoteFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setValidationErrors(fieldErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      // Route all submissions through edge function for rate limiting
      const { error } = await supabase.functions.invoke("send-inquiry-notification", {
        body: {
          fullName: result.data.fullName.trim(),
          email: result.data.email.trim(),
          phone: result.data.phone.trim(),
          projectType: "חיפוי אבן בטכנולוגיה מתקדמת",
          message: `סוג מבנה: ${result.data.buildingType}\nשטח משוער: ${result.data.area} מ"ר\n\n${result.data.message || ""}`,
          preferredDate: result.data.preferredDate ? format(result.data.preferredDate, "dd/MM/yyyy") : undefined,
        },
      });
      if (error) throw error;
      toast({
        title: "הבקשה נשלחה בהצלחה!",
        description: "נחזור אליך עם הצעת מחיר תוך 24 שעות.",
      });
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        buildingType: "",
        area: "",
        message: "",
        preferredDate: undefined,
      });
    } catch (error) {
      console.error("Error submitting:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשליחת הבקשה. נסה שנית.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-card border border-border rounded-xl p-8 space-y-6">
        {/* Row 1: Name and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">שם מלא *</Label>
            <Input
              id="fullName"
              placeholder="הזן שם מלא"
              required
              dir="rtl"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={validationErrors.fullName ? "border-destructive" : ""}
            />
            {validationErrors.fullName && <p className="text-sm text-destructive">{validationErrors.fullName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">טלפון *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="050-1234567"
              required
              dir="ltr"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={validationErrors.phone ? "border-destructive" : ""}
            />
            {validationErrors.phone && <p className="text-sm text-destructive">{validationErrors.phone}</p>}
          </div>
        </div>

        {/* Row 2: Email and Building Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">אימייל *</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              required
              dir="ltr"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={validationErrors.email ? "border-destructive" : ""}
            />
            {validationErrors.email && <p className="text-sm text-destructive">{validationErrors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="buildingType">סוג מבנה *</Label>
            <select
              id="buildingType"
              required
              value={formData.buildingType}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                validationErrors.buildingType ? "border-destructive" : "",
              )}
              dir="rtl"
            >
              <option value="">בחר סוג מבנה</option>
              <option value="בניין מגורים">בניין מגורים</option>
              <option value="בית פרטי">בית פרטי</option>
              <option value="מבנה מסחרי">מבנה מסחרי</option>
              <option value="מבנה ציבורי">מבנה ציבורי</option>
              <option value="מבנה היסטורי">מבנה היסטורי</option>
              <option value="אחר">אחר</option>
            </select>
            {validationErrors.buildingType && (
              <p className="text-sm text-destructive">{validationErrors.buildingType}</p>
            )}
          </div>
        </div>

        {/* Row 3: Area and Preferred Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="area">שטח משוער (מ"ר) *</Label>
            <Input
              id="area"
              type="text"
              placeholder="לדוגמה: 200"
              required
              dir="ltr"
              value={formData.area}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={validationErrors.area ? "border-destructive" : ""}
            />
            {validationErrors.area && <p className="text-sm text-destructive">{validationErrors.area}</p>}
          </div>
          <div className="space-y-2">
            <Label>תאריך מועדף לביקור</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full justify-start text-right font-normal",
                    !formData.preferredDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {formData.preferredDate ? (
                    format(formData.preferredDate, "dd/MM/yyyy", {
                      locale: he,
                    })
                  ) : (
                    <span>בחר תאריך</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.preferredDate}
                  onSelect={handleDateChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  dir="rtl"
                  locale={he}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Row 4: Message */}
        <div className="space-y-2">
          <Label htmlFor="message">הערות נוספות</Label>
          <Textarea
            id="message"
            placeholder="פרטים נוספים על הפרויקט, שאלות או דרישות מיוחדות..."
            rows={4}
            dir="rtl"
            value={formData.message}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="ml-2 animate-spin" size={20} /> : <Send className="ml-2" size={20} />}
          {isSubmitting ? "שולח..." : "שלח בקשה להצעת מחיר"}
        </Button>
      </form>

      {/* Contact Info Sidebar */}
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">פרטי התקשרות</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="text-primary flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-foreground">טלפון</p>
                <a href="tel:050-1234567" className="text-muted-foreground hover:text-primary transition-colors">
                  050-1234567
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="text-primary flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-foreground">אימייל</p>
                <a
                  href="mailto:info@heights-projects.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  info@heights-projects.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-primary flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-foreground">כתובת</p>
                <p className="text-muted-foreground">ירושלים, ישראל</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
          <h4 className="font-bold text-foreground mb-3">למה לבחור בנו?</h4>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              15 שנות אחריות
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              ביקור והערכה ללא עלות
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              הצעת מחיר תוך 24 שעות
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              צוות מוסמך ומנוסה
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
const StoneVeneer = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const detailsRef = useScrollReveal();
  const beforeAfterRef = useScrollReveal();
  const projectsRef = useScrollReveal();

  // Parallax refs
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const serviceCardRef = useRef<HTMLDivElement>(null);
  const beforeAfterBgRef = useRef<HTMLDivElement>(null);
  const { style: heroImageStyle } = useParallax(heroImageRef, {
    speed: 0.3,
  });
  const { style: heroContentStyle } = useParallax(heroContentRef, {
    speed: 0.1,
  });
  const { style: serviceCardStyle } = useParallax(serviceCardRef, {
    speed: 0.08,
  });
  const { style: beforeAfterBgStyle } = useParallax(beforeAfterBgRef, {
    speed: 0.15,
  });

  // Staggered reveal for related projects
  const stagger0 = useStaggeredReveal({
    index: 0,
    baseDelay: 100,
  });
  const stagger1 = useStaggeredReveal({
    index: 1,
    baseDelay: 100,
  });
  const stagger2 = useStaggeredReveal({
    index: 2,
    baseDelay: 100,
  });

  // Preload hero image for faster LCP
  usePreloadImage(getOptimizedUnsplashUrl(HERO_IMAGE, 1920, "webp"), {
    fetchpriority: "high",
    type: "image/webp",
  });
  const beforeAfterImages = [
    {
      before: stoneVeneerBefore,
      after: stoneVeneerAfter,
      title: "חיפוי אבן בטכנולוגיה מתקדמת - פרויקט 1",
    },
    {
      before: stoneVeneerBefore2,
      after: stoneVeneerAfter2,
      title: "חיפוי אבן בטכנולוגיה מתקדמת - פרויקט 2",
    },
    {
      before: stoneVeneerBefore3,
      after: stoneVeneerAfter3,
      title: "חיפוי אבן בטכנולוגיה מתקדמת - פרויקט 3",
    },
  ];
  const relatedProjects = [
    {
      id: 1,
      title: "חיפוי אבן - בניין מגורים ירושלים",
      category: "חיפוי אבן",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800",
      location: "ירושלים",
    },
    {
      id: 2,
      title: "עיגון אבנים - מבנה היסטורי",
      category: "חיפוי אבן",
      image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
      location: "תל אביב",
    },
    {
      id: 3,
      title: "שיקום חזית אבן - בית כנסת",
      category: "חיפוי אבן",
      image: "https://images.unsplash.com/photo-1590725121839-892b458a74fe?w=800",
      location: "ירושלים",
    },
  ];
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % beforeAfterImages.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? beforeAfterImages.length - 1 : prev - 1));
  };
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />

      {/* Hero Section - matching home page design */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Video background */}
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/hero-stone-veneer.webm" type="video/webm" />
        </video>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 transition-opacity duration-300" />

        {/* Gold gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/5 via-transparent to-[#c9a84c]/5" />

        {/* Content - positioned to the right with parallax */}
        <div className="container relative z-10 px-4 md:px-6 pt-header-offset lg:pt-header-offset-lg mx-auto">
          <div ref={heroContentRef} className="max-w-xl mx-auto text-center md:mx-0 md:mr-8 lg:mr-16 md:text-right" style={heroContentStyle}>
            {/* Animated content */}
            <div className="animate-fade-in-up">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight lg:text-6xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-justify">
                  חיפוי אבן בטכנולוגיה מתקדמת
                </span>
              </h1>
              <p className="text-base text-[#e8d5a3]/80 mb-6 leading-relaxed md:text-4xl">
                שיטה חדשנית לחיפוי חזיתות באבן המשלבת טכנולוגיה מתקדמת עם מסורת מלאכת האבן
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
              <button
                onClick={scrollToContact}
                className="bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold hover:from-[#f0ddb0] hover:to-[#d4af37] transition-all duration-300 hover:scale-105 active:scale-95 px-8 py-4 rounded-button"
              >
                בקשת הצעת מחיר
              </button>
              <button
                onClick={() => {
                  const techSection = document.querySelector("section:nth-of-type(2)");
                  if (techSection) techSection.scrollIntoView({ behavior: "smooth" });
                }}
                className="border border-[#c9a84c]/50 text-[#e8d5a3] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all px-8 py-4 rounded-button"
              >
                למידע נוסף
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Advantages Section - Right after Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 via-gray-50 to-slate-100 dark:from-[#0a0a0a] dark:via-[#111] dark:to-[#0a0a0a] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 dark:bg-[#c9a84c]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 dark:bg-[#c9a84c]/5 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Title with decorative line */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">למה טכנולוגיה מתקדמת?</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary dark:via-[#c9a84c] to-transparent mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "⚡",
                title: "מהירות התקנה",
                desc: "זמן ביצוע קצר ב-50% משיטות מסורתיות",
                gradient: "from-orange-400 to-amber-500",
                bgLight: "bg-orange-50",
                bgDark: "dark:bg-orange-500/10",
              },
              {
                icon: "🛡️",
                title: "עמידות מרבית",
                desc: "אחיזה חזקה פי 3 מחיפוי רגיל",
                gradient: "from-blue-400 to-cyan-500",
                bgLight: "bg-blue-50",
                bgDark: "dark:bg-blue-500/10",
              },
              {
                icon: "💧",
                title: "עמידות במים",
                desc: "איטום מושלם ומניעת חדירת רטיבות",
                gradient: "from-sky-400 to-blue-500",
                bgLight: "bg-sky-50",
                bgDark: "dark:bg-sky-500/10",
              },
              {
                icon: "🏆",
                title: "אחריות מורחבת",
                desc: "אחריות של 15 שנה על העבודה",
                gradient: "from-amber-400 to-yellow-500",
                bgLight: "bg-amber-50",
                bgDark: "dark:bg-amber-500/10",
              },
              {
                icon: "🏗️",
                title: "ללא פיגומים",
                desc: "עבודה בשיטת סנפלינג - חיסכון בעלויות ובזמן",
                gradient: "from-red-400 to-orange-500",
                bgLight: "bg-red-50",
                bgDark: "dark:bg-red-500/10",
              },
              {
                icon: "🔩",
                title: "ללא קידוחים / עיגונים",
                desc: "שיטה לא פולשנית ששומרת על שלמות המבנה",
                gradient: "from-violet-400 to-purple-500",
                bgLight: "bg-violet-50",
                bgDark: "dark:bg-violet-500/10",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={cn(
                  "group relative rounded-2xl p-8 text-center transition-all duration-500",
                  // Light mode
                  "bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1",
                  // Dark mode
                  "dark:bg-white/[0.03] dark:border-[#c9a84c]/10 dark:hover:border-[#c9a84c]/30 dark:hover:shadow-[0_8px_40px_rgba(201,168,76,0.1)] dark:backdrop-blur-sm",
                  // Stagger animation
                  "opacity-0 translate-y-6 animate-[fade-in_0.6s_ease-out_forwards]",
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Icon with colored background circle */}
                <div className={cn(
                  "w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110",
                  item.bgLight, item.bgDark
                )}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary dark:group-hover:text-[#c9a84c] transition-colors duration-300">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>

                {/* Bottom accent line on hover */}
                <div className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-1/2 transition-all duration-500 rounded-full",
                  "bg-gradient-to-r", item.gradient,
                  "dark:from-[#c9a84c] dark:to-[#d7b46a]"
                )} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Section - Dark Premium Design */}
      <section
        ref={beforeAfterRef.ref}
        className={`py-section scroll-reveal relative overflow-hidden ${beforeAfterRef.isVisible ? "visible" : ""}`}
        style={{
          background: "linear-gradient(to bottom, #0f172a, #1e293b, #0f172a)",
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <div ref={beforeAfterBgRef} style={beforeAfterBgStyle} className="absolute inset-0 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-100">לפני ואחרי</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-4" />
            <p className="text-slate-400 max-w-2xl mx-auto">הזיזו את הסליידר כדי לראות את ההבדל המדהים</p>
          </div>

          <div className="max-w-6xl mx-auto space-y-16">
            {beforeAfterImages.map((item, index) => (
              <div
                key={index}
                className="relative rounded-2xl p-5 md:p-8 border-2 border-amber-500/30 transition-all duration-500 hover:border-amber-500/50 hover:shadow-[0_0_60px_rgba(245,158,11,0.2)] group"
                style={{
                  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)",
                }}
              >
                {/* Golden glow shadow */}
                <div className="absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.15)] pointer-events-none" />

                {/* Decorative corners with gold dots */}
                <div className="absolute top-0 right-0 w-24 h-24">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-amber-500 rounded-full" />
                  <div className="absolute top-4 right-8 w-8 h-0.5 bg-gradient-to-l from-amber-500 to-transparent" />
                  <div className="absolute top-8 right-4 h-8 w-0.5 bg-gradient-to-t from-amber-500 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 w-24 h-24">
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-amber-500 rounded-full" />
                  <div className="absolute bottom-4 left-8 w-8 h-0.5 bg-gradient-to-r from-amber-500 to-transparent" />
                  <div className="absolute bottom-8 left-4 h-8 w-0.5 bg-gradient-to-b from-amber-500 to-transparent" />
                </div>

                {/* Project Badge */}
                <div className="absolute -top-3 right-8 px-4 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full">
                  <span className="text-amber-300 text-sm font-bold">פרויקט {index + 1}</span>
                </div>

                {/* Main Slider Container */}
                <div className="relative rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                  <BeforeAfterSlider beforeImage={item.before} afterImage={item.after} title={item.title} />
                </div>

                {/* Project Title */}
                <div className="mt-8 text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-amber-100 mb-2">{item.title}</h3>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mb-3" />
                  <p className="text-slate-400">חיפוי אבן בטכנולוגיה מתקדמת - שינוי מהותי במראה הבניין</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Badge Banner */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-y border-primary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-4xl">🏅</span>
              <span className="text-2xl md:text-3xl font-bold text-foreground">תו איכות מוכח</span>
              <span className="text-4xl">🏅</span>
            </div>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
              מוצר עם תו איכות שהוכיח את עצמו שנים רבות בארץ ובעולם,
              <br className="hidden md:block" />
              <span className="text-primary font-semibold">במגוון עשיר של גוונים וסוגים</span> המותאמים לכל סגנון
              אדריכלי
            </p>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section
        ref={detailsRef.ref}
        className={`py-section bg-background scroll-reveal ${detailsRef.isVisible ? "visible" : ""}`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-right text-foreground">השיטה הטכנולוגית שלנו</h2>

            <div className="space-y-6 text-foreground/90 leading-relaxed">
              <p className="text-lg">
                שיטת החיפוי הטכנולוגית המתקדמת שלנו משלבת חומרים חדשניים עם טכניקות התקנה מתקדמות, המאפשרות חיפוי אבן
                איכותי ועמיד במיוחד תוך קיצור משמעותי של זמני הביצוע.
              </p>

              <div
                ref={serviceCardRef}
                style={serviceCardStyle}
                className="bg-card rounded-card p-8 border border-border"
              >
                <h3 className="text-2xl font-bold mb-6 text-foreground">התהליך כולל:</h3>
                <ul className="space-y-4 text-foreground/90">
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl font-bold">1.</span>
                    <div>
                      <strong>סריקה דיגיטלית</strong> - מיפוי תלת-ממדי של החזית לדיוק מקסימלי
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl font-bold">2.</span>
                    <div>
                      <strong>הכנת משטח מתקדמת</strong> - יישום פריימר טכנולוגי להידבקות מושלמת
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl font-bold">3.</span>
                    <div>
                      <strong>מערכת עיגון חכמה</strong> - עוגנים מיוחדים עם חיישני לחץ
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl font-bold">4.</span>
                    <div>
                      <strong>דבק היברידי</strong> - שילוב פולימרים ואפוקסי לחוזק מקסימלי
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl font-bold">5.</span>
                    <div>
                      <strong>איטום ננו-טכנולוגי</strong> - ציפוי בלתי נראה למניעת חדירת מים ולכלוך
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl font-bold">6.</span>
                    <div>
                      <strong>בדיקות איכות</strong> - בדיקות עמידות ואחיזה בכל שלב
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
                <h3 className="text-xl font-bold text-foreground mb-3">יתרונות השיטה:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-foreground/80">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>התקנה מהירה וניקייה</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>ללא פגיעה במבנה הקיים</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>עמידות לרעידות אדמה</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>תחזוקה מינימלית</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>חיסכון באנרגיה (בידוד)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>מתאים לכל סוגי האבן</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-section bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">שאלות נפוצות</h2>

            <div className="space-y-4">
              {[
                {
                  q: "מה ההבדל בין השיטה הטכנולוגית לחיפוי אבן מסורתי?",
                  a: "השיטה הטכנולוגית משתמשת בדבקים היברידיים מתקדמים, מערכת עיגון חכמה וסריקה דיגיטלית לדיוק מקסימלי. התוצאה היא התקנה מהירה יותר ב-50%, אחיזה חזקה פי 3, ועמידות לטווח ארוך ללא צורך בתחזוקה שוטפת.",
                },
                {
                  q: "כמה זמן לוקחת התקנת חיפוי אבן בשיטה הטכנולוגית?",
                  a: 'זמן ההתקנה תלוי בגודל הפרויקט, אך בממוצע אנו מסיימים מהר יותר ב-50% מהשיטה המסורתית. לדוגמה, חזית בניין של 200 מ"ר מסתיימת בכ-5-7 ימי עבודה.',
                },
                {
                  q: "האם השיטה מתאימה לכל סוגי האבן?",
                  a: "כן! השיטה הטכנולוגית שלנו מתאימה לאבן ירושלים, אבן קיסריה, שיש, גרניט, אבן חול ועוד. הדבקים ההיברידיים מותאמים לכל סוג אבן.",
                },
                {
                  q: "מה כוללת האחריות על העבודה?",
                  a: "אנו מעניקים אחריות של 15 שנה על כל העבודה, הכוללת את האבנים, הדבקים, מערכת העיגון והאיטום. האחריות מכסה כל פגם בחומרים או בביצוע.",
                },
                {
                  q: "האם השיטה עמידה ברעידות אדמה?",
                  a: "בהחלט! מערכת העיגון החכמה שלנו מאושרת לעמידות ברעידות אדמה עד 7 בסולם ריכטר. האבנים מחוברות באופן גמיש שמאפשר ספיגת זעזועים.",
                },
                {
                  q: "האם ניתן להתקין על קיר קיים עם בעיות?",
                  a: "כן, חלק מהיתרונות של השיטה הטכנולוגית הוא היכולת לתקן ולחזק קירות קיימים. אנו מבצעים בדיקה מקדימה וטיפול בבעיות לפני ההתקנה.",
                },
                {
                  q: "מהו הטיפול באיטום ננו-טכנולוגי?",
                  a: "ציפוי הננו-טכנולוגי הוא שכבה בלתי נראית שמרפדת את האבן ומונעת חדירת מים, לכלוך ואבק. הציפוי שומר על מראה האבן הטבעי ומקל על הניקיון.",
                },
                {
                  q: "כמה עולה חיפוי אבן בשיטה הטכנולוגית?",
                  a: "המחיר תלוי בסוג האבן, גודל הפרויקט ומורכבות העבודה. צרו קשר לקבלת הצעת מחיר מותאמת אישית - ההצעה כוללת ביקור באתר וייעוץ מקצועי ללא עלות.",
                },
              ].map((faq, i) => (
                <details key={i} className="group bg-card rounded-xl border border-border overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                    <h3 className="text-lg font-bold text-foreground text-right pr-4">{faq.q}</h3>
                    <span className="text-primary text-2xl transition-transform group-open:rotate-45 flex-shrink-0">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section
        ref={projectsRef.ref}
        className={`py-section bg-background scroll-reveal ${projectsRef.isVisible ? "visible" : ""}`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">פרויקטים רלוונטיים</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {relatedProjects.map((project, index) => {
              const staggers = [stagger0, stagger1, stagger2];
              const { ref, isVisible, style } = staggers[index];
              return (
                <div
                  key={project.id}
                  ref={ref as any}
                  style={style}
                  className={`group bg-card rounded-card overflow-hidden border border-border hover:shadow-card-hover scroll-reveal-stagger ${isVisible ? "visible" : ""}`}
                >
                  <div className="relative overflow-hidden h-64">
                    <ImageWithSkeleton
                      src={project.image}
                      alt={project.title}
                      responsiveSizes={{
                        sm: 400,
                        md: 500,
                        lg: 600,
                        xl: 800,
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-hero/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 right-0 left-0 p-6 text-right">
                        <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-button text-sm mb-3">
                          {project.category}
                        </span>
                        <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
                        <p className="text-muted-foreground">{project.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dedicated Quote Form Section */}
      <section id="contact" className="py-section bg-gradient-to-b from-muted to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-500 text-white font-bold px-4 py-2 rounded-lg mb-4">
                <span>חדש!</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                קבל הצעת מחיר לחיפוי אבן בטכנולוגיה מתקדמת
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                מלא את הפרטים ונחזור אליך עם הצעה מותאמת אישית תוך 24 שעות
              </p>
            </div>

            <StoneVeneerQuoteForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default StoneVeneer;
