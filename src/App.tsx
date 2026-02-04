import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/i18n";
import LoadingSpinner from "./components/LoadingSpinner";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import AccessibilityButton from "./components/AccessibilityButton";

// Lazy load all pages for code splitting
const Index = React.lazy(() => import("./pages/Index"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const ServicesPage = React.lazy(() => import("./pages/ServicesPage"));
const ProjectsPage = React.lazy(() => import("./pages/ProjectsPage"));
const PricingPage = React.lazy(() => import("./pages/PricingPage"));
const TestimonialsPage = React.lazy(() => import("./pages/TestimonialsPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const DemolitionOrders = React.lazy(() => import("./pages/DemolitionOrders"));
const FacadeRestoration = React.lazy(() => import("./pages/FacadeRestoration"));
const StoneVeneer = React.lazy(() => import("./pages/StoneVeneer"));
const Waterproofing = React.lazy(() => import("./pages/Waterproofing"));
const BirdControl = React.lazy(() => import("./pages/BirdControl"));
const SpecialProjects = React.lazy(() => import("./pages/SpecialProjects"));
const AccessibilityStatement = React.lazy(() => import("./pages/AccessibilityStatement"));
const AuthPage = React.lazy(() => import("./pages/AuthPage"));
const AdminInquiries = React.lazy(() => import("./pages/AdminInquiries"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const queryClient = new QueryClient();
const App = () => <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <FloatingWhatsApp />
            <AccessibilityButton />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/demolition-orders" element={<DemolitionOrders />} />
                <Route path="/facade-restoration" element={<FacadeRestoration />} />
                <Route path="/stone-veneer" element={<StoneVeneer />} />
                <Route path="/waterproofing" element={<Waterproofing />} />
                <Route path="/bird-control" element={<BirdControl />} />
                <Route path="/special-projects" element={<SpecialProjects />} />
                <Route path="/accessibility" element={<AccessibilityStatement />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin/inquiries" element={<AdminInquiries />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>;
export default App;