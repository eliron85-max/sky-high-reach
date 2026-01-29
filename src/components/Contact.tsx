// src/components/Contact.tsx  (או src/pages/Contact.tsx)
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { supabaseUntyped } from "@/lib/supabaseHelpers";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

type MiniForm = {
  fullName: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
};

const Contact = () => {
  const { toast } = useToast();
  const { t, dir } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<MiniForm>({
    fullName: "",
    phone: "",
    email: "",
    message: "",
    consent: true,
  });

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "חובה למלא שם";
    if (!form.phone.trim()) e.phone = "חובה למלא טלפון";
    if (!form.email.trim()) e.email = "חובה למלא אימייל";

    if (form.email.trim()) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
      if (!ok) e.email = "אימייל לא תקין";
    }

    if (!form.message.trim()) e.message = "חובה למלא הודעה";
    if (!form.consent) e.consent = "נדרש אישור";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const setField = (key: keyof MiniForm, value: any) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const markTouched = (key: keyof MiniForm) => {
    setTouched((p) => ({ ...p, [key]: true }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      phone: true,
      email: true,
      message: true,
      consent: true,
    });

    if (!isValid) return;

    setIsSubmitting(true);
    try {
      // 1) שומרים DB (טבלה inquiries)
      // אם אצלך בעמודה email יכול להיות nullable/לא nullable — כאן זה תמיד נשלח
      const { error } = await supabaseUntyped.from("inquiries").insert({
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        company: null,
        project_type: "other",
        preferred_date: null,
      });

      if (error) throw error;

      // 2) שולחים מייל (Edge Function)
      // אם הפונקציה אצלך מצפה לשדות נוספים – השארתי את כולם/בטוחים
      try {
        await supabase.functions.invoke("send-inquiry-notification", {
          body: {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            company: undefined,
            projectType: "other",
            message: form.message.trim(),
            preferredDate: undefined,
          },
        });
      } catch (emailError) {
        console.error("Email notify failed:", emailError);
        // לא מפילים שליחה אם מייל נכשל
      }

      toast({
        title: t?.("contact.form.successTitle") ?? "נשלח ✅",
        description: t?.("contact.form.successMessage") ?? "קיבלנו את הפנייה ונחזור בהקדם.",
      });

      setForm({
        fullName: "",
        phone: "",
        email: "",
        message: "",
        consent: true,
      });
      setTouched({});
    } catch (err) {
      console.error("Error submitting inquiry:", err);
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
    <section dir={dir} className="bg-white text-black py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative border border-black/30 px-5 sm:px-10 py-10 sm:py-14">
          {/* קווי “פינות” כמו בתמונה */}
          <div className="pointer-events-none absolute -top-[1px] left-10 h-[1px] w-44 bg-black/30" />
          <div className="pointer-events-none absolute -top-[1px] right-10 h-[1px] w-44 bg-black/30" />
          <div className="pointer-events-none absolute top-10 -left-[1px] h-40 w-[1px] bg-black/30" />
          <div className="pointer-events-none absolute top-10 -right-[1px] h-40 w-[1px] bg-black/30" />

          <h1 className="text-center font-extrabold tracking-tight leading-[0.95] text-[44px] sm:text-[76px] lg:text-[96px]">
            ע.אחרון בונים עתיד <span className="inline-block">למשפחה שלכם</span>
          </h1>

          <p className="mt-4 text-center text-base sm:text-lg text-black/70">
            מלאו את הפרטים כדי ליצור איתנו קשר ונחזור אליכם בהקדם
          </p>

          <form onSubmit={onSubmit} className="mt-10 sm:mt-12">
            {/* 3 שדות בשורה */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* שם */}
              <div>
                <input
                  className={[
                    "w-full h-[58px] rounded-3xl bg-black/[0.03] px-5 text-base outline-none",
                    "placeholder:text-black/35 ring-1 ring-black/10 focus:ring-black/25",
                    touched.fullName && errors.fullName ? "ring-red-500/60 focus:ring-red-500/70" : "",
                  ].join(" ")}
                  placeholder="שם"
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  onBlur={() => markTouched("fullName")}
                  disabled={isSubmitting}
                />
                {touched.fullName && errors.fullName ? (
                  <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                ) : null}
              </div>

              {/* טלפון */}
              <div>
                <input
                  className={[
                    "w-full h-[58px] rounded-3xl bg-black/[0.03] px-5 text-base outline-none",
                    "placeholder:text-black/35 ring-1 ring-black/10 focus:ring-black/25",
                    touched.phone && errors.phone ? "ring-red-500/60 focus:ring-red-500/70" : "",
                  ].join(" ")}
                  placeholder="טלפון"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  onBlur={() => markTouched("phone")}
                  disabled={isSubmitting}
                />
                {touched.phone && errors.phone ? <p className="mt-2 text-sm text-red-600">{errors.phone}</p> : null}
              </div>

              {/* דוא"ל */}
              <div>
                <input
                  className={[
                    "w-full h-[58px] rounded-3xl bg-black/[0.03] px-5 text-base outline-none",
                    "placeholder:text-black/35 ring-1 ring-black/10 focus:ring-black/25",
                    "text-left",
                    touched.email && errors.email ? "ring-red-500/60 focus:ring-red-500/70" : "",
                  ].join(" ")}
                  placeholder="דוא״ל"
                  inputMode="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={() => markTouched("email")}
                  disabled={isSubmitting}
                />
                {touched.email && errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
              </div>
            </div>

            {/* הודעה גדולה */}
            <div className="mt-4">
              <textarea
                className={[
                  "w-full min-h-[190px] sm:min-h-[240px] resize-y rounded-3xl",
                  "bg-black/[0.03] px-5 py-4 text-base outline-none",
                  "placeholder:text-black/35 ring-1 ring-black/10 focus:ring-black/25",
                  touched.message && errors.message ? "ring-red-500/60 focus:ring-red-500/70" : "",
                ].join(" ")}
                placeholder="הודעה"
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                onBlur={() => markTouched("message")}
                disabled={isSubmitting}
              />
              {touched.message && errors.message ? <p className="mt-2 text-sm text-red-600">{errors.message}</p> : null}
            </div>

            {/* צ'קבוקס + כפתור זהב */}
            <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className={[
                  "w-full sm:w-[560px] rounded-full py-4 text-lg font-bold",
                  "transition-transform active:scale-[0.99]",
                  "text-white",
                  "shadow-[0_18px_45px_-25px_rgba(0,0,0,0.35)]",
                  "bg-gradient-to-r from-[#d6b061] via-[#e4c27a] to-[#cfa55a]",
                  "hover:brightness-[1.02]",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                {isSubmitting ? "שולח..." : "שליחה  »"}
              </button>

              <label className="flex items-center gap-3 select-none">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setField("consent", e.target.checked)}
                  onBlur={() => markTouched("consent")}
                  className="h-5 w-5 accent-red-600"
                  disabled={isSubmitting}
                />
                <span className="text-sm sm:text-base font-semibold text-black/70">מאשר קבלת מידע פרסומי שיווקי</span>
              </label>
            </div>

            {touched.consent && errors.consent ? <p className="mt-2 text-sm text-red-600">{errors.consent}</p> : null}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
