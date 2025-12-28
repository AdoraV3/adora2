// src/routes/wainbox.js
import express from "express";
import { streamRange } from "../redis.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const msisdn = (req.query.msisdn || req.query.phone || "").trim();
    if (!msisdn) return res.status(400).json({ ok: false, error: "msisdn required" });

    const since = req.query.since || "-";
    const key = `session:${msisdn}:wa_queue`;
    const entries = await streamRange(key, since, "+", 200);

    const items = entries.map(([id, kv]) => {
      const evJson = kv[1];
      let ev = {};
      try { ev = JSON.parse(evJson); } catch {}
      return { id, ...ev };
    });

    res.json({
      ok: true,
      msisdn,
      items,
      last_id: items.length ? items[items.length - 1].id : since,
    });
  } catch (e) {
    console.error("wainbox error:", e);
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

export default router;
