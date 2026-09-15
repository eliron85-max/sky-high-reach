import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "eliron.85@gmail.com";

// Logo as Base64 for CID attachment (works in Gmail)
const LOGO_BASE64 = "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";

// Only allow the site's own origins to call this public endpoint
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(www\.)?heights-projects\.com$/,
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/,
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/,
  /^http:\/\/localhost(:\d+)?$/,
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin));
}

function buildCorsHeaders(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? (origin as string) : "null",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}


// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Input validation
function validateInput(data: any): { valid: boolean; error?: string } {
  if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length < 2 || data.fullName.length > 100) {
    return { valid: false, error: 'Invalid name' };
  }
  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 255) {
    return { valid: false, error: 'Invalid email' };
  }
  if (!data.phone || typeof data.phone !== 'string' || data.phone.length < 9 || data.phone.length > 20) {
    return { valid: false, error: 'Invalid phone' };
  }
  if (!data.projectType || typeof data.projectType !== 'string' || data.projectType.length > 50) {
    return { valid: false, error: 'Invalid project type' };
  }
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10 || data.message.length > 2000) {
    return { valid: false, error: 'Invalid message' };
  }
  if (data.company && (typeof data.company !== 'string' || data.company.length > 100)) {
    return { valid: false, error: 'Invalid company' };
  }
  return { valid: true };
}

interface InquiryNotificationRequest {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  message: string;
  preferredDate?: string;
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = buildCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Reject calls that do not come from the site itself
  if (!isAllowedOrigin(origin)) {
    console.log("Blocked request from disallowed origin");
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {

    const requestData = await req.json();
    const {
      fullName,
      email,
      phone,
      company,
      projectType,
      message,
      preferredDate,
      website,
    }: InquiryNotificationRequest & { website?: string } = requestData;

    // Honeypot anti-spam (bots fill hidden fields)
    if (website && String(website).trim().length > 0) {
      console.log("Honeypot triggered - blocking bot");
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Validate all inputs
    const validation = validateInput(requestData);
    if (!validation.valid) {
      console.log("Validation failed:", validation.error);
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Rate limiting - 3 requests per minute per IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const ua = req.headers.get("user-agent") || "unknown";
    const key = `${ip}:${ua}`;

    (globalThis as any).__rl ??= new Map<string, { count: number; ts: number }>();
    const rl = (globalThis as any).__rl as Map<string, { count: number; ts: number }>;

    const now = Date.now();
    const windowMs = 60_000; // 1 minute
    const max = 3; // max 3 requests per minute (stricter)

    const prev = rl.get(key);
    if (!prev || now - prev.ts > windowMs) {
      rl.set(key, { count: 1, ts: now });
    } else {
      prev.count += 1;
      if (prev.count > max) {
        console.log("Rate limit exceeded for:", key);
        return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      rl.set(key, prev);
    }

    console.log("Sending notification for inquiry from:", escapeHtml(fullName));

    // Escape all user input for HTML
    const safeFullName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeCompany = company ? escapeHtml(company) : "";
    const safeProjectType = escapeHtml(projectType);
    const safeMessage = escapeHtml(message);
    const safePreferredDate = preferredDate ? escapeHtml(preferredDate) : "";

    // Send confirmation email to customer
    const customerEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Heights Solutions <noreply@heights-projects.com>",
        to: [email],
        reply_to: ADMIN_EMAIL,
        subject: "תודה על פנייתך - Heights Solutions",
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="cid:heights-logo" width="150" alt="Heights Solutions" style="display: inline-block;" />
            </div>
            <h1 style="color: #D4AF37;">שלום ${safeFullName}!</h1>
            <p>תודה שפנית אלינו. קיבלנו את הודעתך ונחזור אליך בהקדם.</p>
            
            <h3>פרטי הפנייה:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>סוג הפרויקט:</strong> ${safeProjectType}</li>
              ${safeCompany ? `<li><strong>חברה:</strong> ${safeCompany}</li>` : ""}
              ${safePreferredDate ? `<li><strong>תאריך מבוקש:</strong> ${safePreferredDate}</li>` : ""}
              <li><strong>טלפון:</strong> ${safePhone}</li>
            </ul>
            
            <p><strong>ההודעה שלך:</strong></p>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${safeMessage}</p>
            
            <p style="margin-top: 30px;">בברכה,<br>צוות Heights Solutions</p>
          </div>
        `,
        attachments: [
          {
            filename: "logo.png",
            content: LOGO_BASE64,
            contentType: "image/png",
            contentId: "heights-logo",
          }
        ],
      }),
    });


    const customerResText = await customerEmailRes.text();
    console.log("Customer Resend response:", customerResText);

    if (!customerEmailRes.ok) {
      console.error("Customer email error:", customerResText);
      // Don't throw - continue to send admin email
      // This allows the form to work even in Resend test mode
    } else {
      console.log("Customer email sent successfully");
    }

    // Send notification to admin
    const adminEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Heights Solutions <noreply@heights-projects.com>",
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject: `פנייה חדשה מ-${safeFullName}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="cid:heights-logo" width="150" alt="Heights Solutions" style="display: inline-block;" />
            </div>
            <h1 style="color: #D4AF37;">פנייה חדשה התקבלה!</h1>
            
            <h3>פרטי הלקוח:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>שם:</strong> ${safeFullName}</li>
              <li><strong>אימייל:</strong> ${safeEmail}</li>
              <li><strong>טלפון:</strong> ${safePhone}</li>
              ${safeCompany ? `<li><strong>חברה:</strong> ${safeCompany}</li>` : ""}
              <li><strong>סוג פרויקט:</strong> ${safeProjectType}</li>
              ${safePreferredDate ? `<li><strong>תאריך מבוקש:</strong> ${safePreferredDate}</li>` : ""}
            </ul>
            
            <p><strong>הודעה:</strong></p>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${safeMessage}</p>
            
            <p style="margin-top: 20px;">
              <a href="mailto:${safeEmail}" style="background: #D4AF37; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">השב ללקוח</a>
              <a href="tel:${safePhone}" style="background: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">התקשר</a>
            </p>
          </div>
        `,
        attachments: [
          {
            filename: "logo.png",
            content: LOGO_BASE64,
            contentType: "image/png",
            contentId: "heights-logo",
          }
        ],
      }),
    });

    const adminResText = await adminEmailRes.text();
    console.log("Admin Resend response:", adminResText);

    if (!adminEmailRes.ok) {
      console.error("Admin email error:", adminResText);
      // Don't throw - customer email was sent successfully
    } else {
      console.log("Admin email sent successfully");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending inquiry notification:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
