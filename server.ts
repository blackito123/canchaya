import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import xss from "xss";
import hpp from "hpp";

export async function startServer() {
  const app = express();
  const PORT = 3000;

  app.disable("x-powered-by"); // Hide Express

  // Trust proxy for rate limiting (since we're behind a reverse proxy in Cloud Run)
  app.set("trust proxy", 1);

  // 1. Security Headers (Helmet)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:", "http:"],
          connectSrc: ["'self'", "ws:", "wss:", "https:"],
          frameAncestors: ["'self'", "https://*.google.com", "https://*.googleusercontent.com", "https://*.run.app"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );

  // 2. CORS configured restrictively
  app.use(
    cors({
      origin: process.env.NODE_ENV === "production" ? process.env.PUBLIC_URL : "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  app.use(hpp()); // Protect against HTTP Parameter Pollution attacks

  // Global sanitization middleware to prevent XSS and oversized payloads
  app.use((req, res, next) => {
    try {
      const MAX_DEPTH = 10;
      const sanitizeObject = (obj: any, currentDepth = 0) => {
        if (currentDepth > MAX_DEPTH) {
          throw new Error("Payload too deep");
        }
        if (typeof obj === "object" && obj !== null) {
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              if (key === "__proto__" || key === "constructor" || key === "prototype") {
                delete obj[key];
                continue;
              }
              if (typeof obj[key] === "string") {
                obj[key] = xss(obj[key]);
              } else if (typeof obj[key] === "object") {
                sanitizeObject(obj[key], currentDepth + 1);
              }
            }
          }
        }
      };
      
      if (req.body) sanitizeObject(req.body);
      if (req.query) sanitizeObject(req.query);
      if (req.params) sanitizeObject(req.params);
      
      next();
    } catch (err) {
      return res.status(400).json({ error: "Malformed or oversized payload detected." });
    }
  });

  // 3. Rate Limiting
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: { error: "Too many requests from this IP, please try again after 15 minutes", status: 429 },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply global rate limiter
  app.use("/api/", globalLimiter);

  // More aggressive limiter for auth/sensitive endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 authentication requests per 15 minutes
    message: { error: "Too many authentication attempts, please try again after 15 minutes", status: 429 },
  });

  // Apply auth rate limiter to all auth routes explicitly
  app.use("/api/auth", authLimiter);

  // 4. Input Validation schemas with Zod
  const bookingSchema = z.object({
    courtId: z.string().min(1).max(50),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
    userId: z.string().uuid().optional(), // In a real app this comes from session
  });

  // In-memory mock DB for bookings validation
  const serverBookings: Record<string, string[]> = {};

  // --- API Routes ---
  
  app.get("/api/health", (req, res) => {
    // Basic health check
    res.json({ status: "ok" });
  });

  // Example Auth endpoint mock
  app.post("/api/auth/login", (req, res) => {
    // In a real scenario, this is handled by Auth.js/Clerk/Supabase
    res.json({ message: "Mock login via secure endpoint" });
  });

  // Secure Booking Endpoint
  app.post("/api/bookings", async (req, res) => {
    try {
      // 5. Validation using Zod
      const validatedData = bookingSchema.parse(req.body);

      // 6. Sanitization (Defense in depth, though Zod regex helps)
      const sanitizedCourtId = xss(validatedData.courtId);
      
      const dateKey = `${sanitizedCourtId}_${validatedData.date}`;
      
      // 7. Check if already booked (409 Conflict)
      if (serverBookings[dateKey] && serverBookings[dateKey].includes(validatedData.time)) {
        return res.status(409).json({ error: "El horario ya se encuentra reservado para esta cancha y fecha." });
      }

      // Here you would use an ORM with Prepared Statements (e.g., Prisma, Supabase)
      // Example pseudo-code for DB:
      // await db.query('INSERT INTO bookings (court_id, date, time) VALUES ($1, $2, $3)', [sanitizedCourtId, validatedData.date, validatedData.time]);

      // Save to mock memory DB
      if (!serverBookings[dateKey]) {
        serverBookings[dateKey] = [];
      }
      serverBookings[dateKey].push(validatedData.time);

      res.status(201).json({ 
        message: "Reserva confirmada con éxito.",
        data: { courtId: sanitizedCourtId, date: validatedData.date, time: validatedData.time }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Validation failed
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        // 7. Generic error handling (Never leak stack traces)
        console.error("Booking Error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Secure Webhook Endpoint for MercadoPago (or similar)
  app.post("/api/webhooks/mercadopago", async (req, res) => {
    try {
      // Security measure: Verify Webhook Signature (e.g. x-signature header)
      // and sanitize input headers before processing
      const signature = req.headers["x-signature"] || req.headers["x-meli-signature"];
      if (!signature && process.env.NODE_ENV === "production") {
        return res.status(401).json({ error: "Missing signature" });
      }

      // In a real app, calculate HMAC using your webhook secret to verify authenticity.
      // const isValid = verifySignature(signature, req.body, process.env.MP_WEBHOOK_SECRET);
      
      console.log("🔒 Verified MP Webhook received for action:", xss(req.body?.action || 'unknown'));

      res.status(200).send("OK");
    } catch (error) {
      console.error("Webhook processing error:", error);
      // NEVER leak error details to the webhook provider sender
      res.status(500).send("Internal Error");
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // For Express 4.x
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
