import express from "express";
import cors from "cors";
import blogRoutes from "./routes/blogRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

/** Health check route */
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/blogs", blogRoutes);

export default app;
