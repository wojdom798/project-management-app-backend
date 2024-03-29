import fs from "fs";
import path from "path";
import express, { Request, Response, NextFunction } from "express";

import apiRoutes from "./routes/apiRoutes";

function logUrlInfoMiddleware(req: Request, res: Response, next: NextFunction)
{
    let currentTime = new Date().toLocaleString("pl-PL",{ hour12: false });
    console.log(`[${req.method}] (${currentTime}) ${req.originalUrl}`);
    next();
}

const app = express();
const portNumber = process.env.PORT || 8007;

const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath, { index: false } ));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logUrlInfoMiddleware);


app.get("/", function (req: Request, res: Response, next: NextFunction)
{
    res.json({
        msg: "homepage"
    });
});

app.use("/api", apiRoutes);

app.listen(portNumber);
console.log(new Date().toLocaleString("pl-PL",
  { hour12: false }) + ", starting server on port:", portNumber
);