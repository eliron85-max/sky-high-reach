import React, { Suspense, useState, useCallback } from "react";
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
import SplashScreen from "./components/SplashScreen";

// Lazy load with one automatic reload if a stale chunk 404s after a new deploy
const lazyWithRetry = <T extends { default: React.ComponentType<any> }>(
  factory: () => Promise<T>
) =>
  React.lazy(() =>
    factory().catch((err) => {
      const key = "chunk-reloaded";
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
        return new Promise<T>(() => {});
      }
      throw err;
    })
  );

// Lazy load all pages for code splitting
const Index = lazyWithRetry(() => import("./pages/Index"));
const AboutPage = lazyWithRetry(() => import("./pages/AboutPage"));
const ServicesPage = lazyWithRetry(() => import("./pages/ServicesPage"));
const ProjectsPage = lazyWithRetry(() => import("./pages/ProjectsPage"));
const PricingPage = lazyWithRetry(() => import("./pages/PricingPage"));
const TestimonialsPage = lazyWithRetry(() => import("./pages/TestimonialsPage"));
const ContactPage = lazyWithRetry(() => import("./pages/ContactPage"));
const DemolitionOrders = lazyWithRetry(() => import("./pages/DemolitionOrders"));
const FacadeRestoration = lazyWithRetry(() => import("./pages/FacadeRestoration"));
const StoneVeneer = lazyWithRetry(() => import("./pages/StoneVeneer"));
const Waterproofing = lazyWithRetry(() => import("./pages/Waterproofing"));
const BirdControl = lazyWithRetry(() => import("./pages/BirdControl"));
const SpecialProjects = lazyWithRetry(() => import("./pages/SpecialProjects"));
const AccessibilityStatement = lazyWithRetry(() => import("./pages/AccessibilityStatement"));
const AuthPage = lazyWithRetry(() => import("./pages/AuthPage"));
const AdminInquiries = lazyWithRetry(() => import("./pages/AdminInquiries"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const queryClient = new QueryClient();
const App = () => {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashFinish = useCallback(() => setSplashDone(true), []);

  return <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LanguageProvider>
        <TooltipProvider>
          {!splashDone && <SplashScreen onFinish={handleSplashFinish} />}
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
};
export default App;