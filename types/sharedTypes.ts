export interface IProject
{
    id: number;
    name: string;
    description: string;
    features: IFeature[];
};


export interface IFeature
{
    id: number;
    name: string;
    priority: number;
    progress: number;
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
};