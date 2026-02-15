import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Projects from "@/components/Projects";
import { useTranslation } from "@/lib/i18n";

const ProjectsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <Header />
      <main className="pt-header-offset lg:pt-header-offset-lg">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-hero-dark text-white overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in text-white">{t("projectsPage.heroTitle")}</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
              {t("projectsPage.heroSubtitle")}
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <Projects />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
