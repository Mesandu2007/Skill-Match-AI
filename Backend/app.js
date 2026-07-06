import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();



connectDB();



app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GitHub Recruitment ATS API Running",
  });
});




app.use("/api/dashboard",dashboardRoutes);


app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/github", githubRoutes);



app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});



app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});