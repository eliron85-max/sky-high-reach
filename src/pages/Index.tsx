import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import TrustStrip from "@/components/TrustStrip";
import HomeTestimonials from "@/components/HomeTestimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HeroStickyCollapse from "@/components/HeroStickyCollapse";

const Index = () => {
  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <Header />
      
      <HeroStickyCollapse 
        collapseDistance={650} 
        mobileCollapseDistance={450}
        after={
          <>
            <Services />
            <TrustStrip />
            <HomeTestimonials />
            <Contact />
            <Footer />
          </>
        }
      >
        <Hero />
      </HeroStickyCollapse>
    </div>
  );
};

export default Index;
