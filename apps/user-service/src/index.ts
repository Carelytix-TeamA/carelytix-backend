import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import salonRouter from "./routes/salon.router";
import branchRouter from "./routes/branch.router";

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

app.get("/user-health", (req, res) => {
  res.send({ message: "Hello User Service API" });
});

app.use("/salon", salonRouter);
app.use("/branch", branchRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 6002;
const server = app.listen(port, () => {
  console.log(`User service running at http://localhost:${port}/api`);
});
server.on("error", (err) => console.error("Server Error:", err));
