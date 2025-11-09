/**
 * Global error handling middleware
 * Converts all thrown errors into consistent JSON responses
 */
export function errorHandler(err, req, res, next) {
  // Default error status and message
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || "Internal Server Error";

  // Detect validation errors or known issues
  if (
    message.includes("required") ||
    message.includes("invalid") ||
    message.includes("Invalid") ||
    message.includes("must be")
  ) {
    res.status(400);
  }

  // Log detailed error (you can silence in prod)
  console.error(`[ErrorHandler] ${message}`);

  return res.status(res.statusCode || statusCode).json({
    success: false,
    error: message,
  });
}
