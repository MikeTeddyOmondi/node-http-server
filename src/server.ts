import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";

import { ResponseError, createError, logger } from "./utils/index.js";
import { NODE_ENV } from "./config.js";
import router from "./routes/index.js";

config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Root route
app.get("/", (req, res, next) => {
  logger.info({ success: true, message: "Application works!" });
  res.json({ success: true, message: "Application works!" });
});

app.use("/api/v1", router)

// 404 route
app.get("*", (req, res, next) => {
  logger.error("Resource not found!");
  next(createError(500, `Resource not found!`));
});

// Error Middleware
app.use(
  (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
      success: false,
      data: {
        message: errorMessage,
      },
      stack: NODE_ENV === "production" ? {} : err.stack,
    });
  }
);

const port = 3000;

// Start HTTP Server
(async function main() {
  const PORT = process.env.PORT || 3489;

  app.listen(PORT, () => {
    console.log(`Server listening for requests: http://localhost:${PORT}`);
  });
})()

