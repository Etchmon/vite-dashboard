import { securityConfig } from "../config/security";

// Store request timestamps for rate limiting
let requestTimestamps = [];

// Security middleware for the application
export const securityMiddleware = (req, res, next) => {
  // Set security headers
  Object.entries(securityConfig.headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Set Content Security Policy
  const cspHeader = Object.entries(securityConfig.csp)
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
  res.setHeader("Content-Security-Policy", cspHeader);

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Enable HSTS (HTTP Strict Transport Security)
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  next();
};

// Rate limiting middleware
export const rateLimitMiddleware = (req, res, next) => {
  const now = Date.now();
  const windowMs = securityConfig.rateLimit.windowMs;
  const max = securityConfig.rateLimit.max;

  // Clean up old entries
  const cutoff = now - windowMs;
  requestTimestamps = requestTimestamps.filter(
    (timestamp) => timestamp > cutoff
  );

  // Check if the IP has exceeded the rate limit
  const ipRequests = requestTimestamps.filter(
    (timestamp) => timestamp > cutoff
  );
  if (ipRequests.length >= max) {
    res.status(429).json({
      error: "Too many requests",
      message: "Please try again later",
      retryAfter: Math.ceil((ipRequests[0] + windowMs - now) / 1000),
    });
    return;
  }

  // Add the current request timestamp
  requestTimestamps.push(now);
  next();
};

// Input sanitization middleware
export const sanitizeInput = (req, res, next) => {
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      req.query[key] = req.query[key].replace(/[<>]/g, "");
    });
  }

  // Sanitize URL parameters
  if (req.params) {
    Object.keys(req.params).forEach((key) => {
      req.params[key] = req.params[key].replace(/[<>]/g, "");
    });
  }

  next();
};
