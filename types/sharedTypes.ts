export interface IProject
{
    id: number;
    name: string;
    description: string;
};


export interface IFeature
{
    id: number;
    name: string;
    priority: number;
    progress: number;
    project_id: number;
};


export interface ITask
{
    id: number;
    feature_id: number;
    name: string;
    isFinished: boolean;
};


export interface IDebugData
{
    projects: IProject[];
    tasks: ITask[];
    features: IFeature[];
};