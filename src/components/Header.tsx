import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Accessibility } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import logoImage from "@/assets/logo-new.webp";
import { throttle } from "@/lib/throttle";
export default function Header() {
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const quickLinks = useMemo(() => [{
    label: "שיקום מעטפת",
    path: "/facade-restoration"
  }, {
    label: "חיפוי אבן",
    path: "/stone-veneer"
  }, {
    label: "איטום",
    path: "/waterproofing"
  }, {
    label: "הרחקת יונים",
    path: "/bird-control"
  }, {
    label: "צוו הריסה",
    path: "/demolition-orders"
  }], []);
  const serviceLinks = useMemo(() => [{
    label: "שיקום מעטפת",
    path: "/facade-restoration"
  }, {
    label: "חיפוי אבן",
    path: "/stone-veneer"
  }, {
    label: "איטום",
    path: "/waterproofing"
  }, {
    label: "הרחקת יונים",
    path: "/bird-control"
  }, {
    label: "ציוד הריסה",
    path: "/demolition-orders"
  }, {
    label: "פרויקטים מיוחדים",
    path: "/special-projects"
  }], []);

  // Header shows ONLY at the very top of the page (on entry). Any scroll hides it.
  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY === 0);
    };

    // set initial state on mount (in case page loads not at top)
    onScroll();
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // נועל גלילה כשמובייל פתוח + פיצוי לרוחב פס גלילה
  useEffect(() => {
    if (mobileOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [mobileOpen]);
  const goldText = "text-transparent bg-clip-text bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c]";
  const tealText = "text-[#0d9488] dark:text-[#21d4c5]";
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`} dir="rtl">
      {/* Animated gold border line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent animate-gold-border-sweep" />
      </div>
      {/* ================= ROW 1 (Desktop only) - CSS Grid for bulletproof centering ================= */}
      <div className="hidden lg:block relative z-20 bg-black/60 backdrop-blur-2xl border-b border-[#c9a84c]/20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 h-[120px] grid grid-cols-[1fr_auto_1fr] items-center gap-8">
          {/* RIGHT column: NAV (justify-self-end for RTL) */}
          <nav className="flex items-center gap-6 xl:gap-8 text-[16px] xl:text-[18px] font-semibold justify-self-end min-w-0">
            <Link to="/" className={`${goldText} hover:brightness-125 transition whitespace-nowrap`} aria-current="page">
              עמוד ראשי
            </Link>

            <Link to="/about" className={`${goldText} hover:brightness-125 transition whitespace-nowrap`}>
              אודות
            </Link>

            {/* Services dropdown */}
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <button type="button" className={`inline-flex items-center gap-2 ${goldText} hover:brightness-125 transition whitespace-nowrap`} aria-haspopup="menu" aria-expanded={servicesOpen}>
                שירותים
                <span className="text-[14px] text-[#c9a84c] opacity-80">▼</span>
              </button>

              {servicesOpen && <div className="absolute right-0 top-full pt-3 z-[100]">
                  <div className="min-w-[260px] rounded-xl border border-[#c9a84c]/30 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] shadow-xl shadow-[#c9a84c]/10 p-4">
                    {serviceLinks.map(item => <Link key={item.path} to={item.path} className={`flex items-center gap-2 py-2 ${goldText} hover:brightness-125 transition`}>
                        {item.label}
                      </Link>)}
                  </div>
                </div>}
            </div>
          </nav>

          {/* CENTER column: LOGO (justify-self-center) */}
          <Link to="/" className="justify-self-center" aria-label="א.א פרויקטים וגובה">
            <img src={logoImage} alt="א.א פרויקטים וגובה" className="h-[90px] lg:h-[110px] w-auto object-contain" draggable={false} />
          </Link>

          {/* LEFT column: NAV + BUTTONS (justify-self-start for RTL) */}
          <div className="flex items-center justify-self-start gap-4 xl:gap-6 min-w-0">
            <nav className="flex items-center gap-6 xl:gap-8 text-[16px] xl:text-[18px] font-semibold">
              <Link to="/projects" className={`${goldText} hover:brightness-125 transition whitespace-nowrap`}>
                פרויקטים
              </Link>

              <Link to="/pricing" className={`${goldText} hover:brightness-125 transition whitespace-nowrap`}>
                מחירים
              </Link>

              <Link to="/contact" className={`${goldText} hover:brightness-125 transition whitespace-nowrap`}>
                צור קשר
              </Link>
            </nav>

            {/* Buttons group */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={() => {
              const event = new CustomEvent("open-accessibility-menu");
              window.dispatchEvent(event);
            }} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-110 flex-shrink-0" aria-label="פתח תפריט נגישות" title="נגישות">
                <Accessibility className="w-5 h-5" />
              </button>
              <ThemeToggle />
              <Link to="/contact" className="quote-shimmer inline-flex items-center justify-center h-8 px-4 xl:px-6 rounded-full bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold hover:from-[#f0ddb0] hover:to-[#d4af37] transition-all duration-300 whitespace-nowrap flex-shrink-0">
                להצעת מחיר
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE FIXED BAR ================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[55] bg-black/90 backdrop-blur-xl border-b border-[#c9a84c]/20" dir="rtl">
        <div className="relative h-[70px] px-4">
          {/* RIGHT: Hamburger menu - fixed position */}
          <button type="button" onClick={() => setMobileOpen(true)} className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-12 h-12 rounded-xl hover:bg-white/5 transition" aria-label="פתח תפריט">
            <span className="flex flex-col gap-1.5">
              <span className="w-7 h-[2px] bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]" />
              <span className="w-7 h-[2px] bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]" />
              <span className="w-7 h-[2px] bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]" />
            </span>
          </button>

          {/* CENTER: Logo - absolutely centered */}
          <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-label="א.א פרויקטים וגובה">
            <img src={logoImage} alt="א.א פרויקטים וגובה" className="h-[60px] w-auto object-contain" draggable={false} />
          </Link>

          {/* LEFT: CTA button - fixed position */}
          <Link to="/contact" className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-10 px-5 rounded-full bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold whitespace-nowrap">
            להצעת מחיר
          </Link>
        </div>
      </div>

      {/* ================= ROW 2 (NAVY BAR) - dir="ltr" for physical left placement ================= */}
      <div className="hidden lg:block relative z-10 bg-black/60 backdrop-blur-2xl border-t border-[#c9a84c]/10">
        <div dir="ltr" className="mx-auto max-w-7xl px-6 h-[44px] grid grid-cols-[auto_1fr_auto] items-center">
          {/* LEFT (physical): Language Switcher */}
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>

          {/* CENTER: All quick links - dir="rtl" for Hebrew text order */}
          <nav dir="rtl" className="flex justify-center items-center gap-10 text-[15px] font-semibold">
            {/* Glassmorphism Button */}
            <Link 
              to="/stone-veneer" 
              className="group relative inline-flex items-center gap-3 py-2 px-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full shadow-lg hover:bg-white/20 hover:shadow-xl transition-all duration-500 hover:scale-105 transform -rotate-1 hover:rotate-0 font-medium overflow-hidden"
            >
              {/* Animated shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              
              {/* Pulsing glow ring */}
              <span className="absolute inset-0 rounded-full border border-white/30 animate-pulse" />
              
              {/* Main text with gold gradient */}
              <span className="relative text-[15px] font-bold bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                חיפוי אבן בטכנולוגיה מתקדמת
              </span>
            </Link>

            {quickLinks.map(item => <Link key={item.path} to={item.path} className="relative text-[#e8d5a3] hover:text-[#c9a84c] transition-colors duration-200 after:content-[''] after:absolute after:bottom-[-4px] after:right-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#e8d5a3] after:to-[#c9a84c] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-right">
                {item.label}
              </Link>)}
          </nav>

          {/* RIGHT (physical): Empty spacer for symmetry */}
          <div className="w-[80px]" />
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && <div className="fixed inset-0 z-[60] lg:hidden bg-[#0a0a0a]">
          <button type="button" className="absolute left-0 top-0 w-[14%] h-full" onClick={() => setMobileOpen(false)} aria-label="סגור תפריט" />

          <div className="absolute right-0 top-0 h-full w-[86%] max-w-[360px] bg-[#0a0a0a] border-l border-[#c9a84c]/20 p-5">
            <div className="flex items-center justify-between mb-6">
              <div className={`font-bold ${goldText}`}>תפריט</div>
              <button type="button" onClick={() => setMobileOpen(false)} className="text-[#c9a84c] hover:text-[#e8d5a3] transition">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-[18px] font-semibold">
              <Link to="/" onClick={() => setMobileOpen(false)} className={`${goldText} block hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right animate-slide-in-stagger`} style={{
            animationDelay: "0ms"
          }}>
                עמוד ראשי
              </Link>
              <Link to="/about" onClick={() => setMobileOpen(false)} className={`${goldText} block hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right animate-slide-in-stagger`} style={{
            animationDelay: "100ms"
          }}>
                אודות
              </Link>

              <button type="button" onClick={() => setServicesOpen(v => !v)} className={`w-full flex items-center justify-between ${goldText} hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right animate-slide-in-stagger`} style={{
            animationDelay: "200ms"
          }}>
                שירותים <span className="text-[14px] text-[#c9a84c] opacity-80">▼</span>
              </button>

              {servicesOpen && <div className="pr-3 space-y-2 text-[16px] bg-[#0a0a0a]">
                  {serviceLinks.map(item => <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={`${goldText} flex items-center gap-2 hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right`}>
                      {item.label}
                    </Link>)}
                </div>}

              <Link to="/projects" onClick={() => setMobileOpen(false)} className={`${goldText} block hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right animate-slide-in-stagger`} style={{
            animationDelay: "300ms"
          }}>
                פרויקטים
              </Link>
              <Link to="/pricing" onClick={() => setMobileOpen(false)} className={`${goldText} block hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right animate-slide-in-stagger`} style={{
            animationDelay: "400ms"
          }}>
                מחירים
              </Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className={`${goldText} block hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right animate-slide-in-stagger`} style={{
            animationDelay: "500ms"
          }}>
                צור קשר
              </Link>

              <Link to="/contact" onClick={() => setMobileOpen(false)} className="quote-shimmer mt-3 inline-flex items-center justify-center h-11 w-full rounded-full bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold hover:from-[#f0ddb0] hover:to-[#d4af37] transition-all duration-300 hover:scale-[0.97] active:scale-95 animate-slide-in-stagger" style={{
            animationDelay: "600ms"
          }}>
                להצעת מחיר
              </Link>
            </div>
          </div>
        </div>}
    </header>;
}