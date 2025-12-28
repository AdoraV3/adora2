// src/routes/wawebhook.js
import express from "express";
import { v4 as uuid } from "uuid";
import { redis, streamAdd } from "../redis.js";
import { maybeUploadToS3 } from "../storage.js";

const router = express.Router();

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "audio/ogg",
  "audio/mpeg",
  "audio/amr",
]);

router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const from = (body.from || body.msisdn || "").trim();
    const text = (body.text || body.message || body.caption || "").trim();
    const mediaUrl = body.mediaUrl || body.media_url || null;
    const mediaType = body.mediaType || body.media_type || ""; // e.g. "image/png"

    if (!from) {
      console.warn("WA webhook missing 'from' field:", body);
      return res.status(200).send("OK");
    }

    let attachment = null;

    if (mediaUrl) {
      try {
        if (ALLOWED_TYPES.size && mediaType && !ALLOWED_TYPES.has(mediaType)) {
          console.warn("Blocking unsupported mediaType:", mediaType, "url:", mediaUrl);
        } else {
          const uploaded = await maybeUploadToS3(mediaUrl, {
            contentTypeHint: mediaType || "application/octet-stream",
          });
          attachment = {
            media_id: uuid(),
            url: uploaded.storedUrl,
            storage: uploaded.storage,              // 's3' or 'passthrough'
            mediaType: uploaded.contentType || mediaType || "application/octet-stream",
            originalUrl: mediaUrl,
          };
          console.log("S3 attach OK:", { storage: uploaded.storage, mediaType: attachment.mediaType });
        }
      } catch (err) {
        console.error("Attachment handling failed:", err?.message || err);
      }
    }

    const event = {
      id: uuid(),
      ts: Date.now(),
      kind: "whatsapp_message",
      from,
      text,
      attachment, // null or { media_id, url, storage, mediaType, originalUrl }
    };

    const streamKey = `session:${from}:wa_queue`;
    await streamAdd(streamKey, event);
    await redis.xtrim(streamKey, "MAXLEN", "~", 500);

    console.log("WA inbound queued:", {
      from,
      hasText: !!text,
      hasAttachment: !!attachment,
      mediaType: attachment?.mediaType,
    });

    res.status(200).send("OK");
  } catch (e) {
    console.error("WA webhook error:", e);
    res.status(200).send("OK"); // still 200 so AT doesn't retry forever
  }
});

export default router;
