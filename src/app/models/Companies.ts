
export class Companies{
    public id:number;
    public name:any;
    public createdDate:Date;
    public updatedTime:Date;
    public isBlocked:boolean;
    public contactPerson: string
    public email:string
    public address:string
    public companySize:string
    public notes:string
    public assignedDiscount:number
      
    constructor(
        id:number,
        name:any,
        createdDate:Date,
        updatedTime:Date,
        isBlocked:boolean,
        contactPerson: string,
        email:string,
        address:string,
        companySize:string,
        notes:string,
        assignedDiscount:number
    ){
        this.id = id,
        this.name = name,
        this.createdDate = createdDate,
        this.updatedTime = updatedTime,
        this.isBlocked = isBlocked
        this.contactPerson= contactPerson,
        this.email = email,
        this.address = address,
        this.companySize = companySize,
        this.notes = notes
        this.assignedDiscount = assignedDiscount
    }
}

export class Companiesdropdown{
    public id:number;
    public name:any;
    constructor( 
        id:Number,
        name:any) {}
}