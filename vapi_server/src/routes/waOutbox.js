// src/routes/waoutbox.js
import express from "express";
import { redis, streamRange } from "../redis.js";

const router = express.Router();

/**
 * Vapi/UI polls for agent replies here.
 * GET /wa/outbox?msisdn=+234...
 */
router.get("/", async (req, res) => {
  const msisdn = (req.query.msisdn || "").trim();
  if (!msisdn) return res.status(400).json({ ok: false, error: "msisdn required" });

  const key = `session:${msisdn}:agent_out`;
  const entries = await streamRange(key, "-", "+", 200);

  const items = entries.map(([id, kv]) => {
    let ev = {};
    try { ev = JSON.parse(kv[1]); } catch {}
    return { id, ...ev };
  });

  res.json({ ok: true, msisdn, items, last_id: items.at(-1)?.id || "-" });
});

export default router;
