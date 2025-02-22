export class Invoice{

    public  InvoiceID :number;
    public  QuotationID :number;
public companyID :number;
public machineID :number;
public branchID : number;
public companyName :string;
public companyAddress :string;
public trn :string;
public CreatedAt   :Date;
public TotalAmount : number;
public DueDate :Date;
public InvoiceNumber :string;
public CreatedBy :string;

public InvoiceItems:InvoiceItems[]; 

}

export class InvoiceItems{
    public InvoiceItemID:number;
    public InvoiceID:number;
    public PartsID:number; 
    public Description:string;
    public Quantity:number;
    public UnitPrice:any; 
    public TotalPrice:any; 
    public vatPercent:number; 
    public vat:any; 
    public availablility:string; 
} 

