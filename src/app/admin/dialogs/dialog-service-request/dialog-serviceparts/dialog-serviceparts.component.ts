import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable, startWith } from 'rxjs';
import { InventoryDP } from 'src/app/models/Inventory';
import { ServiceParts } from 'src/app/models/ServiceParts';
import { InventoryopService } from 'src/app/service/inventory/inventoryop.service';
import { ServicepartsopService } from 'src/app/service/serviceparts/servicepartsop.service';
import { CustomValidator } from 'src/app/Validators/CustomValidator.validators';

@Component({
  selector: 'app-dialog-serviceparts',
  templateUrl: './dialog-serviceparts.component.html',
  styleUrls: ['./dialog-serviceparts.component.css']
})
export class DialogServicepartsComponent implements OnInit {

 
  myControl = new FormControl('');
  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialogdata: any,
    private dialogRef:MatDialogRef<DialogServicepartsComponent>, private _snackbar:MatSnackBar
    ,private sParts: ServicepartsopService, private invService:InventoryopService) { }

    pData: ServiceParts[];
    serviceParts = this.fb.group({
      usedParts:this.fb.array([this.createUsedPart()])
    })
    
    serviceID:any;
    options: InventoryDP[];
    filteredOptions: Observable<InventoryDP[]>;
    partsList:FormArray;
  ngOnInit(): void {
    debugger;
    this.serviceID = this.dialogdata.id;
    this.invService.getItems().subscribe(
      (data:any)=>{
        this.options = data.map(p=>({
          partsID:p.partsID,
          description:p.description +' '+'('+p.quantityOnHand+' Pieces Left)'
        }));
      }
    )   
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith<string | InventoryDP>(''),
    //   map(value => typeof value === 'string' ? value : value.partsID),
    //   map(id => id ? this._filter(id) : this.options.slice())
    // );

     //this.addUsedPart();    
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
    const selectedValue = event.option.value;
    const selectedId = selectedValue.partsID;
    this.usedParts.at(index).get('partsId').setValue(selectedId);
  }

  addServiceParts(){

    this.pData = this.serviceParts.value.usedParts as ServiceParts[]
    console.log(this.serviceParts);
    // this.sParts.postUsedParts(this.pData).subscribe(
    //   (data:any)=>{
    //     this._snackbar.open("Created Successfully!","Ok");
    //     this.dialogRef.close(true);
    //   }
    // )
  }


  get usedParts(): FormArray {
    return this.serviceParts.get('usedParts') as FormArray;
  }

  createUsedPart(): FormGroup {
    return this.fb.group({
      serviceId: [this.serviceID],
      //partsId: new FormControl(''),
      partsId:['',
        {
          validators: [Validators.required],
          asyncValidators: [CustomValidator.checkPartsAvailablity(this.invService)],
          updateOn: 'blur'
        }
        ],
      //CustomValidator
      quantityUsed: ['',Validators.required]
    });
  }
    
  addUsedPart(): void {
    const autocompleteGroup = this.fb.group({
    serviceId: [this.serviceID],
    partsId:['',
        {
          validators: [Validators.required],
          asyncValidators: [CustomValidator.checkPartsAvailablity(this.invService)],
          updateOn: 'blur'
        }
        ],
    quantityUsed: ['',Validators.required]
  });

  this.filteredOptions = this.myControl.valueChanges.pipe(
    startWith<string | InventoryDP>(''),
    map(value => typeof value === 'string' ? value : value.partsID),
    map(id => id ? this._filter(id) : this.options.slice())
  );

  this.usedParts.push(autocompleteGroup);

   // this.usedParts.push(this.createUsedPart());
  }

  removeUsedPart(index: number): void {
    this.usedParts.removeAt(index);
  }

  getContactsFormGroup(index): FormGroup {
    this.partsList = this.serviceParts.get('usedParts') as FormArray
    const formGroup = this.partsList.controls[index] as FormGroup;
    return formGroup;
  }


}
