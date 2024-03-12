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
    isFinished: boolean;
};


export interface ITask
{
    id: number;
    feature_id: number;
    name: string;
};


export interface IDebugData
{
    projects: IProject[];
    tasks: ITask[];
};