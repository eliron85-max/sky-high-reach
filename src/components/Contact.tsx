import { useState } from "react";
import { format } from "date-fns";
import { he, enUS, fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Upload, Phone, Mail, MapPin, Send, Loader2, CalendarIcon } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/lib/i18n";
import { supabaseUntyped } from "@/lib/supabaseHelpers";
import { contactSchema, type ContactFormData } from "@/lib/contactSchema";
import { cn } from "@/lib/utils";

const Contact = () => {
  const { ref, isVisible } = useScrollReveal();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { t, dir, language } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // ===== THEME STYLES =====
  const sectionClass = `py-16 lg:py-24 scroll-reveal bg-[#f6f6f6] dark:bg-[#0f1115] ${isVisible ? "visible" : ""}`;

  const frame =
    "max-w-6xl mx-auto rounded-[28px] border p-6 md:p-10 " +
    "bg-white border-black/10 dark:bg-[#1b1f26] dark:border-white/10";

  const titleCls = "text-4xl lg:text-6xl font-black mb-4 text-black dark:text-white";

  const subCls = "max-w-2xl mx-auto text-black/70 dark:text-white/60";

  const field =
    "h-14 rounded-full px-6 border " +
    "bg-[#f4f4f4] border-black/10 text-black placeholder:text-black/40 " +
    "dark:bg-[#11151c] dark:border-white/10 dark:text-white dark:placeholder:text-white/40 " +
    "focus-visible:ring-0 focus-visible:ring-offset-0";

  const textarea =
    "rounded-[26px] px-6 py-5 border " +
    "bg-[#f4f4f4] border-black/10 text-black placeholder:text-black/40 " +
    "dark:bg-[#11151c] dark:border-white/10 dark:text-white dark:placeholder:text-white/40 " +
    "focus-visible:ring-0 focus-visible:ring-offset-0";

  const labelCls = "font-semibold text-black dark:text-white";

  const card = "rounded-[24px] border p-6 bg-white border-black/10 dark:bg-[#1b1f26] dark:border-white/10";

  const uploadBtn =
    "flex items-center gap-2 px-5 py-3 rounded-full border cursor-pointer " +
    "bg-[#f4f4f4] border-black/10 text-black hover:bg-[#ededed] " +
    "dark:bg-[#11151c] dark:border-white/10 dark:text-white dark:hover:bg-[#151a22]";

  const submitBtn =
    "w-full h-14 rounded-full font-extrabold text-lg text-black " +
    "bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] " +
    "hover:from-[#f0ddb0] hover:to-[#d4af37]";

  // ===== Locale =====
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

  // ===== State =====
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    projectType: "",
    message: "",
    preferredDate: undefined,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((p) => ({ ...p, [id]: value }));
  };

  const handleProjectTypeChange = (value: string) => {
    setFormData((p) => ({ ...p, projectType: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((p) => ({ ...p, preferredDate: date }));
  };

  // ===== Submit =====
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
        project_type: result.data.projectType,
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
      setSelectedFile(null);
    } catch {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשליחת הפנייה",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="contact" dir={dir} className={sectionClass}>
      <div className="container mx-auto px-4">
        <div className={frame}>
          <div className="text-center mb-12">
            <h2 className={titleCls}>{t("contact.title")}</h2>
            <p className={subCls}>{t("contact.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FORM */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className={cn(card, "space-y-6")}>
                {/* Name + Company */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className={labelCls}>{t("contact.form.fullName")}</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={cn(field, validationErrors.fullName && "border-red-500")}
                    />
                  </div>
                  <div>
                    <Label className={labelCls}>{t("contact.form.company")}</Label>
                    <Input id="company" value={formData.company} onChange={handleInputChange} className={field} />
                  </div>
                </div>

                {/* Phone + Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className={labelCls}>{t("contact.form.phone")}</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={cn(field, validationErrors.phone && "border-red-500")}
                    />
                  </div>
                  <div>
                    <Label className={labelCls}>{t("contact.form.email")}</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={cn(field, validationErrors.email && "border-red-500")}
                    />
                  </div>
                </div>

                {/* Project Type + Date */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className={labelCls}>{t("contact.form.projectType")}</Label>
                    <Select value={formData.projectType} onValueChange={handleProjectTypeChange}>
                      <SelectTrigger className={field}>
                        <SelectValue placeholder={t("contact.form.projectTypePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restoration">שיקום</SelectItem>
                        <SelectItem value="stone">אבן</SelectItem>
                        <SelectItem value="sealing">איטום</SelectItem>
                        <SelectItem value="birds">הרחקת יונים</SelectItem>
                        <SelectItem value="special">מיוחד</SelectItem>
                        <SelectItem value="other">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className={labelCls}>{t("contact.form.preferredDate")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn(field, "justify-start")}>
                          <CalendarIcon className="ml-2" />
                          {formData.preferredDate
                            ? format(formData.preferredDate, "dd/MM/yyyy", { locale: getDateLocale() })
                            : t("contact.form.preferredDatePlaceholder")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Calendar
                          mode="single"
                          selected={formData.preferredDate}
                          onSelect={handleDateChange}
                          locale={getDateLocale()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label className={labelCls}>{t("contact.form.message")}</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={cn(textarea, validationErrors.message && "border-red-500")}
                  />
                </div>

                {/* Upload */}
                <div>
                  <label className={uploadBtn}>
                    <Upload size={18} />
                    {t("contact.form.chooseFile")}
                    <input type="file" hidden onChange={handleFileChange} />
                  </label>
                </div>

                {/* Submit */}
                <Button type="submit" className={submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin ml-2" /> : <Send className="ml-2" />}
                  שליחה
                </Button>
              </form>
            </div>

            {/* INFO */}
            <div className="space-y-6">
              <div className={card}>
                <div className="flex gap-3">
                  <Phone className="text-[#c9a84c]" />
                  <span>055-6616326</span>
                </div>
                <div className="flex gap-3">
                  <Mail className="text-[#c9a84c]" />
                  <span>info@ropeaccess.co.il</span>
                </div>
                <div className="flex gap-3">
                  <MapPin className="text-[#c9a84c]" />
                  <span>גני תקווה</span>
                </div>
              </div>

              <div className={card}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.5!2d34.8667!3d32.0667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4a0c7b8b8b8b%3A0x0!2z15TXoteo15HXlCA1LCDXkteg15kg16rXp9eV15Q!5e0!3m2!1siw!2sil!4v1700000000000"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
