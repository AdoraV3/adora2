// src/routes/vapiEvents.js
import express from "express";
import { v4 as uuid } from "uuid";
import { redis, streamAdd } from "../redis.js";

const router = express.Router();

/**
 * Vapi -> Your App
 * This endpoint will receive all call lifecycle events.
 */
router.post("/", async (req, res) => {
  try {
    const event = req.body || {};
    const callId = event.call_id || event.callId || uuid();
    const type = event.type || "unknown";

    console.log("📞 Vapi event received:", { type, callId });

    // Save into Redis stream
    const streamKey = `call:${callId}:events`;
    await streamAdd(streamKey, event);
    await redis.xtrim(streamKey, "MAXLEN", "~", 1000);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ Error handling Vapi event:", err);
    // Still reply 200 so Vapi doesn’t retry forever
    res.status(200).json({ ok: false });
  }
});

export default router;
