import express from "express";
import cors from "cors";

const app = express();

// app middleware configurations

app.use(express.json({}));
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

export { app };
