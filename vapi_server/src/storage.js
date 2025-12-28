// src/storage.js
import fetch from "node-fetch";
import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import path from "path";

const bucket = process.env.S3_BUCKET || "";
const region = process.env.AWS_REGION || "us-east-1";
const hasAwsCreds = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && bucket);

let s3 = null;
if (hasAwsCreds) {
  s3 = new AWS.S3({
    region,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  console.log("DEBUG → S3 enabled with public-read uploads");
} else {
  console.log("DEBUG → S3 disabled (missing env or bucket). Using passthrough URLs.");
}

export async function maybeUploadToS3(mediaUrl, { contentTypeHint = "application/octet-stream" } = {}) {
  if (!mediaUrl) throw new Error("No mediaUrl provided");

  if (!s3) {
    return { storedUrl: mediaUrl, storage: "passthrough", contentType: contentTypeHint };
  }

  const res = await fetch(mediaUrl);
  if (!res.ok) throw new Error(`Failed to download media: ${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const remoteCT = res.headers.get("content-type") || "";
  const contentType = remoteCT || contentTypeHint;

  const safeUrl = mediaUrl.split("?")[0];
  const ext = path.extname(safeUrl) || "";
  const key = `wa/${uuid()}${ext}`;

  await s3
    .putObject({
      Bucket: bucket,
      Key: key,
      Body: buf,
      ContentType: contentType,
      ACL: "public-read", // ✅ permanent public URL
    })
    .promise();

  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  return { storedUrl: publicUrl, storage: "s3-public", contentType, key };
}
