// src/components/Contact.tsx
import { useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { supabaseUntyped } from "@/lib/supabaseHelpers";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

type MiniForm = {
  fullName: string;
  phone: string;
  whatsapp: string;
  message: string;
  consent: boolean;
};

export default function Contact() {
  const { toast } = useToast();
  const { t, dir } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<MiniForm>({
    fullName: "",
    phone: "",
    whatsapp: "",
    message: "",
    consent: true,
  });

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "חובה למלא שם";
    if (!form.phone.trim()) e.phone = "חובה למלא טלפון";
    if (!form.whatsapp.trim()) e.whatsapp = "חובה למלא וואטסאפ";
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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      phone: true,
      whatsapp: true,
      message: true,
      consent: true,
    });

    if (!isValid) return;

    setIsSubmitting(true);
    try {
      // 1) שמירה ל-DB (אם email אצלך NOT NULL -> אנחנו שמים pseudoEmail)
      const pseudoEmail = `${form.whatsapp.trim()}@whatsapp.local`;

      const { error: dbError } = await supabaseUntyped.from("inquiries").insert({
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        email: pseudoEmail,
        message: form.message.trim(),
        company: null,
        project_type: "other",
        preferred_date: null,
      });

      if (dbError) throw dbError;

      // 2) שליחת מייל דרך Edge Function (חובה body)
      const { error: fnError } = await supabaseUntyped.functions.invoke("resend-email", {
        body: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          whatsapp: form.whatsapp.trim(),
          message: form.message.trim(),
        },
      });

      if (fnError) throw fnError;

      toast({
        title: t?.("contact.form.successTitle") ?? "נשלח ✅",
        description: t?.("contact.form.successMessage") ?? "קיבלנו את הפנייה ונחזור בהקדם.",
      });

      setForm({
        fullName: "",
        phone: "",
        whatsapp: "",
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
    <section id="contact" dir={dir} className="bg-[#f3f3f3] text-black py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative bg-white border border-black/30 px-5 sm:px-10 py-10 sm:py-14">
          <div className="pointer-events-none absolute -top-[1px] left-10 h-[1px] w-44 bg-black/30" />
          <div className="pointer-events-none absolute -top-[1px] right-10 h-[1px] w-44 bg-black/30" />
          <div className="pointer-events-none absolute top-10 -left-[1px] h-40 w-[1px] bg-black/30" />
          <div className="pointer-events-none absolute top-10 -right-[1px] h-40 w-[1px] bg-black/30" />

          <h1 className="text-center font-extrabold tracking-tight leading-[0.95] text-[44px] sm:text-[76px] lg:text-[96px]">
            א.א פרויקטים וגובה
          </h1>

          <p className="mt-4 text-center text-base sm:text-lg text-black/70">
            מלאו את הפרטים כדי ליצור איתנו קשר ונחזור אליכם בהקדם
          </p>

          <form onSubmit={onSubmit} className="mt-10 sm:mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <input
                  className={[
                    "w-full h-[58px] rounded-3xl bg-black/[0.03] px-5 text-base outline-none",
                    "placeholder:text-black/45 ring-1 ring-black/10 focus:ring-black/25",
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

              <div>
                <input
                  className={[
                    "w-full h-[58px] rounded-3xl bg-black/[0.03] px-5 text-base outline-none",
                    "placeholder:text-black/45 ring-1 ring-black/10 focus:ring-black/25",
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

              <div>
                <input
                  className={[
                    "w-full h-[58px] rounded-3xl bg-black/[0.03] px-5 text-base outline-none",
                    "placeholder:text-black/45 ring-1 ring-black/10 focus:ring-black/25",
                    touched.whatsapp && errors.whatsapp ? "ring-red-500/60 focus:ring-red-500/70" : "",
                  ].join(" ")}
                  placeholder="וואטסאפ"
                  inputMode="tel"
                  value={form.whatsapp}
                  onChange={(e) => setField("whatsapp", e.target.value)}
                  onBlur={() => markTouched("whatsapp")}
                  disabled={isSubmitting}
                />
                {touched.whatsapp && errors.whatsapp ? (
                  <p className="mt-2 text-sm text-red-600">{errors.whatsapp}</p>
                ) : null}
              </div>
            </div>

            <div className="mt-6 relative">
              <span className="absolute right-6 top-4 text-black/45 font-semibold pointer-events-none">הודעה</span>

              <textarea
                className={[
                  "w-full min-h-[210px] sm:min-h-[260px] resize-y rounded-3xl",
                  "bg-black/[0.03] px-5 pt-12 pb-5 text-base outline-none",
                  "placeholder:text-black/35 ring-1 ring-black/10 focus:ring-black/25",
                  touched.message && errors.message ? "ring-red-500/60 focus:ring-red-500/70" : "",
                ].join(" ")}
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                onBlur={() => markTouched("message")}
                disabled={isSubmitting}
              />
              {touched.message && errors.message ? <p className="mt-2 text-sm text-red-600">{errors.message}</p> : null}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className={[
                  "w-full sm:w-[640px] rounded-full py-4 text-lg font-bold",
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
                <span className="text-sm sm:text-base font-semibold text-black/80">מאשר קבלת מידע פרסומי שיווקי</span>
              </label>
            </div>

            {touched.consent && errors.consent ? <p className="mt-2 text-sm text-red-600">{errors.consent}</p> : null}
          </form>
        </div>
      </div>
    </section>
  );
}
