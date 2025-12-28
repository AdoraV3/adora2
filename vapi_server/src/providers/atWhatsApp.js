// src/providers/atWhatsApp.js
import fetch from "node-fetch";

/**
 * AT WhatsApp sender (stub)
 * Fill in the exact AT endpoint and auth once AT shares them for your account.
 *
 * Required env (add to .env):
 *   AT_USERNAME=your_at_username
 *   AT_API_KEY=your_at_api_key
 *
 * Returns { ok: boolean, providerId?: string, error?: string }
 */
export async function sendWhatsappViaAT({ to, text, mediaUrl = null }) {
  const username = process.env.AT_USERNAME;
  const apiKey = process.env.AT_API_KEY;

  if (!username || !apiKey) {
    console.warn("AT creds missing: set AT_USERNAME and AT_API_KEY in .env");
    return { ok: false, error: "missing_at_credentials" };
    // You can still succeed for local tests by returning {ok:true} here.
  }

  // TODO: Replace with AT’s actual WhatsApp send endpoint + payload shape for your account.
  // The code below is a placeholder. Keep it until AT shares the correct endpoint.
  try {
    const payload = {
      to,
      text,
      mediaUrl, // optional
    };

    // Example placeholder URL — replace with AT’s real WA endpoint when confirmed.
    const url = "https://api.africastalking.com/whatsapp/send"; // <--- replace when you have the real one!

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey,              // AT commonly uses apiKey header
        Accept: "application/json",
      },
      body: JSON.stringify({
        username,           // AT often expects username param
        ...payload,
      }),
    });

    if (!res.ok) {
      const textBody = await res.text().catch(() => "");
      return { ok: false, error: `AT send failed: ${res.status} ${textBody}` };
    }

    const data = await res.json().catch(() => ({}));
    const providerId = data?.messageId || data?.id || null;

    return { ok: true, providerId };
  } catch (err) {
    return { ok: false, error: String(err?.message || err) };
  }
}
