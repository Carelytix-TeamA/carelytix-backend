import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "@carelytix/utils/error-handler";
import dotenv from "dotenv";
import memberRouter from "./routes/member.router.js";
import featureRouter from "./routes/feature.router.js";
import moduleRouter from "./routes/module.router.js";
import planRouter from "./routes/plan.router.js";
import couponRouter from "./routes/coupon.router.js";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/admin-health", (req, res) => {
  res.send({ message: "Welcome to admin-service!" });
});

app.use("/member", memberRouter);
app.use("/feature", featureRouter);
app.use("/module", moduleRouter);
app.use("/plan", planRouter);
app.use("/coupon", couponRouter);

app.use(errorMiddleware);
const port = process.env.PORT ? Number(process.env.PORT) : 6003;
const server = app.listen(port, () => {
  console.log(`Admin service running at http://localhost:${port}/api`);
});
server.on("error", (err) => console.error("Server Error:", err));
