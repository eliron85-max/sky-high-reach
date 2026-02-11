// src/components/Header.tsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Accessibility } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useTranslation } from "@/lib/i18n";
import logoImage from "@/assets/logo-new.webp";

export default function Header() {
  const { t, dir } = useTranslation();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // ====== Dynamic header height -> writes --header-height to :root ======
  const headerRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => setMounted(true), []);

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
      { label: t("quickLinks.facadeRestoration"), path: "/facade-restoration" },
      { label: t("quickLinks.stoneVeneer"), path: "/stone-veneer" },
      { label: t("quickLinks.waterproofing"), path: "/waterproofing" },
      { label: t("quickLinks.birdControl"), path: "/bird-control" },
      { label: t("quickLinks.demolitionOrders"), path: "/demolition-orders" },
    ],
    [t],
  );

  const serviceLinks = useMemo(
    () => [
      { label: t("serviceLinks.facadeRestoration"), path: "/facade-restoration" },
      { label: t("serviceLinks.stoneVeneer"), path: "/stone-veneer" },
      { label: t("serviceLinks.waterproofing"), path: "/waterproofing" },
      { label: t("serviceLinks.birdControl"), path: "/bird-control" },
      { label: t("serviceLinks.demolitionOrders"), path: "/demolition-orders" },
      { label: t("serviceLinks.specialProjects"), path: "/special-projects" },
    ],
    [t],
  );

  // Header shows on scroll-up, hides on scroll-down, always visible at top or when menu open
  const lastScrollY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (y <= 2) {
        setIsVisible(true);
      } else if (y < lastScrollY.current) {
        setIsVisible(true);
      } else if (y > lastScrollY.current + 5) {
        setIsVisible(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile drawer is open + signal to other components
  useEffect(() => {
    if (mobileOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.dataset.mobileMenuOpen = "true";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      delete document.documentElement.dataset.mobileMenuOpen;
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      delete document.documentElement.dataset.mobileMenuOpen;
    };
  }, [mobileOpen]);

  // Close services accordion when closing drawer
  useEffect(() => {
    if (!mobileOpen) setServicesOpen(false);
  }, [mobileOpen]);

  const goldText =
    "text-foreground hover:text-primary dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-[#e8d5a3] dark:to-[#c9a84c] dark:hover:brightness-125 transition";

  const closeMobile = () => {
    setMobileOpen(false);
    setServicesOpen(false);
  };

  return (
    <header
      ref={headerRef}
      data-mobile-open={mobileOpen ? "true" : "false"}
      className={`fixed top-0 left-0 right-0 z-50 bg-[#d2d4d6] dark:bg-black overflow-visible transition-transform duration-700 [padding-top:env(safe-area-inset-top)] ${
        isVisible || mobileOpen ? "translate-y-0" : "-translate-y-full"
      }`}
      dir="rtl"
    >
      {/* Animated gold border line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent animate-gold-border-sweep" />
      </div>

      {/* ================= ROW 1 (Desktop only) ================= */}
      <div className="hidden lg:block relative z-20 bg-[#d2d4d6] dark:bg-black/20 backdrop-blur-2xl border-b border-border dark:border-[#c9a84c]/20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 h-[120px] grid grid-cols-[1fr_auto_1fr] items-center gap-8">
          {/* RIGHT column: NAV */}
          <nav className="flex items-center gap-6 xl:gap-8 text-[16px] xl:text-[18px] font-semibold justify-self-end min-w-0">
            <Link to="/" className={`${goldText} whitespace-nowrap`} aria-current="page">
              {t("nav.home")}
            </Link>

            <Link to="/about" className={`${goldText} whitespace-nowrap`}>
              {t("nav.about")}
            </Link>

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className={`inline-flex items-center gap-2 ${goldText} whitespace-nowrap`}
                aria-haspopup="menu"
                aria-expanded={servicesOpen}
              >
                {t("nav.services")}
                <span className="text-[14px] text-foreground dark:text-[#c9a84c] opacity-80">▼</span>
              </button>

              {servicesOpen && (
                <div className="absolute right-0 top-full pt-3 z-[100]">
                  <div className="min-w-[260px] rounded-xl border border-border dark:border-[#c9a84c]/30 bg-white dark:bg-gradient-to-b dark:from-[#1a1a1a] dark:to-[#0a0a0a] shadow-xl dark:shadow-[#c9a84c]/10 p-4">
                    {serviceLinks.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block py-2 text-foreground hover:text-primary dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-[#e8d5a3] dark:to-[#c9a84c] dark:hover:brightness-125 transition"
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
              <Link to="/projects" className={`${goldText} whitespace-nowrap`}>
                {t("nav.projects")}
              </Link>

              <Link to="/pricing" className={`${goldText} whitespace-nowrap`}>
                {t("nav.pricing")}
              </Link>

              <Link to="/contact" className={`${goldText} whitespace-nowrap`}>
                {t("nav.contact")}
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
                className="quote-shimmer hp-cta inline-flex items-center justify-center h-8 px-4 xl:px-6 rounded-full bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold hover:from-[#f0ddb0] hover:to-[#d4af37] transition-all duration-300 whitespace-nowrap flex-shrink-0"
              >
                {t("nav.cta")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE BAR (SOLID + TOGGLE ICON) ================= */}
      <div
        className="lg:hidden relative z-[55] overflow-visible bg-black text-white border-b border-[#c9a84c]/25 [isolation:isolate]"
        dir="rtl"
      >
        <div className="relative h-[84px] px-4 overflow-visible">
          {/* RIGHT: Toggle button (Hamburger <-> Close) */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-12 h-12 rounded-xl hover:bg-white/10 transition"
            aria-label={mobileOpen ? "סגור תפריט" : "פתח תפריט"}
          >
            {!mobileOpen ? (
              <span className="flex flex-col gap-1.5">
                <span className="w-7 h-[2px] bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]" />
                <span className="w-7 h-[2px] bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]" />
                <span className="w-7 h-[2px] bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]" />
              </span>
            ) : (
              <span className="relative w-7 h-7">
                <span className="absolute left-1/2 top-1/2 w-7 h-[2px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]" />
                <span className="absolute left-1/2 top-1/2 w-7 h-[2px] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]" />
              </span>
            )}
          </button>

          {/* CENTER: Logo */}
          <Link
            to="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-label="א.א פרויקטים וגובה"
            onClick={closeMobile}
          >
            <img
              src={logoImage}
              alt="א.א פרויקטים וגובה"
              className="h-[56px] w-auto max-w-[140px] object-contain"
              draggable={false}
            />
          </Link>

          {/* LEFT: CTA */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Link
              to="/contact"
              onClick={closeMobile}
              className="hp-cta inline-flex items-center justify-center h-9 px-3 rounded-full bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold whitespace-nowrap text-[14px]"
            >
              {t("nav.cta")}
            </Link>
          </div>
        </div>
      </div>

      {/* ================= ROW 2 (Desktop Quick Links) ================= */}
      <div className="hidden lg:block relative z-10 bg-white/80 dark:bg-black/20 backdrop-blur-2xl border-t border-border dark:border-[#c9a84c]/10">
        <div dir="ltr" className="mx-auto max-w-7xl px-6 h-[44px] grid grid-cols-[auto_1fr_auto] items-center">
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>

          <nav dir="rtl" className="flex justify-center items-center gap-16 text-[15px] font-semibold">
            {quickLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative text-foreground hover:text-primary dark:text-[#e8d5a3] dark:hover:text-[#c9a84c] transition-colors duration-200 after:content-[''] after:absolute after:bottom-[-4px] after:right-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-primary after:to-primary dark:after:from-[#e8d5a3] dark:after:to-[#c9a84c] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-right"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="w-[80px]" />
        </div>
      </div>

      {/* ================= MOBILE DRAWER (ARCCA 1:1 - MENU RIGHT, INFO LEFT) ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[2147483647] lg:hidden bg-black overflow-hidden min-h-[100dvh]" dir="rtl">
          <div className="fixed inset-0 z-[2147483647] grid grid-cols-[1.15fr_0.85fr] min-h-[100dvh]">
            {/* RIGHT: MENU */}
            <nav className="bg-[#d7cfbf] text-[#1b1b1b] h-full min-h-[100dvh] overflow-hidden text-right relative" dir="rtl">
              {/* X close button at top of nav panel */}
              <div className="h-[64px] flex items-center justify-start px-5">
                <button
                  type="button"
                  onClick={closeMobile}
                  className="w-11 h-11 rounded-xl border border-black/20 text-[#1b1b1b] hover:bg-black/10 flex items-center justify-center"
                  aria-label="סגור תפריט"
                >
                  ✕
                </button>
              </div>

              <div className="divide-y divide-black/20">
                <Link
                  to="/"
                  onClick={closeMobile}
                  className="h-[56px] px-5 flex items-center justify-start tracking-[0.12em] hover:bg-black/5"
                >
                  {t("nav.home")}
                </Link>

                <Link
                  to="/about"
                  onClick={closeMobile}
                  className="h-[56px] px-5 flex items-center justify-start tracking-[0.12em] hover:bg-black/5"
                >
                  {t("nav.about")}
                </Link>

                <div>
                  <button
                    type="button"
                    onClick={() => setServicesOpen((v) => !v)}
                    className="w-full h-[56px] px-5 flex items-center justify-between tracking-[0.12em] hover:bg-black/5"
                  >
                    {t("nav.services")}
                    <span className="text-[14px]">{servicesOpen ? "▲" : "▼"}</span>
                  </button>

                  {servicesOpen && (
                    <div className="border-t border-black/20">
                      {serviceLinks.map((s) => (
                        <Link
                          key={s.path}
                          to={s.path}
                          onClick={closeMobile}
                          className="block px-6 py-3 text-[14px] hover:bg-black/5 text-right"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/projects"
                  onClick={closeMobile}
                  className="h-[56px] px-5 flex items-center justify-start tracking-[0.12em] hover:bg-black/5"
                >
                  {t("nav.projects")}
                </Link>

                <Link
                  to="/pricing"
                  onClick={closeMobile}
                  className="h-[56px] px-5 flex items-center justify-start tracking-[0.12em] hover:bg-black/5"
                >
                  {t("nav.pricing")}
                </Link>

                <Link
                  to="/contact"
                  onClick={closeMobile}
                  className="h-[56px] px-5 flex items-center justify-start tracking-[0.12em] hover:bg-black/5"
                >
                  {t("nav.contact")}
                </Link>
              </div>
            </nav>

            {/* LEFT: INFO */}
            <aside className="bg-[#1c1714] text-[#e6dccb] relative h-full min-h-[100dvh] overflow-hidden" dir="ltr">

              <div className="h-full flex flex-col px-6 pt-4 pb-6">
                {/* Top row: language switcher + theme toggle */}
                <div className="flex items-center justify-between mb-4">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
                <img src={logoImage} className="h-[60px] w-auto object-contain" alt="logo" />

                <div className="mt-8 h-px bg-white/10" />

                <div className="mt-6 grid grid-cols-2 gap-6 text-[12px]">
                  <div>
                    <div className="opacity-60 uppercase tracking-widest">Email</div>
                    <div className="mt-2 break-words">contact@heights-projects.com</div>
                  </div>

                  <div>
                    <div className="opacity-60 uppercase tracking-widest">Phone</div>
                    <div className="mt-2 break-words">055-661-6326</div>
                  </div>

                  <div>
                    <div className="opacity-60 uppercase tracking-widest">Location</div>
                    <div className="mt-2 break-words">Israel</div>
                  </div>

                  <div>
                    <div className="opacity-60 uppercase tracking-widest">Social</div>
                    <div className="mt-2 break-words">Instagram / Facebook</div>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="h-px bg-white/10 mb-4" />
                  <div className="flex justify-between text-[10px] opacity-60 tracking-widest">
                    <span>Privacy Policy</span>
                    <span>© A.A</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </header>
  );
}
