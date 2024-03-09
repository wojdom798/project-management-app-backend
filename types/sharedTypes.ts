export interface IFeature
{
    name: string;
    priority: number;
    isFinished: boolean;
};

export interface IProject
{
    name: string;
    description: string;
    features: IFeature[];
};

export interface IDebugData
{
    projects: IProject[]
};