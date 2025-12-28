// index.js (project root)

// 1) Load env first so everyone sees .env
import "dotenv/config";

// 2) Initialize Redis (prints URL + connect logs)
import { redis } from "./src/redis.js";

// 3) Core server deps
import express from "express";
import bodyParser from "body-parser";

// 4) Routers (ensure these files exist with these names)
import waWebhookRouter from "./src/routes/wawebhook.js";     // POST /wa/webhook
import waInboxRouter   from "./src/routes/wainbox.js";       // GET  /wa/inbox
import waOutboxRouter  from "./src/routes/waOutbox.js";      // GET  /wa/outbox
import debugRouter     from "./src/routes/debug.js";         // GET  /debug/*
import vapiEvents      from "./src/routes/vapiEvents.js";    // POST /vapi/events

// 5) Create app + middleware
const app = express();
app.use(bodyParser.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "25mb" }));

// Optional: if you’ll hit this from a browser/another domain, enable CORS
// import cors from "cors";
// app.use(cors());

// 6) Basic health
app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

// 7) Mount routes
app.use("/wa/webhook", waWebhookRouter);
app.use("/wa/inbox",   waInboxRouter);
app.use("/wa/outbox",  waOutboxRouter);
app.use("/debug",      debugRouter);
app.use("/vapi/events", vapiEvents);

// 8) 404 fallback (safe on Express 4/5)
app.use((req, res) => {
  res.status(404).send(`Not found: ${req.method} ${req.path}`);
});

// 9) Start server
const port = process.env.PORT || 3000;
console.log("Loading routes: /health, /wa/webhook, /wa/inbox, /wa/outbox, /debug, /vapi/events");
app.listen(port, () => console.log(`Server listening on ${port}`));
