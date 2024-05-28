export class Branches{   
    public id:number;
    public companyID:number;
    public branchName:string;
    public contactNumber:any;
    public trnNumber:any;
    public contactPerson:any;
    public createdTime:Date;
    public updateTime:Date;
    public doc1:any;
    public doc2:any;
    constructor(
        id:number,
        companyID:number,
        branchName:string,
        contactNumber:any,
        trnNumber:any,
        contactPerson:any,
        createdTime:Date,
        updateTime:Date,
        doc1:any,
        doc2:any    
    ){}
}

export class BranchessDropdown{
    public branchID:number;
    public branchName?:string;
    public companyName?:string;
}