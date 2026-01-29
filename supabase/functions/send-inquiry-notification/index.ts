import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "eliron.85@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Input validation - updated for new form fields
function validateInput(data: any): { valid: boolean; error?: string } {
  if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length < 2 || data.fullName.length > 100) {
    return { valid: false, error: 'Invalid name: must be 2-100 characters' };
  }
  if (!data.phone || typeof data.phone !== 'string' || data.phone.length < 9 || data.phone.length > 20) {
    return { valid: false, error: 'Invalid phone: must be 9-20 characters' };
  }
  if (!data.whatsapp || typeof data.whatsapp !== 'string' || data.whatsapp.length < 9 || data.whatsapp.length > 20) {
    return { valid: false, error: 'Invalid whatsapp: must be 9-20 characters' };
  }
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 3 || data.message.length > 2000) {
    return { valid: false, error: 'Invalid message: must be 3-2000 characters' };
  }
  return { valid: true };
}

interface InquiryNotificationRequest {
  fullName: string;
  phone: string;
  whatsapp: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send inquiry notification");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { fullName, phone, whatsapp, message, website }: InquiryNotificationRequest & { website?: string } = requestData;

    console.log("Received inquiry data:", { 
      fullName, 
      phone, 
      whatsapp,
      messageLength: message?.length 
    });

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
    const max = 3; // max 3 requests per minute

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
    const safePhone = escapeHtml(phone);
    const safeWhatsapp = escapeHtml(whatsapp);
    const safeMessage = escapeHtml(message);

    // Clean WhatsApp number for link (remove non-digits except leading +)
    const cleanWhatsapp = whatsapp.replace(/[^0-9+]/g, '').replace(/^\+/, '');

    // Send notification email to admin only
    const adminEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "א.א פרויקטים וגובה <noreply@heights-projects.com>",
        to: [ADMIN_EMAIL],
        subject: `📩 פנייה חדשה מ-${safeFullName}`,
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="he">
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f5f5f5; padding: 20px; margin: 0; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #333; border-bottom: 2px solid #d6b061; padding-bottom: 15px; margin-top: 0; }
              .field { margin: 15px 0; padding: 12px; background: #f9f9f9; border-radius: 8px; }
              .label { font-weight: bold; color: #666; margin-bottom: 5px; }
              .value { color: #333; font-size: 16px; }
              .message-box { background: #fff8e7; border: 1px solid #d6b061; border-radius: 8px; padding: 15px; margin-top: 20px; }
              .actions { margin-top: 25px; display: flex; gap: 10px; flex-wrap: wrap; }
              .btn { display: inline-block; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 14px; }
              .btn-whatsapp { background: #25D366; color: white; }
              .btn-phone { background: #333; color: white; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>📩 פנייה חדשה מהאתר</h1>
              
              <div class="field">
                <div class="label">שם מלא:</div>
                <div class="value">${safeFullName}</div>
              </div>
              
              <div class="field">
                <div class="label">טלפון:</div>
                <div class="value"><a href="tel:${safePhone}" style="color: #333;">${safePhone}</a></div>
              </div>
              
              <div class="field">
                <div class="label">וואטסאפ:</div>
                <div class="value">${safeWhatsapp}</div>
              </div>
              
              <div class="message-box">
                <div class="label">הודעה:</div>
                <div class="value">${safeMessage.replace(/\n/g, '<br>')}</div>
              </div>
              
              <div class="actions">
                <a href="https://wa.me/${cleanWhatsapp}" class="btn btn-whatsapp">💬 פתח WhatsApp</a>
                <a href="tel:${safePhone}" class="btn btn-phone">📞 התקשר</a>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const adminResText = await adminEmailRes.text();
    console.log("Admin Resend response:", adminResText);

    if (!adminEmailRes.ok) {
      console.error("Admin email error:", adminResText);
      throw new Error(`Failed to send admin email: ${adminResText}`);
    }

    console.log("Admin email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending inquiry notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
