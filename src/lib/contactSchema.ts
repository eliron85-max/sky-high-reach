import { z } from "zod";

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "שם חייב להכיל לפחות 2 תווים")
    .max(100, "שם לא יכול לעלות על 100 תווים"),
  email: z
    .string()
    .trim()
    .email("כתובת אימייל לא תקינה")
    .max(255, "אימייל לא יכול לעלות על 255 תווים"),
  phone: z
    .string()
    .trim()
    .min(9, "מספר טלפון חייב להכיל לפחות 9 ספרות")
    .max(20, "מספר טלפון לא יכול לעלות על 20 ספרות")
    .regex(/^[\d\-\+\(\)\s]+$/, "מספר טלפון לא תקין"),
  company: z.string().max(100, "שם חברה לא יכול לעלות על 100 תווים").optional().or(z.literal("")),
  projectType: z.string().min(1, "יש לבחור סוג פרויקט"),
  message: z
    .string()
    .trim()
    .min(10, "הודעה חייבת להכיל לפחות 10 תווים")
    .max(2000, "הודעה לא יכולה לעלות על 2000 תווים"),
  preferredDate: z.date().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
