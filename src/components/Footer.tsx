import { Phone, Mail, MapPin, Facebook, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import logoImage from "@/assets/logo-new.webp";

const Footer = () => {
  const { t, dir } = useTranslation();

  return (
    <footer
      className="bg-[#0a1628]/90 backdrop-blur-xl text-white transition-colors duration-300"
      dir={dir}
    >
      <div>
        {/* Top Contact Strip */}
        <div className="border-b border-white/10 py-6">
          <div className="container mx-auto px-4">
            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-6 text-center ${
                dir === "rtl" ? "md:text-right" : "md:text-left"
              }`}
            >
              <div
                className={`flex items-center justify-center ${
                  dir === "rtl" ? "md:justify-start" : "md:justify-start"
                } gap-3`}
              >
                <Phone className="text-[#c9a84c]" size={20} />
                <div>
                  <p className="text-sm text-white/60">{t("footer.phone")}</p>
                  <a href="tel:055-6616326" className="text-white hover:text-[#c9a84c] transition-colors">
                    055-6616326
                  </a>
                </div>
              </div>

              <div
                className={`flex items-center justify-center ${
                  dir === "rtl" ? "md:justify-start" : "md:justify-start"
                } gap-3`}
              >
                <Mail className="text-[#c9a84c]" size={20} />
                <div>
                  <p className="text-sm text-white/60">{t("footer.email")}</p>
                  <a
                    href="mailto:info@ropeaccess.co.il"
                    className="text-white hover:text-[#c9a84c] transition-colors"
                  >
                    info@ropeaccess.co.il
                  </a>
                </div>
              </div>

              <div
                className={`flex items-center justify-center ${
                  dir === "rtl" ? "md:justify-start" : "md:justify-start"
                } gap-3`}
              >
                <MapPin className="text-[#c9a84c]" size={20} />
                <div>
                  <p className="text-sm text-white/60">{t("footer.address")}</p>
                  <p className="text-white">{t("footer.addressValue")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Right Navigation */}
              <nav className={`flex flex-col gap-3 ${dir === "rtl" ? "order-3 lg:order-1" : "order-1 lg:order-1"}`}>
                <h3 className="text-[#c9a84c] font-semibold mb-2">{t("footer.quickNav")}</h3>

                <Link
                  to="/"
                  className={`text-white/80 hover:text-[#c9a84c] transition-colors ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {t("footer.home")}
                </Link>
                <Link
                  to="/about"
                  className={`text-white/80 hover:text-[#c9a84c] transition-colors ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {t("footer.about")}
                </Link>
                <Link
                  to="/services"
                  className={`text-white/80 hover:text-[#c9a84c] transition-colors ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {t("footer.services")}
                </Link>
                <Link
                  to="/projects"
                  className={`text-white/80 hover:text-[#c9a84c] transition-colors ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {t("footer.projects")}
                </Link>
              </nav>

              {/* Center Logo */}
              <div
                className={`flex flex-col items-center gap-4 ${
                  dir === "rtl" ? "order-1 lg:order-2" : "order-2 lg:order-2"
                }`}
              >
                <Link to="/" aria-label="א.א פרויקטים וגובה">
                  <img
                    src={logoImage}
                    alt="א.א פרויקטים וגובה"
                    className="h-[80px] w-auto object-contain"
                    draggable={false}
                  />
                </Link>

                <p className="text-white/60 text-center text-sm max-w-xs">
                  {t("footer.companyDescription")}
                </p>

                <div className="flex gap-4 mt-2">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-[#c9a84c] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-[#c9a84c] transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-[#c9a84c] transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </div>

              {/* Left Navigation */}
              <nav className={`flex flex-col gap-3 ${dir === "rtl" ? "order-2 lg:order-3" : "order-3 lg:order-3"}`}>
                <h3 className="text-[#c9a84c] font-semibold mb-2">{t("footer.moreInfo")}</h3>

                <Link
                  to="/pricing"
                  className={`text-white/80 hover:text-[#c9a84c] transition-colors ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {t("footer.pricing")}
                </Link>
                <Link
                  to="/testimonials"
                  className={`text-white/80 hover:text-[#c9a84c] transition-colors ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {t("footer.testimonials")}
                </Link>
                <Link
                  to="/contact"
                  className={`text-white/80 hover:text-[#c9a84c] transition-colors ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {t("footer.contact")}
                </Link>
                <Link
                  to="/accessibility"
                  className={`text-white/80 hover:text-[#c9a84c] transition-colors ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {t("footer.accessibility")}
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/10 py-6">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-white/60">
              © {new Date().getFullYear()} {t("footer.copyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
