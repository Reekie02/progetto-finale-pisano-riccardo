
import { Resend } from "resend";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    try {
        const { name, email, subject, message } = req.body || {};

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ ok: false, error: "Missing fields" });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        const TO = process.env.RESEND_TO || "riccardopisano02@gmail.com";
        const FROM =
            process.env.RESEND_FROM || "onboarding@resend.dev"; // ok per test

        const html = `
      <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.6; color:#0f172a;">
        <h2 style="margin:0 0 8px 0;">Nuovo contatto da A·KAI</h2>
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Oggetto:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Messaggio:</strong></p>
        <pre style="white-space:pre-wrap;background:#f1f5f9;padding:12px;border-radius:8px;">${escapeHtml(
            message
        )}</pre>
      </div>
    `;

        await resend.emails.send({
            from: FROM,
            to: TO,
            subject: `[Contact] ${subject} — ${name}`,
            html,
            reply_to: email,
        });

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error("Contact API error:", err);
        return res
            .status(500)
            .json({ ok: false, error: err?.message || "Internal error" });
    }
}

// piccola utilità per prevenire injection nell'HTML
function escapeHtml(str = "") {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}