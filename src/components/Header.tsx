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

  const headerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const el = headerRef.current;

    const setVar = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    };

    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener("resize", setVar);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

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

  const goldText =
    "text-foreground hover:text-primary dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-[#e8d5a3] dark:to-[#c9a84c] dark:hover:brightness-125 transition";

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-[#d2d4d6] dark:bg-black" dir="rtl">
      {/* ===== DESKTOP / LAPTOP ===== */}
      <div className="hidden lg:block border-b border-border dark:border-[#c9a84c]/20">
        <div className="mx-auto max-w-7xl px-6 h-[140px] grid grid-cols-[1fr_auto_1fr] items-center">
          {/* RIGHT NAV */}
          <nav className="flex items-center gap-8 text-[18px] font-semibold justify-self-end">
            <Link to="/" className={goldText}>
              {t("nav.home")}
            </Link>
            <Link to="/about" className={goldText}>
              {t("nav.about")}
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className={`inline-flex items-center gap-2 ${goldText}`}>{t("nav.services")}</button>

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
            <img src={logoImage} alt="logo" className="h-[120px] w-auto object-contain" />
          </Link>

          {/* LEFT NAV */}
          <div className="flex items-center justify-self-start gap-8">
            <nav className="flex items-center gap-8 text-[18px] font-semibold">
              <Link to="/projects" className={goldText}>
                {t("nav.projects")}
              </Link>
              <Link to="/pricing" className={goldText}>
                {t("nav.pricing")}
              </Link>
              <Link to="/contact" className={goldText}>
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
                className="px-6 h-10 rounded-full bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold flex items-center"
              >
                {t("nav.cta")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE ===== */}
      <div className="lg:hidden bg-black text-white">
        <div className="h-[90px] flex items-center justify-center relative">
          <img src={logoImage} alt="logo" className="h-[65px] object-contain" />
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="hidden lg:block bg-white/80 dark:bg-black/30 border-t">
        <div className="mx-auto max-w-7xl px-6 h-[60px] flex items-center justify-center gap-16 text-[16px] font-semibold">
          {quickLinks.map((item) => (
            <Link key={item.path} to={item.path}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
