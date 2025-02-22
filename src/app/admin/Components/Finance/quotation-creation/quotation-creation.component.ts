import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { InventoryopService } from 'src/app/service/inventory/inventoryop.service';
import { MachinesopService } from 'src/app/service/machines/machinesop.service';
import { QuotationOpService } from 'src/app/service/Quotation/quotation-op.service';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';

@Component({
  selector: 'app-quotation-creation',
  templateUrl: './quotation-creation.component.html',
  styleUrls: ['./quotation-creation.component.css']
})
export class QuotationCreationComponent implements OnInit {

  form: FormGroup;
  filteredOptions: Observable<any[]>[] = [];

  partsList: any[];

  constructor(private fb: FormBuilder,private ticketServices: ServicerequestopService, private invService: InventoryopService,
    private quotationService: QuotationOpService, private router: Router, private machineService:MachinesopService
    , private dialog:MatDialog, private _snackBar:MatSnackBar, private cdRef: ChangeDetectorRef) {
    this.form = this.fb.group({
      partsArray: this.fb.array([]),
    });
  }

  ngOnInit(): void {

    this.invService.getItems().subscribe(
      (data:any)=>{
        this.partsList = data.map(p=>({
          partsID:p.partsID,
          description:p.description +'-'+p.skuID +' '+'('+p.quantityOnHand+' Pieces Left)',
          skuID:p.skuID
        }));
       
      });

    // Add one initial row if needed on component load
    //this.addPart();

    
  }

  get partsArray(): FormArray {
    return this.form.get('partsArray') as FormArray;
  }

  addPart() {
    const index = this.partsArray.length;

    const partGroup = this.fb.group({
      searchInput: [''], // Used for filtering
      partsID: [null, Validators.required], // Stores partsID
      quantity: ['', [Validators.required, Validators.min(1)]], // Stores quantity
    });

    this.partsArray.push(partGroup);

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

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.partsList.filter(option =>
      option.skuID.toLowerCase().includes(filterValue)
    );
  }

}
