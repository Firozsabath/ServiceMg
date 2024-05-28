export class PriorityLevels{
    public id:number;
    public description:string;
}

export class RequestTypes{
    public id:number;
    public description:string;
}

export class drp{
    public id:number;
    public name:string;
}

export class ServiceStatuses{
    public id:number;
    public description:string;
}

export class TicketsDropdownDTO{
    public priorities : PriorityLevels[];
    public requestTypes : RequestTypes[];
    public statuses : ServiceStatuses[];
}

export class TicketsReportDropdownDTO{
    public priorities : PriorityLevels[];
    public requestTypes : RequestTypes[];
    public statuses : ServiceStatuses[];
    public requestMachines: drp[];
    public requestBranches:drp[];
    public requestCompanies:drp[];
    public requestTechnicians:drp[];
}