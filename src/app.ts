import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import fs from "fs";
// import personRoutes from "./routes/person.route";
import videoRoutes from "./routes/video.route";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const dir = "./uploads";

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

// Necessary initializations
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "This is the home route :D"
  })
})

app.use("/api", videoRoutes);

app.get("*", (req, res) => {
  res.status(404).json({
    status: false,
    message: "Not quite sure the route you were looking for..."
  })
})

export default app;