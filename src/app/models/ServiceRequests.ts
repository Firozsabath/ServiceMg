export class ServiceRequests{
    public id:number;
    public machineID:number;
    public technicianID:number;
    public requestedDate:Date;
    public complatedDate:Date;
    public estimatedCompleteDate:Date;
    public description:string;
    public subject:string;
    public customerFeedback:string;
    public serviceTypeID:number;
    public priorityID:number;
    public serviceStatusID:number;
}

export class ServiceRequestsVM{
    public id:number;
    public machine:string;
    public subject:string;
    public technician:string;
    public requestedDate:Date;
    public complatedDate:Date;
    public estimatedCompleteDate:Date;
    public description:string;
    public customerFeedback:string;
    public serviceType:string;
    public priority:string;
    public serviceStatus:string;
    public machineID:number;
    public technicianID:number;
    public serviceTypeID:number;
    public priorityID:number;
    public serviceStatusID:number;
    public respondedinHours:any;
    public respondMessage:string;
    public technicianComment:string
}

export class TechnicianNotesVM{
    public status:string;
    public technicianName:string;
    public notes:string;
    public createdDate:Date;
    /**
     *
     */
    constructor(init? : Partial<TechnicianNotesVM>) {       
        
    }
}

export class ServiceRequestAttachments{
    public id:number;
    public requestID:number;
    public filePath:string;
    public fileName:string;

    constructor(init? : Partial<ServiceRequestAttachments>) {       
        
    }
}