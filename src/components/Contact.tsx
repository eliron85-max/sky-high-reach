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
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleProjectTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      projectType: value,
    }));
  };
  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      preferredDate: date,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate with Zod
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
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
      if (error) {
        throw error;
      }

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
        // Don't fail the form submission if email fails
      }
      toast({
        title: t("contact.form.successTitle"),
        description: t("contact.form.successMessage"),
      });

      // Reset form
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
    <section
      ref={ref}
      id="contact"
      dir={dir}
      className={`py-16 lg:py-24 bg-secondary scroll-reveal ${isVisible ? "visible" : ""}`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{t("contact.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("contact.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card border border-card-border rounded-card p-8 space-y-6">
              {/* Row 1: Name and Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("contact.form.fullName")}</Label>
                  <Input
                    id="fullName"
                    placeholder={t("contact.form.fullNamePlaceholder")}
                    required
                    dir={dir}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={validationErrors.fullName ? "border-destructive" : ""}
                  />
                  {validationErrors.fullName && <p className="text-sm text-destructive">{validationErrors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">{t("contact.form.company")}</Label>
                  <Input
                    id="company"
                    placeholder={t("contact.form.companyPlaceholder")}
                    dir={dir}
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Row 2: Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("contact.form.phone")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t("contact.form.phonePlaceholder")}
                    required
                    dir={dir}
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={validationErrors.phone ? "border-destructive" : ""}
                  />
                  {validationErrors.phone && <p className="text-sm text-destructive">{validationErrors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("contact.form.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("contact.form.emailPlaceholder")}
                    required
                    dir="ltr"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={validationErrors.email ? "border-destructive" : ""}
                  />
                  {validationErrors.email && <p className="text-sm text-destructive">{validationErrors.email}</p>}
                </div>
              </div>

              {/* Row 3: Project Type and Preferred Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectType">{t("contact.form.projectType")}</Label>
                  <Select
                    required
                    value={formData.projectType}
                    onValueChange={handleProjectTypeChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="projectType"
                      dir={dir}
                      className={validationErrors.projectType ? "border-destructive" : ""}
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
                    <p className="text-sm text-destructive">{validationErrors.projectType}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>{t("contact.form.preferredDate")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={isSubmitting}
                        className={cn(
                          "w-full justify-start text-right font-normal",
                          !formData.preferredDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                        {formData.preferredDate ? (
                          format(formData.preferredDate, "dd/MM/yyyy", {
                            locale: getDateLocale(),
                          })
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
                <Label htmlFor="message">{t("contact.form.message")}</Label>
                <Textarea
                  id="message"
                  placeholder={t("contact.form.messagePlaceholder")}
                  rows={6}
                  required
                  dir={dir}
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={validationErrors.message ? "border-destructive" : ""}
                />
                {validationErrors.message && <p className="text-sm text-destructive">{validationErrors.message}</p>}
              </div>

              {/* Row 5: File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file">{t("contact.form.fileUpload")}</Label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="file"
                    className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-button border border-card-border cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    <Upload size={20} />
                    <span className="text-sm">{t("contact.form.chooseFile")}</span>
                  </label>
                  <input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.dwg,.doc,.docx"
                    disabled={isSubmitting}
                  />
                  {selectedFile && <span className="text-sm text-muted-foreground">{selectedFile.name}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{t("contact.form.supportedFormats")}</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
                disabled={isSubmitting}
              >
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
            <div className="bg-card border border-card-border rounded-card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">{t("contact.info.title")}</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-foreground">{t("contact.info.phone")}</p>
                    <a href="tel:055-6616326" className="text-muted-foreground hover:text-primary transition-colors">
                      055-6616326
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-foreground">{t("contact.info.email")}</p>
                    <a
                      href="mailto:info@ropeaccess.co.il"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      onboarding@resend.dev
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-foreground">{t("contact.info.address")}</p>
                    <p className="text-muted-foreground whitespace-pre-line">{t("contact.info.addressValue")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-card p-6">
              <h4 className="font-semibold text-foreground mb-2">{t("contact.hours.title")}</h4>
              <p className="text-sm text-foreground/80">
                {t("contact.hours.weekdays")}
                <br />
                {t("contact.hours.friday")}
                <br />
                {t("contact.hours.saturday")}
              </p>
              <p className="text-xs text-muted-foreground mt-3">{t("contact.hours.urgent")}</p>
            </div>

            {/* Interactive Map */}
            <div className="bg-card border border-card-border rounded-card overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.5!2d34.8667!3d32.0667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4a0c7b8b8b8b%3A0x0!2z15TXoteo15HXlCA1LCDXkteg15kg16rXp9eV15Q!5e0!3m2!1siw!2sil!4v1700000000000"
                width="100%"
                height="200"
                style={{
                  border: 0,
                }}
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
    </section>
  );
};
export default Contact;
