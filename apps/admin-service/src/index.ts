import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "@carelytix/utils/error-handler";
import dotenv from "dotenv";
import router from "./routes/member.router";
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

app.use("/", router);

app.use(errorMiddleware);
const port = process.env.PORT ? Number(process.env.PORT) : 6003;
const server = app.listen(port, () => {
  console.log(`Auth service running at http://localhost:${port}/api`);
});
server.on("error", (err) => console.error("Server Error:", err));
