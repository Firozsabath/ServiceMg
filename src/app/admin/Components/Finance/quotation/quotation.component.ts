import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { DialogQuotationpreviewComponent } from 'src/app/admin/dialogs/dialog-finance/dialog-quotationpreview/dialog-quotationpreview.component';
import { InventoryDP } from 'src/app/models/Inventory';
import { TicketsReportDropdownDTO } from 'src/app/models/PriorityLevels';
import { InventoryopService } from 'src/app/service/inventory/inventoryop.service';
import { MachinesopService } from 'src/app/service/machines/machinesop.service';
import { QuotationOpService } from 'src/app/service/Quotation/quotation-op.service';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {

  drps:TicketsReportDropdownDTO;
  selectedMachine:any;  
  selectedBranch:any;
  selectedCompany:any;
  selectedparts:any;
  myControl = new FormControl('', Validators.required);
  //public quatationsItems1: FormArray;
  fontStyle?: string;
  options: InventoryDP[];
  //filteredOptions: Observable<InventoryDP[]>;
  filteredOptions: Observable<any[]>[] = [];
  showmanualCompany:boolean=false;
  showAutoCompany:boolean=false;
  showButtons:boolean=false;
  filteredCompanies:any[];
  filteredBranches:any[];
  filteredMachines:any[];
  partsList: any[];
  constructor(private fb:FormBuilder,private ticketServices: ServicerequestopService, private invService: InventoryopService,
     private quotationService: QuotationOpService, private router: Router, private machineService:MachinesopService
     , private dialog:MatDialog, private _snackBar:MatSnackBar, private cdRef: ChangeDetectorRef
     ) { }
  quotation = this.fb.group({
    quotationID:[0],
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
    disclaimer:[''],
    notes:[''],
    quotationItems:this.fb.array([])    
  });
  ngOnInit(): void {
    this.ticketServices.getReportDropdowns().subscribe(
      (data:any)=>{
        this.drps = data;  
        console.log(this.drps);      
        this.filteredCompanies = [...this.drps.requestCompanies];
        this.filteredBranches = [...this.drps.requestBranches];
        this.filteredMachines = [...this.drps.requestMachines];
      }
    ) 
    this.invService.getItems().subscribe(
      (data:any)=>{
        this.partsList = data.map(p=>({
          partsID:p.partsID,
          description:p.description +'-'+p.skuID +' '+'('+p.quantityOnHand+' Pieces Left)',
          skuID:p.skuID
        }));
       
      });   
  }
  get quotationItems(): FormArray {
    return this.quotation.get('quotationItems') as FormArray;
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.partsList.filter(option =>
      option.skuID.toLowerCase().includes(filterValue)
    );
  }

  displayPart(part: any): string {
    debugger;
    return part ? part.description : '';
  }

  onSelectPart(event: any, index: number) {
    debugger;
    const selectedPart = event.option.value;
    const partForm = this.quotationItems.at(index);
  
    partForm.patchValue({
      partsID: selectedPart.partsID, // Ensure partsID is set for validation
      searchInput: selectedPart // Display description in input
    });
  
    // Mark the field as touched and update validation
    partForm.get('partsID')?.markAsTouched();
    partForm.get('partsID')?.updateValueAndValidity();
  }

 
  addItem() {
    debugger;  
    const index = this.quotationItems.length;

    const partGroup = this.fb.group({
      searchInput: [''], // Used for filtering
      partsID: [null, Validators.required], // Stores partsID
      quantityUsed: ['', [Validators.required]], // Stores quantity
    });

    this.quotationItems.push(partGroup);

    // Ensure `filteredOptions[index]` is initialized
    this.filteredOptions[index] = new Observable<any[]>(); 

    setTimeout(() => {
      const searchInputControl = partGroup.get('searchInput');
      if (searchInputControl) {
        this.filteredOptions[index] = searchInputControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || ''))
        );
      }

      // Force Angular to detect new form controls
      this.cdRef.detectChanges();
    });
    
  }

  removeItem(index) {    
    this.quotationItems.removeAt(index);
  }

  viewQuot(){
    console.log(this.quotation.value);
    if(this.quotation.valid){
      this.quotationService.setQuotation(this.quotation.value);
    //this.router.navigate(['/admin/fin/quotationview']);
    var dialofRef =  this.dialog.open(DialogQuotationpreviewComponent,{
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

  onSelectCompany(companyID:any){
    //console.log(companyID.value);
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

}
