// src/components/Header.tsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Accessibility } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useTranslation } from "@/lib/i18n";
import logoImage from "@/assets/logo-new.webp";

export default function Header() {
  const { t } = useTranslation();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

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

  useEffect(() => {
    const apply = () => {
      const y = window.scrollY || 0;
      setIsVisible(y <= 20);
    };
    window.addEventListener("scroll", apply, { passive: true });
    apply();
    return () => window.removeEventListener("scroll", apply);
  }, []);

  const goldText =
    "text-foreground hover:text-primary dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-[#e8d5a3] dark:to-[#c9a84c] dark:hover:brightness-125 transition";

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 bg-[#d2d4d6] dark:bg-black transition-transform duration-700 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      dir="rtl"
    >
      {/* ROW 1 */}
      <div className="hidden md:block bg-[#d2d4d6] dark:bg-black border-b border-border dark:border-[#c9a84c]/20">
        <div className="mx-auto max-w-7xl px-6 h-[150px] grid grid-cols-[1fr_auto_1fr] items-center">
          {/* RIGHT NAV */}
          <nav className="flex items-center gap-8 text-[16px] lg:text-[15px] xl:text-[18px] font-semibold justify-self-end">
            <Link to="/" className={`${goldText} whitespace-nowrap`}>
              {t("nav.home")}
            </Link>
            <Link to="/about" className={`${goldText} whitespace-nowrap`}>
              {t("nav.about")}
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className={`inline-flex items-center gap-2 ${goldText} whitespace-nowrap`}>
                {t("nav.services")}
              </button>

              {servicesOpen && (
                <div className="absolute right-0 top-full pt-3">
                  <div className="min-w-[260px] rounded-xl bg-white dark:bg-black shadow-xl p-4">
                    {serviceLinks.map((item) => (
                      <Link key={item.path} to={item.path} className="block py-2 hover:text-primary transition">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* LOGO */}
          <Link to="/" className="justify-self-center">
            <img src={logoImage} alt="logo" className="h-[135px] w-auto object-contain" />
          </Link>

          {/* LEFT NAV */}
          <div className="flex items-center justify-self-start gap-8">
            <nav className="flex items-center gap-8 text-[16px] lg:text-[15px] xl:text-[18px] font-semibold">
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

            <div className="flex items-center gap-4">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-accessibility-menu"))}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"
              >
                <Accessibility className="w-5 h-5" />
              </button>

              <ThemeToggle />

              <Link
                to="/contact"
                className="inline-flex items-center justify-center h-9 px-6 rounded-full bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold whitespace-nowrap"
              >
                {t("nav.cta")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2 */}
      <div className="hidden md:block bg-white/80 dark:bg-black/20 border-t border-border dark:border-[#c9a84c]/10">
        <div className="mx-auto max-w-7xl px-6 h-[60px] flex items-center justify-center gap-16 text-[15px] lg:text-[14px] xl:text-[15px] font-semibold">
          {quickLinks.map((item) => (
            <Link key={item.path} to={item.path} className="hover:text-primary transition">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
