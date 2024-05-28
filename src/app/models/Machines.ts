export class Machines{
    public id:number;
    public branchID:number;
    public name:string;
    public model:string;
    public manufacturer:string;
    public createdTime?:Date;
    public updatedTime?:Date;
    public installationDate?:Date;
    public contractEndDate?:Date;
    public contractTypeID?:number;   
    public skuID?:string;   
}

export class MachinesVM{
    public id:number;
    public branchID:number;
    public name:string;
    public model:string;
    public manufacturer:string;
    public createdTime?:Date;
    public updatedTime?:Date;
    public installationDate?:Date;
    public contractEndDate?:Date;
    public contractTypeID?:number;
    public  contractType : string;
    public branchName : string;
    public skuID : string;
}

export class MachinesDropdown{
    public branchID:number;
    public machineName?:string;
    public branchName?:string;
}