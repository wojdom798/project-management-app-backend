import fs from "fs";
import path from "path";
import express, { Request, Response, NextFunction } from "express";
import { IDebugData } from "./types/sharedTypes";

function logUrlInfoMiddleware(req: Request, res: Response, next: NextFunction)
{
    let currentTime = new Date().toLocaleString("pl-PL",{ hour12: false });
    console.log(`[${req.method}] (${currentTime}) ${req.originalUrl}`);
    next();
}

let debugData: IDebugData | null = null;
if (
    typeof process.env.PROJECT_MANAGEMENT_APP_DEBUG_DATA == "string" &&
    fs.existsSync(process.env.PROJECT_MANAGEMENT_APP_DEBUG_DATA)
)
{
    debugData = JSON.parse(
        fs.readFileSync(process.env.PROJECT_MANAGEMENT_APP_DEBUG_DATA, "utf-8")
    ) as IDebugData;
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


app.get("/api/test",
function (req: Request, res: Response, next: NextFunction)
{
    res.json({
        message: "API test endpoint success",
    });
});


app.get("/api/get-debug-data",
function (req: Request, res: Response, next: NextFunction)
{
    res.json(debugData);
});


app.get("/api/refresh-debug-data",
function (req: Request, res: Response, next: NextFunction)
{
    if (
        typeof process.env.PROJECT_MANAGEMENT_APP_DEBUG_DATA == "string" &&
        fs.existsSync(process.env.PROJECT_MANAGEMENT_APP_DEBUG_DATA)
    )
    {
        debugData = JSON.parse(
            fs.readFileSync(process.env.PROJECT_MANAGEMENT_APP_DEBUG_DATA, "utf-8")
        ) as IDebugData;
    }

    res.json({ msg: "refreshed debug data" });
});


app.post("/api/update-feature-progress",
function (req: Request, res: Response, next: NextFunction)
{
    console.log(req.body);
    const responseData = {
        success: false,
        errors: [ "could not access debug data." ]
    }

    if (debugData &&
        process.env.PROJECT_MANAGEMENT_APP_DEBUG_DATA &&
        fs.existsSync(process.env.PROJECT_MANAGEMENT_APP_DEBUG_DATA))
    {
        for (let feature of debugData.projects[0].features)
        {
            if (feature.id === req.body.featureId)
            {
                feature.progress = req.body.newProgress;
            }
        }

        for (let task of debugData.tasks)
        {
            if (task.id === req.body.taskId)
            {
                task.isFinished = req.body.isFinished;
            }
        }
        
        fs.writeFileSync(
            process.env.PROJECT_MANAGEMENT_APP_DEBUG_DATA,
            JSON.stringify(debugData),
            "utf-8"
        )
    }
    
    res.json(responseData);
});


app.listen(portNumber);
console.log(new Date().toLocaleString("pl-PL",
  { hour12: false }) + ", starting server on port:", portNumber
);