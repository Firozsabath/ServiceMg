export class Vendors{
    public id:number;
    public name:string;
    public address:string;
    public contactName:string;
    public contactNumber:string;
    public contactEmail:string;

    /**
     *
     */
    constructor(init? : Partial<Vendors>) {
        Object.assign(this,init);        
    }
}