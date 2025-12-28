// src/routes/debug.js
import express from "express";
import { redis } from "../redis.js";
import { maybeUploadToS3 } from "../storage.js";

const router = express.Router();

router.get("/ping", async (_req, res) => {
  try {
    const pong = await redis.ping();
    res.json({ ok: true, pong });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

router.get("/env", (_req, res) => {
  res.json({
    ok: true,
    S3_BUCKET: !!process.env.S3_BUCKET,
    AWS_REGION: process.env.AWS_REGION || null,
    AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
  });
});

router.get("/s3test", async (_req, res) => {
  try {
    const testUrl = "https://httpbin.org/image/png";
    const uploaded = await maybeUploadToS3(testUrl, { contentTypeHint: "image/png" });
    res.json({ ok: true, uploaded });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;
