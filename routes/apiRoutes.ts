import fs from "fs";
import express, {Request, Response, NextFunction} from "express";
import { IDebugData } from "../types/sharedTypes";

const router = express.Router();


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


// route: /api/test
router.get("/test",
function (req: Request, res: Response, next: NextFunction)
{
    res.json({
        message: "API test endpoint success",
    });
});


// route: /api/get-debug-data
router.get("/get-debug-data",
function (req: Request, res: Response, next: NextFunction)
{
    res.json(debugData);
});


// route: /api/refresh-debug-data
router.get("/refresh-debug-data",
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


// route: /api/update-feature-progress
router.post("/update-feature-progress",
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


// route: /api/create-new-feature
router.post("/create-new-feature",
function (req: Request, res: Response, next: NextFunction)
{
    const responseData = {
        success: false,
        errors: [ "could not access debug data." ],
        payload: {}
    }

    type submitDataType = {
        name: string;
        priority: number;
    };

    const requestBody = req.body as submitDataType;

    if (debugData &&
        process.env.PROJECT_MANAGEMENT_APP_DEBUG_DATA &&
        fs.existsSync(process.env.PROJECT_MANAGEMENT_APP_DEBUG_DATA))
    {
        const newId = debugData.projects[0].features.length + 1;
        debugData.projects[0].features.push({
            id: newId,
            name: requestBody.name,
            priority: requestBody.priority,
            progress: 0
        });
        
        fs.writeFileSync(
            process.env.PROJECT_MANAGEMENT_APP_DEBUG_DATA,
            JSON.stringify(debugData),
            "utf-8"
        )

        responseData.success = true;
        responseData.errors = [];
        responseData.payload = {
            newFeatureId: newId
        }
    }
    
    res.json(responseData);
});


export default router;