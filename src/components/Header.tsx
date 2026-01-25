import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Accessibility } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import logoImage from "@/assets/logo-new.webp";

export default function Header() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // ====== Dynamic header height -> writes --header-height to :root ======
  const headerRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !headerRef.current) return;

    const el = headerRef.current;

    const setVar = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    };

    setVar();

    const ro = new ResizeObserver(setVar);
    ro.observe(el);

    window.addEventListener("resize", setVar, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, [mounted]);

  const quickLinks = useMemo(
    () => [
      { label: "שיקום מעטפת", path: "/facade-restoration" },
      { label: "חיפוי אבן", path: "/stone-veneer" },
      { label: "איטום", path: "/waterproofing" },
      { label: "הרחקת יונים", path: "/bird-control" },
      { label: "צוו הריסה", path: "/demolition-orders" },
    ],
    [],
  );

  const serviceLinks = useMemo(
    () => [
      { label: "שיקום מעטפת", path: "/facade-restoration" },
      { label: "חיפוי אבן", path: "/stone-veneer" },
      { label: "איטום", path: "/waterproofing" },
      { label: "הרחקת יונים", path: "/bird-control" },
      { label: "ציוד הריסה", path: "/demolition-orders" },
      { label: "פרויקטים מיוחדים", path: "/special-projects" },
    ],
    [],
  );

  // Header shows ONLY at the very top of the page (on entry). Any scroll hides it.
  const lastScrollYRef = useRef(0);
  const downAccumRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;
      const delta = currentY - lastY;

      if (currentY <= 10) {
        downAccumRef.current = 0;
        setIsVisible(true);
        lastScrollYRef.current = currentY;
        return;
      }

      if (delta > 0) {
        downAccumRef.current += delta;
        if (downAccumRef.current >= 140) {
          setIsVisible(false);
        }
      }

      if (delta < 0) {
        downAccumRef.current = 0;
        setIsVisible(true);
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
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
      document.body.style.overflow = "";return (
      document.body.style.paddingRight = "";
    };
  }, [mobileOpen]);

  const goldText = "text-transparent bg-clip-text bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c]";

  return (
    <header
      ref={headerRef}
    className={`fixed top-0 left-0 right-0 z-50 overflow-visible transition-transform duration-700 [padding-top:env(safe-area-inset-top)] ${
  isVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"
}`}

      dir="rtl"
    >
      {/* Animated gold border line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent animate-gold-border-sweep" />
      </div>

      {/* ================= ROW 1 (Desktop only) ================= */}
      <div className="hidden lg:block relative z-20 bg-black/20 backdrop-blur-2xl border-b border-[#c9a84c]/20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 h-[120px] grid grid-cols-[1fr_auto_1fr] items-center gap-8">
          {/* RIGHT column: NAV */}
          <nav className="flex items-center gap-6 xl:gap-8 text-[16px] xl:text-[18px] font-semibold justify-self-end min-w-0">
            <Link
              to="/"
              className={`${goldText} hover:brightness-125 transition whitespace-nowrap`}
              aria-current="page"
            >
              עמוד ראשי
            </Link>

            <Link to="/about" className={`${goldText} hover:brightness-125 transition whitespace-nowrap`}>
              אודות
            </Link>

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className={`inline-flex items-center gap-2 ${goldText} hover:brightness-125 transition whitespace-nowrap`}
                aria-haspopup="menu"
                aria-expanded={servicesOpen}
              >
                שירותים
                <span className="text-[14px] text-[#c9a84c] opacity-80">▼</span>
              </button>

              {servicesOpen && (
                <div className="absolute right-0 top-full pt-3 z-[100]">
                  <div className="min-w-[260px] rounded-xl border border-[#c9a84c]/30 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] shadow-xl shadow-[#c9a84c]/10 p-4">
                    {serviceLinks.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`block py-2 ${goldText} hover:brightness-125 transition`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* CENTER column: LOGO */}
          <Link to="/" className="justify-self-center" aria-label="א.א פרויקטים וגובה">
            <img
              src={logoImage}
              alt="א.א פרויקטים וגובה"
              className="h-[90px] lg:h-[110px] w-auto object-contain"
              draggable={false}
            />
          </Link>

          {/* LEFT column: NAV + BUTTONS */}
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

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-accessibility-menu"))}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-110 flex-shrink-0"
                aria-label="פתח תפריט נגישות"
                title="נגישות"
              >
                <Accessibility className="w-5 h-5" />
              </button>

              <ThemeToggle />

              <Link
                to="/contact"
                className="quote-shimmer inline-flex items-center justify-center h-8 px-4 xl:px-6 rounded-full bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold hover:from-[#f0ddb0] hover:to-[#d4af37] transition-all duration-300 whitespace-nowrap flex-shrink-0"
              >
                להצעת מחיר
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE BAR (NOT fixed!) ================= */}
      <div
        className="lg:hidden relative z-[55] overflow-visible bg-black/90 backdrop-blur-xl border-b border-[#c9a84c]/20"
        dir="rtl"
      >
        <div className="relative h-[84px] px-4 overflow-visible">
          {/* RIGHT: Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-12 h-12 rounded-xl hover:bg-white/5 transition"
            aria-label="פתח תפריט"
          >
            <span className="flex flex-col gap-1.5">
              <span className="w-7 h-[2px] bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]" />
              <span className="w-7 h-[2px] bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]" />
              <span className="w-7 h-[2px] bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]" />
            </span>
          </button>

          {/* CENTER: Logo */}
          <Link
            to="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-label="א.א פרויקטים וגובה"
          >
            <img
              src={logoImage}
              alt="א.א פרויקטים וגובה"
              className="h-[60px] w-auto object-contain"
              draggable={false}
            />
          </Link>

          {/* LEFT: CTA */}
          <Link
            to="/contact"
            className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-10 px-5 rounded-full bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold whitespace-nowrap"
          >
            להצעת מחיר
          </Link>
        </div>
      </div>

      {/* ================= ROW 2 (Desktop Quick Links) ================= */}
      <div className="hidden lg:block relative z-10 bg-black/20 backdrop-blur-2xl border-t border-[#c9a84c]/10">
        <div dir="ltr" className="mx-auto max-w-7xl px-6 h-[44px] grid grid-cols-[auto_1fr_auto] items-center">
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>

          <nav dir="rtl" className="flex justify-center items-center gap-16 text-[15px] font-semibold">
            {quickLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative text-[#e8d5a3] hover:text-[#c9a84c] transition-colors duration-200 after:content-[''] after:absolute after:bottom-[-4px] after:right-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#e8d5a3] after:to-[#c9a84c] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-right"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="w-[80px]" />
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden bg-black">
          <button
            type="button"
            className="absolute left-0 top-0 w-[14%] h-full"
            onClick={() => setMobileOpen(false)}
            aria-label="סגור תפריט"
          />

          <div className="absolute right-0 top-0 h-full w-[86%] max-w-[360px] bg-black border-l border-[#c9a84c]/20 p-5">
            <div className="flex items-center justify-between mb-6">
              <div className={`font-bold ${goldText}`}>תפריט</div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="text-[#c9a84c] hover:text-[#e8d5a3] transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-[18px] font-semibold">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className={`${goldText} block hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right animate-slide-in-stagger`}
                style={{ animationDelay: "0ms" }}
              >
                עמוד ראשי
              </Link>

              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className={`${goldText} block hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right animate-slide-in-stagger`}
                style={{ animationDelay: "100ms" }}
              >
                אודות
              </Link>

              <button
                type="button"
                onClick={() => setServicesOpen((v) => !v)}
                className={`w-full flex items-center justify-between ${goldText} hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right animate-slide-in-stagger`}
                style={{ animationDelay: "200ms" }}
              >
                שירותים <span className="text-[14px] text-[#c9a84c] opacity-80">▼</span>
              </button>

              {servicesOpen && (
                <div className="pr-3 space-y-2 text-[16px] bg-[#0a0a0a]">
                  {serviceLinks.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`${goldText} block hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              <Link
                to="/projects"
                onClick={() => setMobileOpen(false)}
                className={`${goldText} block hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right animate-slide-in-stagger`}
                style={{ animationDelay: "300ms" }}
              >
                פרויקטים
              </Link>

              <Link
                to="/pricing"
                onClick={() => setMobileOpen(false)}
                className={`${goldText} block hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right animate-slide-in-stagger`}
                style={{ animationDelay: "400ms" }}
              >
                מחירים
              </Link>

              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className={`${goldText} block hover:brightness-125 hover:scale-[0.97] active:scale-95 transition-all duration-200 origin-right animate-slide-in-stagger`}
                style={{ animationDelay: "500ms" }}
              >
                צור קשר
              </Link>

              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="quote-shimmer mt-3 inline-flex items-center justify-center h-11 w-full rounded-full bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold hover:from-[#f0ddb0] hover:to-[#d4af37] transition-all duration-300 hover:scale-[0.97] active:scale-95 animate-slide-in-stagger"
                style={{ animationDelay: "600ms" }}
              >
                להצעת מחיר
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
