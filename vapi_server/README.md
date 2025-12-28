# Adora WhatsApp Voice Bridge

A Node.js/Express service that:
- Receives WhatsApp messages via Africa’s Talking.
- Queues them in Redis (Upstash).
- Stores attachments in S3.
- Lets agents/AI consumers process and reply.

## Running locally
```bash
npm install
npm run dev
