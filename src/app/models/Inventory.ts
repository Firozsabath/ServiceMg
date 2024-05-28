export class Inventory{
    public partsID : number;
    public description : string;
    public manufacturer : string;
    public supplier : string;
    public unitCost : number;
    public miscellaniousCost : number;
    public productCost : number;
    public quantityOnHand : number;
    public reOrderLevel : number;
    public leadTime : number;
    public lastReorderQuantity : number;
    public categoryID : number;
    public miscellaniousChargeDescription? : string;
    public lastReorderDate? : Date;
    public createdDate? : Date;
    public updatedDate? : Date;
    public vendorid: number;
    public skuID : string;

    //public vendorName: string;

    constructor(init? : Partial<Inventory>) {
        Object.assign(this,init);        
    }
}

export class InventoryDP{
    public partsID:number;
    public description:string;
    /**
     *
     */
     constructor(partsID:number,description:string) {             
    }
}