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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[55] bg-black/90 backdrop-blur-xl border-b border-[#c9a84c]/20 pt-[env(safe-area-inset-top)]" dir="rtl">
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
      {mobileOpen && (
        <>
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 z-[59] lg:hidden bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
            aria-label="סגור תפריט"
          />
          
          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 z-[60] lg:hidden w-[85%] max-w-[360px] bg-gradient-to-bl from-[#0d0d0d] via-[#0a0a0a] to-[#080808] border-l border-[#c9a84c]/30 shadow-2xl shadow-black/50 animate-slide-in-right">
            
            {/* Header with close button */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#c9a84c]/20">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] rounded-full" />
                <span className={`text-lg font-bold ${goldText}`}>תפריט</span>
              </div>
              <button 
                type="button" 
                onClick={() => setMobileOpen(false)} 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-[#c9a84c]/20 text-[#c9a84c] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/40 transition-all duration-300"
              >
                <span className="sr-only">סגור</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="px-6 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
              {/* Main links with stagger animation */}
              <Link 
                to="/" 
                onClick={() => setMobileOpen(false)} 
                className="group flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-[#c9a84c]/10 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: "50ms" }}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a84c]/20 to-transparent border border-[#c9a84c]/20 group-hover:border-[#c9a84c]/40 transition-colors">
                  <svg className="w-4 h-4 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </span>
                <span className={`text-[17px] font-semibold ${goldText} group-hover:translate-x-[-4px] transition-transform duration-300`}>עמוד ראשי</span>
              </Link>

              <Link 
                to="/about" 
                onClick={() => setMobileOpen(false)} 
                className="group flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-[#c9a84c]/10 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: "100ms" }}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a84c]/20 to-transparent border border-[#c9a84c]/20 group-hover:border-[#c9a84c]/40 transition-colors">
                  <svg className="w-4 h-4 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className={`text-[17px] font-semibold ${goldText} group-hover:translate-x-[-4px] transition-transform duration-300`}>אודות</span>
              </Link>

              {/* Services Dropdown */}
              <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
                <button 
                  type="button" 
                  onClick={() => setServicesOpen(v => !v)} 
                  className={`group w-full flex items-center justify-between py-3 px-4 rounded-xl hover:bg-[#c9a84c]/10 transition-all duration-300 ${servicesOpen ? 'bg-[#c9a84c]/10' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a84c]/20 to-transparent border border-[#c9a84c]/20 group-hover:border-[#c9a84c]/40 transition-colors">
                      <svg className="w-4 h-4 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </span>
                    <span className={`text-[17px] font-semibold ${goldText} group-hover:translate-x-[-4px] transition-transform duration-300`}>שירותים</span>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-[#c9a84c] transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Services submenu with smooth animation */}
                <div className={`overflow-hidden transition-all duration-300 ease-out ${servicesOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="mr-6 pr-4 py-2 border-r-2 border-[#c9a84c]/30 space-y-1">
                    {serviceLinks.map((item, index) => (
                      <Link 
                        key={item.path} 
                        to={item.path} 
                        onClick={() => setMobileOpen(false)} 
                        className="group flex items-center gap-2 py-2.5 px-3 rounded-lg text-[15px] text-[#d6c38a] hover:text-[#e8d5a3] hover:bg-[#c9a84c]/10 transition-all duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]/50 group-hover:bg-[#c9a84c] transition-colors" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link 
                to="/projects" 
                onClick={() => setMobileOpen(false)} 
                className="group flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-[#c9a84c]/10 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a84c]/20 to-transparent border border-[#c9a84c]/20 group-hover:border-[#c9a84c]/40 transition-colors">
                  <svg className="w-4 h-4 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className={`text-[17px] font-semibold ${goldText} group-hover:translate-x-[-4px] transition-transform duration-300`}>פרויקטים</span>
              </Link>

              <Link 
                to="/pricing" 
                onClick={() => setMobileOpen(false)} 
                className="group flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-[#c9a84c]/10 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: "250ms" }}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a84c]/20 to-transparent border border-[#c9a84c]/20 group-hover:border-[#c9a84c]/40 transition-colors">
                  <svg className="w-4 h-4 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className={`text-[17px] font-semibold ${goldText} group-hover:translate-x-[-4px] transition-transform duration-300`}>מחירים</span>
              </Link>

              <Link 
                to="/contact" 
                onClick={() => setMobileOpen(false)} 
                className="group flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-[#c9a84c]/10 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: "300ms" }}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a84c]/20 to-transparent border border-[#c9a84c]/20 group-hover:border-[#c9a84c]/40 transition-colors">
                  <svg className="w-4 h-4 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className={`text-[17px] font-semibold ${goldText} group-hover:translate-x-[-4px] transition-transform duration-300`}>צור קשר</span>
              </Link>
            </nav>

            {/* CTA Button at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#c9a84c]/20 bg-gradient-to-t from-[#0a0a0a] to-transparent">
              <Link 
                to="/contact" 
                onClick={() => setMobileOpen(false)} 
                className="quote-shimmer flex items-center justify-center gap-2 h-14 w-full rounded-2xl bg-gradient-to-r from-[#e8d5a3] via-[#c9a84c] to-[#b8943f] text-black font-bold text-lg shadow-lg shadow-[#c9a84c]/20 hover:shadow-xl hover:shadow-[#c9a84c]/30 hover:scale-[0.98] active:scale-95 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: "400ms" }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                להצעת מחיר
              </Link>
            </div>
          </div>
        </>
      )}
    </header>;
}