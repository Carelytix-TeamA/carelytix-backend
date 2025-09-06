import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import cookiParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookiParser());
app.set("trust proxy", 1);

// Apply rate-limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 1000 : 100),
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: (req, res) => ipKeyGenerator(req.ip as string),
});

app.use(limiter);

app.get("/api/v1/gateway-health", (req, res) => {
  res.send({ message: "Welcome to api-gateway!" });
});

app.use(
  "/api/v1/auth",
  proxy("http://localhost:6001", {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Forward cookies & headers
      proxyReqOpts.headers = {
        ...srcReq.headers,
      };
      return proxyReqOpts;
    },
  })
);
app.use(
  "/api/v1/user",
  proxy("http://localhost:6002", {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Forward cookies & headers
      proxyReqOpts.headers = {
        ...srcReq.headers,
      };
      return proxyReqOpts;
    },
  })
);
app.use("/api/v1/admin", proxy("http://localhost:6003"));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
