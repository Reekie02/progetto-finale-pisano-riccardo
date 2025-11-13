// /supabase/functions/contact/index.ts
// Edge Function (Deno) – invio email via Resend REST + CORS

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function escapeHtml(str: string = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const TO = Deno.env.get("RESEND_TO") ?? "riccardopisano02@gmail.com";
    const FROM = Deno.env.get("RESEND_FROM") ?? "onboarding@resend.dev";

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ ok: false, error: "Missing RESEND_API_KEY" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const html = `
  <div style="
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont;
    background: #0f1318;
    padding: 32px;
    color: #e5e7eb;
  ">
    <div style="
      max-width: 600px;
      margin: 0 auto;
      background: #1a1f24;
      padding: 24px 32px;
      border-radius: 12px;
      border: 1px solid #2a3036;
    ">
      
      <!-- Header -->
      <h1 style="margin: 0; font-size: 22px; color: #4ade80; text-align:center;">
        📩 Nuovo messaggio da A·KAI
      </h1>
      <p style="margin: 8px 0 24px; text-align:center; font-size: 14px; color: #9ca3af;">
        Hai ricevuto una nuova richiesta tramite il form contatti.
      </p>

      <!-- Box contenuto -->
      <div style="
        background:#111518;
        padding:16px 20px;
        border-radius:10px;
        border:1px solid #272c31;
        margin-bottom:24px;
      ">
        <p style="margin:0 0 6px; font-size:13px; color:#6ee7b7;"><strong>Nome</strong></p>
        <p style="margin:0 0 14px; color:#e5e7eb;">${escapeHtml(name)}</p>

        <p style="margin:0 0 6px; font-size:13px; color:#6ee7b7;"><strong>Email</strong></p>
        <p style="margin:0 0 14px; color:#e5e7eb;">${escapeHtml(email)}</p>

        <p style="margin:0 0 6px; font-size:13px; color:#6ee7b7;"><strong>Oggetto</strong></p>
        <p style="margin:0 0 14px; color:#e5e7eb;">${escapeHtml(subject)}</p>

        <p style="margin:0 0 6px; font-size:13px; color:#6ee7b7;"><strong>Messaggio</strong></p>
        <div style="
          white-space:pre-wrap;
          background:#1f262d;
          padding:14px;
          border-radius:8px;
          border:1px solid #2e353c;
          color:#ffffff;
          font-size:14px;
        ">
          ${escapeHtml(message)}
        </div>
      </div>

      <!-- Footer -->
      <p style="font-size:12px; text-align:center; color:#6b7280;">
        Questo messaggio è stato generato automaticamente da A·KAI.<br/>
        Per assistenza rispondi direttamente a questa email.
      </p>
    </div>
  </div>
`;

    // Chiamata REST a Resend (niente SDK Node)
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        subject: `[Contact] ${subject} — ${name}`,
        html,
        reply_to: email,
      }),
    });

    if (!r.ok) {
      const body = await r.text();
      return new Response(JSON.stringify({ ok: false, error: body || `Resend ${r.status}` }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("Contact error:", err);
    return new Response(JSON.stringify({ ok: false, error: err?.message || "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});