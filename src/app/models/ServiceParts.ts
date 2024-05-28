export class ServiceParts{
    public id:number;
    public partsID:number;
    public serviceID:number;
    public quantityUsed:number;

    /**
     *
     */
    constructor(init? : Partial<ServiceParts>) {
       Object.assign(this,init);        
    }
}

export class ServicePartsVM{
    public id:number;
    public partsID:number;
    public serviceID:number;
    public quantityUsed:number;
    public PartName:string;

    /**
     *
     */
    constructor(init? : Partial<ServicePartsVM>) {
       Object.assign(this,init);        
    }
}