import { useState } from "react";
import { format } from "date-fns";
import { he, enUS, fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
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

  // === STYLE PRESET (כמו בתמונה) ===
  const sectionClass = `py-16 lg:py-24 bg-[#f6f6f6] scroll-reveal ${isVisible ? "visible" : ""}`;
  const frameClass = "max-w-6xl mx-auto bg-white border border-black/10 rounded-[28px] p-6 md:p-10";
  const titleClass = "text-4xl lg:text-6xl font-black text-black mb-4";
  const subtitleClass = "text-black/70 max-w-2xl mx-auto";

  const inputBase =
    "h-14 rounded-full bg-[#f4f4f4] border border-black/10 px-6 text-black placeholder:text-black/40 " +
    "focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black/20";
  const textareaBase =
    "rounded-[26px] bg-[#f4f4f4] border border-black/10 px-6 py-5 text-black placeholder:text-black/40 " +
    "focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black/20";
  const labelClass = "text-black font-semibold";

  const whiteCard = "bg-white border border-black/10 rounded-[24px]";
  const uploadBtn =
    "flex items-center gap-2 px-5 py-3 bg-[#f4f4f4] text-black rounded-full border border-black/10 cursor-pointer " +
    "hover:bg-[#ededed] transition-colors";
  const submitBtn =
    "w-full h-14 rounded-full text-white font-extrabold text-lg " +
    "bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] " +
    "hover:from-[#f0ddb0] hover:to-[#d4af37] " +
    "shadow-[0_18px_40px_rgba(201,168,76,0.25)]";

  // Get date-fns locale based on current language
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

  // Form state
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
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleProjectTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, projectType: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, preferredDate: date }));
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
        project_type: result.data.projectType,
        message: result.data.message,
        preferred_date: result.data.preferredDate ? format(result.data.preferredDate, "yyyy-MM-dd") : null,
      });
      if (error) throw error;

      // Send email notifications
      try {
        await supabase.functions.invoke("send-inquiry-notification", {
          body: {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            company: formData.company?.trim() || undefined,
            projectType: formData.projectType,
            message: formData.message.trim(),
            preferredDate: formData.preferredDate ? format(formData.preferredDate, "dd/MM/yyyy") : undefined,
          },
        });
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
      }

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

  return (
    <section ref={ref} id="contact" dir={dir} className={sectionClass}>
      <div className="container mx-auto px-4">
        {/* FRAME כמו בתמונה */}
        <div className={frameClass}>
          <div className="text-center mb-12">
            <h2 className={titleClass}>{t("contact.title")}</h2>
            <p className={subtitleClass}>{t("contact.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className={cn(whiteCard, "p-6 md:p-8 space-y-6")}>
                {/* Row 1: Name and Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className={labelClass} htmlFor="fullName">
                      {t("contact.form.fullName")}
                    </Label>
                    <Input
                      id="fullName"
                      placeholder={t("contact.form.fullNamePlaceholder")}
                      required
                      dir={dir}
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={cn(inputBase, validationErrors.fullName && "border-red-500")}
                    />
                    {validationErrors.fullName && <p className="text-sm text-red-600">{validationErrors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className={labelClass} htmlFor="company">
                      {t("contact.form.company")}
                    </Label>
                    <Input
                      id="company"
                      placeholder={t("contact.form.companyPlaceholder")}
                      dir={dir}
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={cn(inputBase)}
                    />
                  </div>
                </div>

                {/* Row 2: Phone and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className={labelClass} htmlFor="phone">
                      {t("contact.form.phone")}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t("contact.form.phonePlaceholder")}
                      required
                      dir={dir}
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={cn(inputBase, validationErrors.phone && "border-red-500")}
                    />
                    {validationErrors.phone && <p className="text-sm text-red-600">{validationErrors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className={labelClass} htmlFor="email">
                      {t("contact.form.email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("contact.form.emailPlaceholder")}
                      required
                      dir="ltr"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={cn(inputBase, validationErrors.email && "border-red-500")}
                    />
                    {validationErrors.email && <p className="text-sm text-red-600">{validationErrors.email}</p>}
                  </div>
                </div>

                {/* Row 3: Project Type and Preferred Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className={labelClass} htmlFor="projectType">
                      {t("contact.form.projectType")}
                    </Label>
                    <Select
                      required
                      value={formData.projectType}
                      onValueChange={handleProjectTypeChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="projectType"
                        dir={dir}
                        className={cn(inputBase, "h-14", validationErrors.projectType && "border-red-500")}
                      >
                        <SelectValue placeholder={t("contact.form.projectTypePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent dir={dir}>
                        <SelectItem value="restoration">{t("contact.form.projectTypes.restoration")}</SelectItem>
                        <SelectItem value="stone">{t("contact.form.projectTypes.stone")}</SelectItem>
                        <SelectItem value="sealing">{t("contact.form.projectTypes.sealing")}</SelectItem>
                        <SelectItem value="birds">{t("contact.form.projectTypes.birds")}</SelectItem>
                        <SelectItem value="special">{t("contact.form.projectTypes.special")}</SelectItem>
                        <SelectItem value="other">{t("contact.form.projectTypes.other")}</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.projectType && (
                      <p className="text-sm text-red-600">{validationErrors.projectType}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className={labelClass}>{t("contact.form.preferredDate")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          disabled={isSubmitting}
                          className={cn(
                            inputBase,
                            "w-full justify-start font-normal",
                            !formData.preferredDate && "text-black/40",
                          )}
                        >
                          <CalendarIcon className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                          {formData.preferredDate ? (
                            format(formData.preferredDate, "dd/MM/yyyy", { locale: getDateLocale() })
                          ) : (
                            <span>{t("contact.form.preferredDatePlaceholder")}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.preferredDate}
                          onSelect={handleDateChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          dir={dir}
                          locale={getDateLocale()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Row 4: Message */}
                <div className="space-y-2">
                  <Label className={labelClass} htmlFor="message">
                    {t("contact.form.message")}
                  </Label>
                  <Textarea
                    id="message"
                    placeholder={t("contact.form.messagePlaceholder")}
                    rows={6}
                    required
                    dir={dir}
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={cn(textareaBase, validationErrors.message && "border-red-500")}
                  />
                  {validationErrors.message && <p className="text-sm text-red-600">{validationErrors.message}</p>}
                </div>

                {/* Row 5: File Upload */}
                <div className="space-y-2">
                  <Label className={labelClass} htmlFor="file">
                    {t("contact.form.fileUpload")}
                  </Label>
                  <div className="flex items-center gap-4">
                    <label htmlFor="file" className={uploadBtn}>
                      <Upload size={20} />
                      <span className="text-sm font-semibold">{t("contact.form.chooseFile")}</span>
                    </label>
                    <input
                      id="file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.dwg,.doc,.docx"
                      disabled={isSubmitting}
                    />
                    {selectedFile && <span className="text-sm text-black/60">{selectedFile.name}</span>}
                  </div>
                  <p className="text-xs text-black/50">{t("contact.form.supportedFormats")}</p>
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className={submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className={`${dir === "rtl" ? "ml-2" : "mr-2"} animate-spin`} size={20} />
                  ) : (
                    <Send className={dir === "rtl" ? "ml-2" : "mr-2"} size={20} />
                  )}
                  {isSubmitting ? "שולח..." : t("contact.form.submit")}
                </Button>
              </form>
            </div>

            {/* Contact Info Card */}
            <div className="space-y-6">
              <div className={cn(whiteCard, "p-6")}>
                <h3 className="text-xl font-extrabold text-black mb-6">{t("contact.info.title")}</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="text-[#c9a84c] flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-bold text-black">{t("contact.info.phone")}</p>
                      <a href="tel:055-6616326" className="text-black/70 hover:text-black transition-colors">
                        055-6616326
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="text-[#c9a84c] flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-bold text-black">{t("contact.info.email")}</p>
                      <a
                        href="mailto:info@ropeaccess.co.il"
                        className="text-black/70 hover:text-black transition-colors"
                      >
                        info@ropeaccess.co.il
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-[#c9a84c] flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-bold text-black">{t("contact.info.address")}</p>
                      <p className="text-black/70 whitespace-pre-line">{t("contact.info.addressValue")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={cn("bg-[#f4f4f4] border border-black/10 rounded-[24px] p-6")}>
                <h4 className="font-extrabold text-black mb-2">{t("contact.hours.title")}</h4>
                <p className="text-sm text-black/70">
                  {t("contact.hours.weekdays")}
                  <br />
                  {t("contact.hours.friday")}
                  <br />
                  {t("contact.hours.saturday")}
                </p>
                <p className="text-xs text-black/50 mt-3">{t("contact.hours.urgent")}</p>
              </div>

              {/* Interactive Map */}
              <div className={cn(whiteCard, "overflow-hidden")}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.5!2d34.8667!3d32.0667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4a0c7b8b8b8b%3A0x0!2z15TXoteo15HXlCA1LCDXkteg15kg16rXp9eV15Q!5e0!3m2!1siw!2sil!4v1700000000000"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="מיקום המשרד - הערבה 5, גני תקווה"
                  className="w-full"
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
