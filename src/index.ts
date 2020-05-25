import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config();
import * as express from "express";
import * as expressFileupload from "express-fileupload";
const app = express();

import * as cors from "cors";
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(expressFileupload());
app.set("port", process.env.PORT || 3000);

import * as Mongoose from "mongoose";
Mongoose.connect(process.env.DATABASE_URL);

import mainRouter from "./routes/main.router";
app.use("/", mainRouter);

app.listen(app.get("port"));
console.debug(`app is running on port ${app.get("port")}`);
