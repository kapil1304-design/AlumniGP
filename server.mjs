import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import net from "node:net";
import tls from "node:tls";
import { randomInt, randomUUID } from "node:crypto";
import { extname, join, normalize } from "node:path";

loadDotEnv();

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const otpTtlMs = 10 * 60 * 1000;
const otpStore = new Map();
const sendWindowStore = new Map();

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
};

function loadDotEnv() {
  const path = join(process.cwd(), ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkSendRate(email) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const attempts = (sendWindowStore.get(email) || []).filter((time) => now - time < windowMs);
  if (attempts.length >= 5) return false;
  attempts.push(now);
  sendWindowStore.set(email, attempts);
  return true;
}

function smtpRead(socket) {
  return new Promise((resolve, reject) => {
    let data = "";
    const onData = (chunk) => {
      data += chunk.toString("utf8");
      const lines = data.split(/\r?\n/).filter(Boolean);
      const last = lines.at(-1);
      if (last && /^\d{3} /.test(last)) {
        socket.off("data", onData);
        resolve(data);
      }
    };
    socket.on("data", onData);
    socket.once("error", reject);
  });
}

async function smtpCommand(socket, command, expected) {
  socket.write(`${command}\r\n`);
  const response = await smtpRead(socket);
  const code = Number(response.slice(0, 3));
  if (!expected.includes(code)) {
    throw new Error(`SMTP command failed with ${code}`);
  }
  return response;
}

function smtpConnect(hostName, portNumber) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(portNumber, hostName, () => resolve(socket));
    socket.once("error", reject);
  });
}

function startTls(socket, hostName) {
  return new Promise((resolve, reject) => {
    const secure = tls.connect({ socket, servername: hostName }, () => resolve(secure));
    secure.once("error", reject);
  });
}

function encodeLogin(value) {
  return Buffer.from(value, "utf8").toString("base64");
}

function dotStuff(message) {
  return message.replace(/^\./gm, "..");
}

async function sendMail({ to, subject, text }) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM;

  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
    throw new Error("SMTP is not configured");
  }

  let socket = await smtpConnect(smtpHost, smtpPort);
  await smtpRead(socket);
  await smtpCommand(socket, "EHLO alumnigp.com", [250]);
  await smtpCommand(socket, "STARTTLS", [220]);
  socket = await startTls(socket, smtpHost);
  await smtpCommand(socket, "EHLO alumnigp.com", [250]);
  await smtpCommand(socket, "AUTH LOGIN", [334]);
  await smtpCommand(socket, encodeLogin(smtpUser), [334]);
  await smtpCommand(socket, encodeLogin(smtpPass), [235]);
  await smtpCommand(socket, `MAIL FROM:<${extractEmail(smtpFrom)}>`, [250]);
  await smtpCommand(socket, `RCPT TO:<${to}>`, [250, 251]);
  await smtpCommand(socket, "DATA", [354]);

  const message = [
    `From: ${smtpFrom}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    `Message-ID: <${randomUUID()}@alumnigp.com>`,
    "",
    text,
  ].join("\r\n");

  socket.write(`${dotStuff(message)}\r\n.\r\n`);
  await smtpRead(socket);
  await smtpCommand(socket, "QUIT", [221]);
  socket.end();
}

function extractEmail(from) {
  return from.match(/<([^>]+)>/)?.[1] || from;
}

async function handleSendOtp(req, res) {
  const { email } = await readJson(req);
  const normalizedEmail = normalizeEmail(email);
  if (!isValidEmail(normalizedEmail)) return json(res, 400, { ok: false, error: "Invalid email" });
  if (!checkSendRate(normalizedEmail)) return json(res, 429, { ok: false, error: "Too many OTP requests. Try again later." });

  const otp = String(randomInt(100000, 999999));
  otpStore.set(normalizedEmail, {
    otp,
    expiresAt: Date.now() + otpTtlMs,
    attempts: 0,
  });

  await sendMail({
    to: normalizedEmail,
    subject: "Your AlumniGP login OTP",
    text: `Your AlumniGP login OTP is ${otp}.\n\nThis code expires in 10 minutes. If you did not request it, you can ignore this email.`,
  });

  return json(res, 200, { ok: true });
}

async function handleVerifyOtp(req, res) {
  const { email, otp } = await readJson(req);
  const normalizedEmail = normalizeEmail(email);
  const record = otpStore.get(normalizedEmail);
  if (!record) return json(res, 400, { ok: false, error: "OTP not found. Request a new code." });
  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return json(res, 400, { ok: false, error: "OTP expired. Request a new code." });
  }
  if (record.attempts >= 5) {
    otpStore.delete(normalizedEmail);
    return json(res, 429, { ok: false, error: "Too many wrong attempts. Request a new code." });
  }
  record.attempts += 1;
  if (String(otp).trim() !== record.otp) return json(res, 400, { ok: false, error: "Wrong OTP" });
  otpStore.delete(normalizedEmail);
  return json(res, 200, { ok: true, email: normalizedEmail });
}

async function handleApi(req, res, url) {
  try {
    if (req.method === "POST" && url.pathname === "/api/auth/send-otp") return await handleSendOtp(req, res);
    if (req.method === "POST" && url.pathname === "/api/auth/verify-otp") return await handleVerifyOtp(req, res);
    return json(res, 404, { ok: false, error: "Not found" });
  } catch (error) {
    console.error(error);
    return json(res, 500, { ok: false, error: "Server error" });
  }
}

createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${host}:${port}`);
  if (url.pathname.startsWith("/api/")) {
    handleApi(req, res, url);
    return;
  }

  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = normalize(join(root, requested));

  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  res.writeHead(200, { "content-type": types[extname(filePath)] || "application/octet-stream" });
  createReadStream(filePath).pipe(res);
}).listen(port, host, () => {
  console.log(`AlumniGP running at http://${host}:${port}/`);
});
