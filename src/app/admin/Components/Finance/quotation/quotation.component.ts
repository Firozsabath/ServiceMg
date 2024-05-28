import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { InventoryDP } from 'src/app/models/Inventory';
import { TicketsReportDropdownDTO } from 'src/app/models/PriorityLevels';
import { InventoryopService } from 'src/app/service/inventory/inventoryop.service';
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
  selectedCompany:any;
  myControl = new FormControl('');
  public quationsItems: FormArray;
  options: InventoryDP[];
    filteredOptions: Observable<InventoryDP[]>;
  constructor(private fb:FormBuilder,private ticketServices: ServicerequestopService, private invService: InventoryopService,
     private quotationService: QuotationOpService, private router: Router) { }
  quotation = this.fb.group({
    quotationID:[0],
    companyID:[],
    //machineID:[],
    dateCreated:[new Date()],
    totalAmount:[0],
    validUntil:[new Date()],
    quotationNum:[''],
    quotationItems:this.fb.array([])
  });
  ngOnInit(): void {
    this.ticketServices.getReportDropdowns().subscribe(
      (data:any)=>{
        this.drps = data;        
      }
    )
    this.quationsItems = this.quotation.get('quotationItems') as FormArray;

    this.invService.getItems().subscribe(
      (data:any)=>{
        this.options = data.map(p=>({
          partsID:p.partsID,
          description:p.description +' '+'('+p.quantityOnHand+' Pieces Left)'
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
    return this.options.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  displayFn(value?: InventoryDP): string | undefined {
    return value ? value.description : undefined;
  }
 

  onOptionSelected(event: any, index: number): void {  
    debugger;  
    const selectedValue = event.option.value;
    const selectedId = selectedValue.partsID;
    this.quotationItems.at(index).get('partsId').setValue(selectedId);
  }

  get quotationItems(): FormArray {
    return this.quotation.get('quotationItems') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({      
      partsId: [],
      quantityUsed: []
    });
  }

  addItem() {
    this.quationsItems.push(this.createItem());
  }

  removeItem(index) {    
    this.quationsItems.removeAt(index);
  }

  viewQuot(){
    console.log(this.quotation.value);
    this.quotationService.setQuotation(this.quotation.value);
    this.router.navigate(['/admin/fin/quotationview']);
  }

}
