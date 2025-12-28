// src/consumers/agentConsumer.js
import "dotenv/config";
import { redis } from "../redis.js";
import { v4 as uuid } from "uuid";
import { sendWhatsappViaAT } from "../providers/atWhatsApp.js";

async function consume() {
  const msisdn = process.env.TEST_MSISDN || "+2348012345678"; // change per test
  const inStream  = `session:${msisdn}:wa_queue`;
  const outStream = `session:${msisdn}:agent_out`;

  console.log("👂 Agent consumer started…");
  console.log("🔭 Listening on stream:", inStream);

  // start from the latest item; change "$" to "0" if you want historic
  let lastId = "$";

  while (true) {
    try {
      const streams = await redis.xread(
        "BLOCK", 10000,
        "STREAMS",
        inStream,
        lastId
      );

      if (!streams) continue;

      const [name, events] = streams[0];
      for (const [id, kv] of events) {
        lastId = id;

        const payloadStr = kv[1] || "{}";
        let event = {};
        try { event = JSON.parse(payloadStr); } catch {}

        // Basic “AI” reply (replace with real LLM/Vapi call)
        const replyText = buildSimpleReply(event);

        const reply = {
          id: uuid(),
          ts: Date.now(),
          kind: "agent_reply",
          to: event.from,
          text: replyText,
          in_reply_to: event.id,
        };

        // 1) Enqueue to outbox for Vapi/UI
        await redis.xadd(outStream, "*", "event", JSON.stringify(reply));
        await redis.xtrim(outStream, "MAXLEN", "~", 500);

        console.log("🤖 Agent reply queued:", { to: reply.to, text: reply.text });

        // 2) (Optional) Send back to WhatsApp immediately via AT
        // Comment this out until you confirm AT send endpoint + payload
        if (process.env.ENABLE_AT_SEND === "true") {
          const sent = await sendWhatsappViaAT({ to: reply.to, text: reply.text });
          if (!sent.ok) {
            console.error("AT send failed:", sent.error);
          } else {
            console.log("AT send OK id:", sent.providerId || "(none)");
          }
        }
      }
    } catch (err) {
      console.error("Consumer error:", err.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

function buildSimpleReply(event) {
  const base = event.text?.trim() ? `You said: "${event.text.trim()}"` : "Received your message.";
  const mediaNote = event.attachment ? ` (and I see a ${event.attachment.mediaType})` : "";
  return `${base}${mediaNote} — ${new Date().toLocaleString()}`;
}

consume();
