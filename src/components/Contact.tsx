// Contact.tsx
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
import { Upload, Phone, Mail, MapPin, Send, Loader2, CalendarIcon } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/lib/i18n";
import { supabaseUntyped } from "@/lib/supabaseHelpers";
import { contactSchema, type ContactFormData } from "@/lib/contactSchema";
import { cn } from "@/lib/utils";

type FormState = ContactFormData & {
  preferredTime: string;
};

const Contact = () => {
  const { ref, isVisible } = useScrollReveal();
  const { toast } = useToast();
  const { dir, language } = useTranslation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // ===== STYLES =====
  const sectionClass = `py-16 lg:py-24 scroll-reveal bg-[#f6f6f6] dark:bg-[#0f1115] ${isVisible ? "visible" : ""}`;

  const frame =
    "max-w-6xl mx-auto rounded-[28px] border p-6 md:p-10 bg-white border-black/10 dark:bg-[#1b1f26] dark:border-white/10";

  const field =
    "h-14 rounded-full px-6 border bg-[#f4f4f4] border-black/10 text-black placeholder:text-black/40 " +
    "dark:bg-[#11151c] dark:border-white/10 dark:text-white dark:placeholder:text-white/40 " +
    "focus-visible:ring-0 focus-visible:ring-offset-0";

  const textarea =
    "rounded-[26px] px-6 py-5 border bg-[#f4f4f4] border-black/10 text-black placeholder:text-black/40 " +
    "dark:bg-[#11151c] dark:border-white/10 dark:text-white dark:placeholder:text-white/40 " +
    "focus-visible:ring-0 focus-visible:ring-offset-0";

  const labelCls = "font-semibold text-black dark:text-white";

  const card = "rounded-[24px] border p-6 bg-white border-black/10 dark:bg-[#1b1f26] dark:border-white/10";

  const uploadBtn =
    "flex items-center gap-2 px-5 py-3 rounded-full border cursor-pointer select-none " +
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
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    projectType: "",
    message: "",
    preferredDate: undefined,
    preferredTime: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((p) => ({ ...p, [id]: value }));
  };

  const handleProjectTypeChange = (value: string) => setFormData((p) => ({ ...p, projectType: value }));
  const handleDateChange = (date: Date | undefined) => setFormData((p) => ({ ...p, preferredDate: date }));
  const handleTimeChange = (value: string) => setFormData((p) => ({ ...p, preferredTime: value }));

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
      const preferredDateIso = result.data.preferredDate ? format(result.data.preferredDate, "yyyy-MM-dd") : null;

      const { error } = await supabaseUntyped.from("inquiries").insert({
        full_name: result.data.fullName,
        company: result.data.company || null,
        phone: result.data.phone,
        email: result.data.email,
        project_type: result.data.projectType,
        message: result.data.message,
        preferred_date: preferredDateIso,
        // preferred_time: formData.preferredTime || null,
      });

      if (error) throw error;

      toast({
        title: "נשלח בהצלחה",
        description: "קיבלנו את הפנייה שלך ונחזור אליך בהקדם.",
      });

      setFormData({
        fullName: "",
        company: "",
        phone: "",
        email: "",
        projectType: "",
        message: "",
        preferredDate: undefined,
        preferredTime: "",
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FORM */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className={cn(card, "space-y-6")}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className={labelCls}>שם מלא</Label>
                    <Input
                      id="fullName"
                      placeholder="שם מלא"
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
                    <Label className={labelCls}>שם חברה</Label>
                    <Input
                      id="company"
                      placeholder="שם חברה (לא חובה)"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={field}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className={labelCls}>טלפון</Label>
                    <Input
                      id="phone"
                      placeholder="טלפון"
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
                    <Label className={labelCls}>אימייל</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="אימייל"
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

                {/* סוג + תאריך + שעה */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label className={labelCls}>סוג פרויקט</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={handleProjectTypeChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={cn(field, validationErrors.projectType && "border-red-500")}>
                        <SelectValue placeholder="בחר סוג" />
                      </SelectTrigger>
                      <SelectContent dir={dir}>
                        <SelectItem value="restoration">שיקום</SelectItem>
                        <SelectItem value="stone">אבן</SelectItem>
                        <SelectItem value="sealing">איטום</SelectItem>
                        <SelectItem value="birds">הרחקת יונים</SelectItem>
                        <SelectItem value="special">מיוחד</SelectItem>
                        <SelectItem value="other">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.projectType && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.projectType}</p>
                    )}
                  </div>

                  <div>
                    <Label className={labelCls}>תאריך מועדף</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(field, "justify-start")}
                          disabled={isSubmitting}
                        >
                          <CalendarIcon className={dir === "rtl" ? "ml-2" : "mr-2"} />
                          {formData.preferredDate
                            ? format(formData.preferredDate, "dd/MM/yyyy", { locale: getDateLocale() })
                            : "בחר תאריך"}
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

                  <div>
                    <Label className={labelCls}>שעה מועדפת</Label>
                    <Select value={formData.preferredTime} onValueChange={handleTimeChange} disabled={isSubmitting}>
                      <SelectTrigger className={field}>
                        <SelectValue placeholder="בחר שעה" />
                      </SelectTrigger>
                      <SelectContent dir={dir}>
                        <SelectItem value="08:00">08:00</SelectItem>
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                        <SelectItem value="11:00">11:00</SelectItem>
                        <SelectItem value="12:00">12:00</SelectItem>
                        <SelectItem value="13:00">13:00</SelectItem>
                        <SelectItem value="14:00">14:00</SelectItem>
                        <SelectItem value="15:00">15:00</SelectItem>
                        <SelectItem value="16:00">16:00</SelectItem>
                        <SelectItem value="17:00">17:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className={labelCls}>הודעה</Label>
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
                  {validationErrors.message && <p className="text-sm text-red-600 mt-1">{validationErrors.message}</p>}
                </div>

                <div className="flex items-center gap-4">
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
                  {selectedFile && (
                    <span className="text-sm text-black/60 dark:text-white/60">{selectedFile.name}</span>
                  )}
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
                  <span className="text-black dark:text-white">055-6616326</span>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Mail className="text-[#c9a84c]" size={18} />
                  <span className="text-black dark:text-white">info@ropeaccess.co.il</span>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <MapPin className="text-[#c9a84c]" size={18} />
                  <span className="text-black dark:text-white">גני תקווה</span>
                </div>
              </div>

              {/* CALENDAR BOARD */}
              <div className={card}>
                <h4 className="text-center font-bold mb-4 text-black dark:text-white">לוח זמינות</h4>

                <div className="calendar-lux p-4">
                  <div className="flex justify-center">
                    <div dir={dir}>
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
                  </div>

                  <div className="mt-4 text-center text-xs lux-muted">
                    שישי ושבת חסומים • ימים שעברו חסומים • אין ניווט לחודשים קודמים
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ CSS ONLY HERE. NO CSS AFTER export default */}
      <style>{`
        /* ===== Luxury Calendar (scoped wrapper) ===== */

        /* Light defaults */
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

        /* Dark mode */
        .dark .calendar-lux{
          --lux-bg: radial-gradient(140% 120% at 50% 0%,
            rgba(255,255,255,0.06),
            rgba(0,0,0,0.94)
          );
          --lux-text: rgba(255,255,255,0.92);
          --lux-muted: rgba(255,255,255,0.58);
          --lux-border: rgba(201,168,76,0.45);
          --lux-hover: rgba(255,255,255,0.06);

          background: var(--lux-bg);
          border: 1px solid var(--lux-border);
          box-shadow:
            0 18px 55px rgba(0,0,0,0.55),
            0 0 0 1px rgba(201,168,76,0.14) inset;
        }

        .calendar-lux .lux-muted{
          color: var(--lux-muted) !important;
        }

        /* Force calendar text colors */
        .calendar-lux .rdp,
        .calendar-lux .rdp *{
          color: var(--lux-text) !important;
        }

        /* Month title */
        .calendar-lux .rdp-caption_label{
          font-weight: 900 !important;
          letter-spacing: 0.2px;
          text-shadow: 0 2px 18px rgba(201,168,76,0.18);
        }

        /* Weekdays */
        .calendar-lux .rdp-head_cell{
          color: var(--lux-muted) !important;
          font-weight: 800 !important;
        }

        /* Day base */
        .calendar-lux .rdp-day{
          border-radius: 999px !important;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease, border-color 160ms ease;
        }

        /* Hover */
        .calendar-lux .rdp-day:not(.rdp-day_disabled):not([aria-selected="true"]):hover{
          background: var(--lux-hover) !important;
          box-shadow: 0 0 0 1px rgba(201,168,76,0.12) inset !important;
          transform: translateY(-1px);
        }

        /* Disabled */
        .calendar-lux .rdp-day_disabled{
          opacity: 0.45 !important;
        }

        /* Today (not selected) */
        .calendar-lux .rdp-day_today:not([aria-selected="true"]){
          box-shadow: 0 0 0 1px rgba(201,168,76,0.14) inset !important;
        }

        /* ✅ SELECTED: transparent circle + thin gold border (kills teal) */
        .calendar-lux button[aria-selected="true"],
        .calendar-lux .rdp-button[aria-selected="true"],
        .calendar-lux .rdp-day[aria-selected="true"],
        .calendar-lux .day_selected,
        .calendar-lux .rdp-day_selected,
        .calendar-lux .rdp-day_selected > button{
          background: transparent !important;
          background-color: transparent !important;
          color: var(--lux-text) !important;

          border: 1px solid var(--lux-gold) !important;
          border-color: var(--lux-gold) !important;

          box-shadow:
            0 0 0 3px rgba(201,168,76,0.14),
            0 10px 26px rgba(0,0,0,0.22) !important;
        }

        .calendar-lux button[aria-selected="true"]:hover,
        .calendar-lux .rdp-button[aria-selected="true"]:hover{
          background: transparent !important;
          background-color: transparent !important;
        }

        /* ✅ KILL Tailwind teal (primary) INSIDE calendar only */
        .calendar-lux .bg-primary,
        .calendar-lux .hover\\:bg-primary:hover,
        .calendar-lux .focus\\:bg-primary:focus,
        .calendar-lux .focus-visible\\:bg-primary:focus-visible{
          background: transparent !important;
          background-color: transparent !important;
        }

        .calendar-lux .text-primary-foreground,
        .calendar-lux .hover\\:text-primary-foreground:hover,
        .calendar-lux .focus\\:text-primary-foreground:focus,
        .calendar-lux .focus-visible\\:text-primary-foreground:focus-visible{
          color: var(--lux-text) !important;
        }

        .calendar-lux .ring-primary,
        .calendar-lux .focus\\:ring-primary:focus,
        .calendar-lux .focus-visible\\:ring-primary:focus-visible{
          --tw-ring-color: rgba(201,168,76,0.45) !important;
        }

        .calendar-lux .ring-offset-background{
          --tw-ring-offset-color: transparent !important;
        }

        /* Nav buttons */
        .calendar-lux .rdp-nav_button{
          width: 40px !important;
          height: 40px !important;
          border-radius: 999px !important;
          background: rgba(255,255,255,0.03) !important;
          border: 1px solid rgba(201,168,76,0.18) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08) !important;
        }

        .calendar-lux .rdp-nav_button:hover{
          background: rgba(201,168,76,0.10) !important;
        }

        /* RTL nav order */
        .rdp-nav{
          display: flex;
          align-items: center;
          gap: 12px;
        }
        [dir="rtl"] .rdp-nav_button_next{ order: 1; }
        [dir="rtl"] .rdp-nav_button_previous{ order: 2; }
      `}</style>
    </section>
  );
};

export default Contact;
