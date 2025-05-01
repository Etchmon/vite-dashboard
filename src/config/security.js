// Security configuration for the application
export const securityConfig = {
  // Content Security Policy (CSP) configuration
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.coingecko.com"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },

  // Security headers
  headers: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  // API security
  api: {
    // Maximum number of concurrent API requests
    maxConcurrentRequests: 5,
    // Timeout for API requests (in milliseconds)
    timeout: 10000,
    // Retry configuration for failed requests
    retry: {
      attempts: 3,
      delay: 1000,
    },
  },

  // Input validation
  validation: {
    // Maximum length for coin IDs
    maxCoinIdLength: 50,
    // Allowed characters in coin IDs
    allowedCoinIdChars: /^[a-zA-Z0-9-]+$/,
  },
};
