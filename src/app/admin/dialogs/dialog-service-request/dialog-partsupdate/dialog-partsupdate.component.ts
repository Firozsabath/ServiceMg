import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable, startWith } from 'rxjs';
import { InventoryDP } from 'src/app/models/Inventory';
import { ServiceParts, ServicePartsVM } from 'src/app/models/ServiceParts';
import { InventoryopService } from 'src/app/service/inventory/inventoryop.service';
import { ServicepartsopService } from 'src/app/service/serviceparts/servicepartsop.service';

@Component({
  selector: 'app-dialog-partsupdate',
  templateUrl: './dialog-partsupdate.component.html',
  styleUrls: ['./dialog-partsupdate.component.css']
})
export class DialogPartsupdateComponent implements OnInit {

  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialogdata: any,
  private dialogRef:MatDialogRef<DialogPartsupdateComponent>, private _snackbar:MatSnackBar
  ,private sParts: ServicepartsopService, private invService:InventoryopService) {

    
   }

  pData: ServicePartsVM;

    servicePart = this.fb.group({
      id:[],
      serviceID: [],
      partsID: new FormControl(),
      quantityUsed: [],
      partName:['']
    })

    options: InventoryDP[];
    filteredOptions: Observable<InventoryDP[]>;
    myControl = new FormControl('');
  ngOnInit(): void {
    debugger;    

    this.invService.getItems().subscribe(
      (data:any)=>{
        this.options = data.map(p=>({
          partsID:p.partsID,
          description:p.description
        }));

        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith<string | InventoryDP>(''),
          map(value => typeof value === 'string' ? value : value.partsID),
          map(id => id ? this._filter(id) : this.options.slice())
        );
      }
    )
    if(this.dialogdata){
      this.servicePart.patchValue(this.dialogdata);
      this.setSelectedValue(this.dialogdata.partsID);
    }
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

  setSelectedValue(value: any): void {
    this.servicePart.get('partsID').setValue(value);
  }
 

  onOptionSelected(event: any): void {    
    const selectedValue = event.option.value;
    const selectedId = selectedValue.partsID;
    this.servicePart.get('partsID').setValue(selectedId);
  }

  updateServicePart(){
    this.pData = new ServicePartsVM(this.servicePart.value);
    //console.log(this.pData);
     this.sParts.updateUsedParts(this.pData.id,this.pData).subscribe(
      (data:any)=>{
        this._snackbar.open("Updated Successfully!","Ok");
        this.dialogRef.close(true);
      }
    )

  }

}
