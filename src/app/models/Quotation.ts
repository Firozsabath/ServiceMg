export class quotation{

    public  quotationID :number;
public companyID :number;
public machineID :number;
public companyName :string;
public companyAddress :string;
public trn :string;
public dateCreated :Date;
public totalAmount : number;
public validUntil :Date;
public quotationNum :string;

public quotataionItems:QuotationItems[]; 

}
export class quotItems{
    public partsId:number;
    public quantotyUsed:number;
    /**
     *
     */
    constructor(partsId:number, quantotyUsed:number) {        
        
    }
}

export class QuotationItems{
    public QuotationItemId:number;
    public QuotationId:number;
    public PartsID:number; 
    public Description:string;
    public Quantity:number;
    public UnitPrice:any; 
    public TotalPrice:any; 
    public vatPercent:number; 
    public vat:any; 
    public availablility:string; 
} 

