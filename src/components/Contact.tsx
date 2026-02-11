// src/components/Contact.tsx
import React, { useMemo, useState } from "react";
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
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { contactSchema, type ContactFormData } from "@/lib/contactSchema";
import { cn } from "@/lib/utils";

import { Upload, Phone, Mail, MapPin, Send, Loader2, CalendarIcon } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const { dir, language, t } = useTranslation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // ===== Styles (match reference) =====
  const sectionClass = "py-12 sm:py-16 lg:py-20 bg-[#e9e9e9]";

  // Rect frame like screenshot #2
  const outerFrame = "max-w-6xl mx-auto border border-black/70 bg-transparent";

  const inner = "px-6 py-10 md:px-14 md:py-14";

  const titleRow = "mx-auto flex max-w-4xl items-center justify-center gap-6";
  const titleLine = "hidden md:block h-px flex-1 bg-black/70";

  // Light surface cards
  const card = "rounded-[24px] border p-6 bg-white border-black/10";

  // Fields: light pills
  const field =
    "h-12 rounded-full px-5 border bg-white/90 border-black/10 text-black placeholder:text-black/40 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/35 focus-visible:border-[#c9a84c]/60 " +
    "focus-visible:ring-offset-0";

  const textarea =
    "rounded-[22px] px-5 py-4 border bg-white/90 border-black/10 text-black placeholder:text-black/40 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/35 focus-visible:border-[#c9a84c]/60 " +
    "focus-visible:ring-offset-0";

  const labelCls = "text-sm font-semibold text-black/70";

  const uploadBtn =
    "flex items-center gap-2 px-5 h-12 rounded-full border cursor-pointer select-none " +
    "bg-white/90 border-black/10 text-black hover:border-[#c9a84c]/60 transition";

  const submitBtn =
    "w-full h-12 rounded-full font-extrabold text-base text-white " +
    "bg-gradient-to-b from-[#e6c36a] to-[#b8963d] " +
    "hover:from-[#f1d07e] hover:to-[#c39a3b] transition";

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

  // ===== Calendar restrictions =====
  const todayStart = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const disablePastAndWeekend = (date: Date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = d.getDay(); // 0=Sun ... 5=Fri ... 6=Sat
    return d < todayStart || day === 5 || day === 6;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((p) => ({ ...p, [id]: value }));
  };

  const handleProjectTypeChange = (value: string) => setFormData((p) => ({ ...p, projectType: value }));
  const handleDateChange = (date: Date | undefined) => setFormData((p) => ({ ...p, preferredDate: date }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  // ===== Submit =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errs[err.path[0] as string] = err.message;
      });
      setValidationErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      // Route all submissions through edge function for rate limiting
      const { error } = await supabase.functions.invoke("send-inquiry-notification", {
        body: {
          fullName: result.data.fullName.trim(),
          email: result.data.email.trim(),
          phone: result.data.phone.trim(),
          company: result.data.company?.trim() || undefined,
          projectType: result.data.projectType,
          message: result.data.message.trim(),
          preferredDate: result.data.preferredDate ? format(result.data.preferredDate, "dd/MM/yyyy") : undefined,
        },
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
        title: t("contact.form.errorTitle"),
        description: t("contact.form.errorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" dir={dir} className={sectionClass}>
      <div className="container mx-auto px-4">
        <div className={outerFrame}>
          <div className={inner}>
            {/* Title like screenshot */}
            <div className="text-center">
              <div className={titleRow}>
                <div className={titleLine} />
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black">
                  {t("contact.title")}
                </h2>
                <div className={titleLine} />
              </div>
              <p className="mt-3 text-sm md:text-base text-black/70">
                {t("contact.subtitle")}
              </p>
            </div>

            {/* Grid */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* FORM */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className={cn(card, "space-y-6")}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className={labelCls} htmlFor="fullName">
                        {t("contact.form.fullName")}
                      </Label>
                      <Input
                        id="fullName"
                        placeholder={t("contact.form.fullNamePlaceholder")}
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={cn(field, validationErrors.fullName && "border-red-500")}
                        disabled={isSubmitting}
                        required
                      />
                      {validationErrors.fullName && (
                        <p className="text-sm text-red-600 mt-1">{validationErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <Label className={labelCls} htmlFor="company">
                        {t("contact.form.company")}
                      </Label>
                      <Input
                        id="company"
                        placeholder={t("contact.form.companyPlaceholder")}
                        value={formData.company}
                        onChange={handleInputChange}
                        className={field}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className={labelCls} htmlFor="phone">
                        {t("contact.form.phone")}
                      </Label>
                      <Input
                        id="phone"
                        placeholder={t("contact.form.phonePlaceholder")}
                        type="tel"
                        inputMode="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={cn(field, validationErrors.phone && "border-red-500")}
                        disabled={isSubmitting}
                        required
                      />
                      {validationErrors.phone && <p className="text-sm text-red-600 mt-1">{validationErrors.phone}</p>}
                    </div>

                    <div>
                      <Label className={labelCls} htmlFor="email">
                        {t("contact.form.email")}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("contact.form.emailPlaceholder")}
                        value={formData.email}
                        onChange={handleInputChange}
                        className={cn(field, validationErrors.email && "border-red-500")}
                        disabled={isSubmitting}
                        required
                        dir="ltr"
                      />
                      {validationErrors.email && <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>}
                    </div>
                  </div>

                  {/* Project type + preferred date */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className={labelCls}>{t("contact.form.projectType")}</Label>

                      <Select
                        value={formData.projectType}
                        onValueChange={handleProjectTypeChange}
                        disabled={isSubmitting}
                      >
                        {/* ✅ Uses your updated select.tsx */}
                        <SelectTrigger
                          variant="light"
                          className={cn(
                            field,
                            "justify-between",
                            "[&_[data-placeholder]]:text-black/40",
                            validationErrors.projectType && "border-red-500",
                          )}
                        >
                          <SelectValue placeholder={t("contact.form.projectTypePlaceholder")} />
                        </SelectTrigger>

                        <SelectContent variant="light" dir={dir}>
                          <SelectItem variant="light" value="restoration">
                            {t("contact.form.projectTypes.restoration")}
                          </SelectItem>
                          <SelectItem variant="light" value="stone">
                            {t("contact.form.projectTypes.stone")}
                          </SelectItem>
                          <SelectItem variant="light" value="sealing">
                            {t("contact.form.projectTypes.sealing")}
                          </SelectItem>
                          <SelectItem variant="light" value="birds">
                            {t("contact.form.projectTypes.birds")}
                          </SelectItem>
                          <SelectItem variant="light" value="special">
                            {t("contact.form.projectTypes.special")}
                          </SelectItem>
                          <SelectItem variant="light" value="other">
                            {t("contact.form.projectTypes.other")}
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {validationErrors.projectType && (
                        <p className="text-sm text-red-600 mt-1">{validationErrors.projectType}</p>
                      )}
                    </div>

                    <div>
                      <Label className={labelCls}>{t("contact.form.preferredDate")}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(field, "justify-between", "bg-white/90 hover:bg-white/95 border-black/10")}
                            disabled={isSubmitting}
                          >
                            <span className="truncate">
                              {formData.preferredDate
                                ? format(formData.preferredDate, "dd/MM/yyyy", { locale: getDateLocale() })
                                : t("contact.form.preferredDatePlaceholder")}
                            </span>
                            <CalendarIcon className="h-5 w-5 opacity-80" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="p-0" align="start">
                          <div className="calendar-lux p-4" dir={dir}>
                            <Calendar
                              mode="single"
                              selected={formData.preferredDate}
                              onSelect={handleDateChange}
                              locale={getDateLocale()}
                              dir={dir}
                              fromMonth={todayStart}
                              disabled={disablePastAndWeekend}
                              fixedWeeks
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label className={labelCls} htmlFor="message">
                      הודעה
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="כתוב כאן את פרטי הפנייה…"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={cn(textarea, validationErrors.message && "border-red-500")}
                      disabled={isSubmitting}
                      rows={6}
                      required
                    />
                    {validationErrors.message && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.message}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <label className={uploadBtn}>
                      <Upload size={18} />
                      בחר קובץ
                      <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        accept=".pdf,.jpg,.jpeg,.png,.dwg,.doc,.docx"
                      />
                    </label>
                    {selectedFile && <span className="text-sm text-black/60">{selectedFile.name}</span>}
                  </div>

                  <Button type="submit" className={submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className={dir === "rtl" ? "ml-2 animate-spin" : "mr-2 animate-spin"} size={18} />
                    ) : (
                      <Send className={dir === "rtl" ? "ml-2" : "mr-2"} size={18} />
                    )}
                    שליחה
                  </Button>
                </form>
              </div>

              {/* SIDE COLUMN */}
              <div className="space-y-6">
                <div className={card}>
                  <div className="flex items-center gap-3">
                    <Phone className="text-[#c9a84c]" size={18} />
                    <span className="text-black">055-6616326</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <Mail className="text-[#c9a84c]" size={18} />
                    <span className="text-black">info@ropeaccess.co.il</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <MapPin className="text-[#c9a84c]" size={18} />
                    <span className="text-black">גני תקווה</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar skin (kept from your original) */}
            <style>{`
              .calendar-lux{
                --lux-bg: #ffffff;
                --lux-text: rgba(0,0,0,0.92);
                --lux-muted: rgba(0,0,0,0.52);
                --lux-border: rgba(0,0,0,0.10);
                --lux-gold: rgba(201,168,76,0.90);
                --lux-hover: rgba(0,0,0,0.05);

                background: var(--lux-bg);
                border: 1px solid var(--lux-border);
                border-radius: 22px;
                box-shadow: 0 14px 40px rgba(0,0,0,0.10);
                overflow: hidden;
              }

              .calendar-lux .rdp,
              .calendar-lux .rdp *{ color: var(--lux-text) !important; }

              .calendar-lux .rdp-caption_label{
                font-weight: 900 !important;
                text-shadow: 0 2px 18px rgba(201,168,76,0.18);
              }

              .calendar-lux .rdp-head_cell{
                color: var(--lux-muted) !important;
                font-weight: 800 !important;
              }

              .calendar-lux .rdp-day{ border-radius: 999px !important; }

              .calendar-lux .rdp-day:not(.rdp-day_disabled):not([aria-selected="true"]):hover{
                background: var(--lux-hover) !important;
                box-shadow: 0 0 0 1px rgba(201,168,76,0.12) inset !important;
              }

              .calendar-lux button[aria-selected="true"],
              .calendar-lux .rdp-day[aria-selected="true"],
              .calendar-lux .rdp-day_selected,
              .calendar-lux .day_selected{
                background: transparent !important;
                background-color: transparent !important;
                color: var(--lux-text) !important;
                border: 1px solid var(--lux-gold) !important;
                box-shadow: 0 0 0 3px rgba(201,168,76,0.14) !important;
              }

              .calendar-lux .rdp-nav_button{
                width: 40px !important;
                height: 40px !important;
                border-radius: 999px !important;
                background: rgba(255,255,255,0.03) !important;
                border: 1px solid rgba(201,168,76,0.18) !important;
              }
              .calendar-lux .rdp-nav_button:hover{ background: rgba(201,168,76,0.10) !important; }

              .rdp-nav{ display:flex; align-items:center; gap:12px; }
              [dir="rtl"] .rdp-nav_button_next{ order:1; }
              [dir="rtl"] .rdp-nav_button_previous{ order:2; }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
