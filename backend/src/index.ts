import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.API_PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple API endpoint
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Sk8Meet API!" });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: {
        message: err.message,
        status: err.status || 500,
      },
    });
  }
);

// Function to start server only if not already running
function startServer() {
  // Only start server if not in test environment
  if (process.env.NODE_ENV !== "test") {
    // Start server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Health check: http://localhost:${port}/health`);
    });
  }
}

startServer();

export { startServer };
export default app;
