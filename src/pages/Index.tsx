import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

// ❗שנה למייל שלך (לאן אתה רוצה לקבל פניות)
const BUSINESS_TO_EMAIL = "eliron.85@gmail.com";

// ❗חייב להיות From מאומת ב-Resend
// אם אין לך דומיין מאומת עדיין, אפשר זמנית:
// "onboarding@resend.dev" (אם Resend מאפשר אצלך), אחרת תשים את הכתובת המאומתת שלך
const FROM_EMAIL = "onboarding@resend.dev";

Deno.serve(async (req) => {
  try {
    // CORS (כדי שלא יחסום מהאתר)
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        },
      });
    }

    const body = await req.json();

    const fullName = String(body?.fullName ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const whatsapp = String(body?.whatsapp ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!fullName || !phone || !whatsapp || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const subject = `פנייה חדשה מהאתר - ${fullName}`;
    const html = `
      <div style="font-family:Arial; direction:rtl">
        <h2>פנייה חדשה מהאתר</h2>
        <p><b>שם:</b> ${fullName}</p>
        <p><b>טלפון:</b> ${phone}</p>
        <p><b>וואטסאפ:</b> ${whatsapp}</p>
        <hr />
        <p><b>הודעה:</b></p>
        <p style="white-space:pre-wrap">${message}</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: BUSINESS_TO_EMAIL,
        subject,
        html,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
