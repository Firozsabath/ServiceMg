import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { DialogInvoicepreviewComponent } from 'src/app/admin/dialogs/dialog-finance/dialog-invoicepreview/dialog-invoicepreview.component';
import { InventoryDP } from 'src/app/models/Inventory';
import { TicketsReportDropdownDTO } from 'src/app/models/PriorityLevels';
import { InventoryopService } from 'src/app/service/inventory/inventoryop.service';
import { InvoiceOpService } from 'src/app/service/invoice/invoice-op.service';
import { MachinesopService } from 'src/app/service/machines/machinesop.service';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  fontStyle?: string;
  importOrCreate?:string;
  showmanualCompany:boolean=false;
  showAutoCompany:boolean=false;
  showButtons:boolean=false;

  showImport:boolean=false;
  showCreate:boolean=false;

  drps:TicketsReportDropdownDTO;
  selectedMachine:any;  
  selectedBranch:any;
  selectedCompany:any;
  myControl = new FormControl('');
  public invoiceItems: FormArray;  
  options: InventoryDP[];
  filteredOptions: Observable<InventoryDP[]>; 
  filteredCompanies:any[];
  filteredBranches:any[];
  filteredMachines:any[];
  invAuto: FormGroup;
  invManual: FormGroup;
  constructor(private fb:FormBuilder,private ticketServices: ServicerequestopService, private invService: InventoryopService,
     private route: Router, private invoiceService: InvoiceOpService, private machineService:MachinesopService
     , private dialog:MatDialog, private _snackBar:MatSnackBar
     ) {

      this.invAuto = this.fb.group({
    quotID:['',Validators.required]
  })

  this.invManual = this.fb.group({
    invoiceID:[0],
    companyID:[0],
    machineID:[0],  
    branchID:[0],
    companyName:[''],
    companyAddress:[''],
    trn:[''],
    dateCreated:[new Date()],
    totalAmount:[0],
    validUntil:[new Date()],
    quotationNum:[''],
    serviceCharges:[null],
    PaymentTerms:[''],
    invoiceItems:this.fb.array([])
  })

}

  ngOnInit(): void {

    this.ticketServices.getReportDropdowns().subscribe(
      (data:any)=>{
        this.drps = data;  
        //console.log(this.drps);      
        this.filteredCompanies = [...this.drps.requestCompanies];
        this.filteredBranches = [...this.drps.requestBranches];
        this.filteredMachines = [...this.drps.requestMachines];
      }
    )
    this.invoiceItems = this.invManual.get('invoiceItems') as FormArray;

    this.invService.getItems().subscribe(
      (data:any)=>{
        this.options = data.map(p=>({
          partsID:p.partsID,
          description:p.description +'-'+p.skuID +' '+'('+p.quantityOnHand+' Pieces Left)',
          skuID:p.skuID
        }));
      }
    )   

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith<string | InventoryDP>(''),
      map(value => typeof value === 'string' ? value : value.partsID),
      map(id => id ? this._filter(id) : this.options.slice())
    );
  }

  private _filter(value: any){
    //debugger;
    let filterValue = '';

    if (typeof value === "string") {
      filterValue = value.toLowerCase();
    }
    //return this.options.filter(option => option.description.toLowerCase().includes(filterValue));
    return this.options.filter(option => option.skuID.toLowerCase().includes(filterValue));
  }

  displayFn(value?: InventoryDP | number): string | undefined { 
    if(typeof value === 'number'){
      var dp = this.options.find(p=>p.partsID === value).description;
      return dp;
    }else{
      return value ? value.description : undefined;
    }
    
  }

  onOptionSelected(event: any, index: number): void {  
    debugger;  
    const selectedValue = event.option.value;
    const selectedId = selectedValue.partsID;
    this.invoicesItems.at(index).get('partsId').setValue(selectedId);
  }

  get invoicesItems(): FormArray {
    return this.invManual.get('invoiceItems') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({      
      partsId: ['',
      {
        validators: [Validators.required],        
        updateOn: 'blur'
      }],
      quantityUsed: ['',Validators.required]
    });
  }

  addItem() {
    this.invoiceItems.push(this.createItem());
  }

  removeItem(index) {    
    this.invoiceItems.removeAt(index);
  }

  onSelectCompany(companyID:any){    
    if(companyID.value == undefined){
      this.ticketServices.getReportDropdowns().subscribe(
        (data:any)=>{
          this.drps = data;
          this.filteredBranches = this.drps.requestBranches;
        }
      );
    }else{
      this.ticketServices.getReportDropdowns().subscribe(
        (data:any)=>{
          this.drps = data;
          this.filteredBranches = this.drps.requestBranches.filter((i)=>i.foreignID == companyID.value);
        }
      );
    }
    
  }

  onSelectBranches(branchID:any){
    if(branchID.value == undefined){
     this.machineService.getMachines().subscribe(
       (data:any)=>{
         this.filteredMachines = data;
       }
     );
    }else{
     this.machineService.getMachines().subscribe(
       (data:any)=>{
         this.filteredMachines = data.filter((p)=>p.branchID == branchID.value);
       }
     );
    }    
 
   }

   updateFilteredDrops(drpType:string, filtered: any[]) {
    if(drpType == 'companies'){
      this.filteredCompanies = filtered;
    }else if(drpType == 'machines'){
      this.filteredMachines = filtered;
    }else if(drpType == 'branches'){
      this.filteredBranches = filtered;
    }
  }


  toggleImportAndCreate(){
    //this.showButtons = true;
    if(this.importOrCreate === 'create'){
      this.showImport = false;
      this.showCreate = true;   
    }
    else if(this.importOrCreate === 'import'){
      this.showImport = true; 
      this.showCreate = false;    
    }
  }

  showHideBelowDiv(){
    //console.log(this.fontStyle);
    this.showButtons = true;
    if(this.fontStyle === 'manual'){
      this.showmanualCompany = false;
      this.showAutoCompany = true;   
    }
    else if(this.fontStyle === 'auto'){
      this.showmanualCompany = true; 
      this.showAutoCompany = false;    
    }
  }



  InvoicePreview(){
  // console.log(this.invAuto.value);
   if(this.invAuto.valid){
    var quotID = this.invAuto.value.quotID;
    //this.route.navigate(['/admin/fin/invoicePreview'],{queryParams:{quotID:quotID}});  
    
    var dialofRef =  this.dialog.open(DialogInvoicepreviewComponent,{
      width: '100vw', // Full width
      height: '100vh', // Full height
      maxWidth: '100vw', // Ensure it doesn't exceed screen width
      maxHeight: '100vh', // Ensure it doesn't exceed screen height
      data:quotID
   
    });
    
   }
  }

  viewInvoice(){
    console.log(this.invManual.value);
    if(this.invManual.valid){
      this.invoiceService.setInvoice(this.invManual.value);
      //this.route.navigate(['/admin/fin/invoicePreview']);

      var dialofRef =  this.dialog.open(DialogInvoicepreviewComponent,{
        width: '100vw', // Full width
        height: '100vh', // Full height
        maxWidth: '100vw', // Ensure it doesn't exceed screen width
        maxHeight: '100vh', // Ensure it doesn't exceed screen height
        
       // width:"80vw"
      });
  
      dialofRef.afterClosed().subscribe({
       next:(data:any)=>{
         if(data){
           this._snackBar.open("Added Successfull","OK");
           //this.getAllMachines();
         }
       }
      })
      

    }
   
  }

}
