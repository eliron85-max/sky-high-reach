import { useState } from "react";
import { format } from "date-fns";
import { he, enUS, fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/lib/i18n";
import { supabaseUntyped } from "@/lib/supabaseHelpers";
import { contactSchema, type ContactFormData } from "@/lib/contactSchema";

const Contact = () => {
  const { ref, isVisible } = useScrollReveal();
  const { toast } = useToast();
  const { t, dir, language } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    projectType: "",
    message: "",
    preferredDate: undefined,
  });

  // date-fns locale
  const getDateLocale = () => {
    switch (language) {
      case "he":
        return he;
      case "fr":
        return fr;
      default:
        return enUS;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabaseUntyped.from("inquiries").insert({
        full_name: result.data.fullName,
        company: result.data.company || null,
        phone: result.data.phone,
        email: result.data.email,
        project_type: result.data.projectType || "other",
        message: result.data.message,
        preferred_date: result.data.preferredDate ? format(result.data.preferredDate, "yyyy-MM-dd") : null,
      });

      if (error) throw error;

      toast({
        title: t("contact.form.successTitle"),
        description: t("contact.form.successMessage"),
      });

      setFormData({
        fullName: "",
        company: "",
        phone: "",
        email: "",
        projectType: "",
        message: "",
        preferredDate: undefined,
      });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשליחת הפנייה. נסה שנית.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // === Tailwind helpers (same vibe/colors as your screenshot) ===
  const pageBg = "bg-[#f6f6f6]";
  const frame = "border border-black/10";
  const card = "bg-white rounded-[28px]";
  const inputBase =
    "h-14 rounded-full bg-[#f4f4f4] border border-black/10 px-6 text-black placeholder:text-black/40 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black/20";
  const textareaBase =
    "min-h-[220px] rounded-[26px] bg-[#f4f4f4] border border-black/10 px-6 py-5 text-black placeholder:text-black/40 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black/20";

  return (
    <section
      ref={ref}
      id="contact"
      dir={dir}
      className={`${pageBg} py-16 lg:py-24 scroll-reveal ${isVisible ? "visible" : ""}`}
    >
      <div className="container mx-auto px-4">
        {/* FRAME כמו בתמונה */}
        <div className={`max-w-6xl mx-auto ${card} ${frame} px-6 md:px-10 py-10 md:py-14`}>
          {/* HEADLINE */}
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-black">{t("contact.title")}</h2>
            <p className="mt-4 text-black/70 text-base md:text-lg">{t("contact.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
            {/* TOP ROW (3 inputs like your screenshot vibe) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-black font-semibold">
                  {t("contact.form.fullName")}
                </Label>
                <Input
                  id="fullName"
                  dir={dir}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder={t("contact.form.fullNamePlaceholder")}
                  className={`${inputBase} ${validationErrors.fullName ? "border-red-500" : ""}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-black font-semibold">
                  {t("contact.form.phone")}
                </Label>
                <Input
                  id="phone"
                  dir={dir}
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder={t("contact.form.phonePlaceholder")}
                  className={`${inputBase} ${validationErrors.phone ? "border-red-500" : ""}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-semibold">
                  {t("contact.form.email")}
                </Label>
                <Input
                  id="email"
                  dir="ltr"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder={t("contact.form.emailPlaceholder")}
                  className={`${inputBase} ${validationErrors.email ? "border-red-500" : ""}`}
                />
              </div>
            </div>

            {/* BIG MESSAGE */}
            <div className="space-y-2 mb-8">
              <Label htmlFor="message" className="text-black font-semibold">
                {t("contact.form.message")}
              </Label>
              <Textarea
                id="message"
                dir={dir}
                value={formData.message}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder={t("contact.form.messagePlaceholder")}
                className={`${textareaBase} ${validationErrors.message ? "border-red-500" : ""}`}
              />
            </div>

            {/* CHECKBOX LINE (like screenshot) */}
            <div className="flex items-center justify-end gap-3 mb-8">
              <input id="privacy" type="checkbox" defaultChecked className="h-4 w-4 accent-[#c9a84c]" />
              <label htmlFor="privacy" className="text-black font-semibold">
                מאשר קבלת מידע פרסומי ושיווקי
              </label>
            </div>

            {/* GOLD BUTTON */}
            <div className="max-w-5xl mx-auto">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-full text-white font-extrabold text-lg
                           bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c]
                           hover:from-[#f0ddb0] hover:to-[#d4af37]
                           shadow-[0_18px_40px_rgba(201,168,76,0.25)]"
              >
                {isSubmitting ? "שולח..." : "שליחה »"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
