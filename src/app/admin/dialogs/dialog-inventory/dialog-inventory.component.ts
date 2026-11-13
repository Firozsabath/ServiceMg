import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Inventory } from 'src/app/models/Inventory';
import { CompaniesopService } from 'src/app/service/companies/companiesop.service';
import { InventoryopService } from 'src/app/service/inventory/inventoryop.service';
import { VendorsopService } from 'src/app/service/vendors/vendorsop.service';
import { __values } from 'tslib';

@Component({
  selector: 'app-dialog-inventory',
  templateUrl: './dialog-inventory.component.html',
  styleUrls: ['./dialog-inventory.component.css']
})
export class DialogInventoryComponent implements OnInit {
  inventory: Inventory;

  inventoryData:FormGroup;
  vendorList:any;
  selectedVendor:any;
  showVat:boolean=true;
  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialogdata: any,
    private invService: InventoryopService,private vendService: VendorsopService,
   private dialogRef:MatDialogRef<DialogInventoryComponent>, private _snackbar:MatSnackBar) { 

    this.inventoryData = this.fb.group({
      partsID:[0],
      description:['',Validators.required],
      manufacturer:['',Validators.required],
      vendorid:['',[Validators.required]],
      unitCost:[],
      quantityOnHand:[],
      miscellaniousCost:[],
      productCost:[],
      reOrderLevel:[],
      leadTime:[],
      lastReorderQuantity:[0],
      //categoryID:[0],
      miscellaniousChargeDescription:[''],
      createddate:[new Date],
      updatedDate:[new Date],
      skuID:['',Validators.required],
      //lastReorderDate:[new Date],
      isVatApplied:[false,Validators.required],
      vatPercent:[0]
    });

    this.inventoryData.valueChanges.subscribe(
      values=>{
          this.updateTotal();
      }
    );
  }
  
  ngOnInit(): void {

    this.inventoryData.patchValue(this.dialogdata)
    
    if(this.dialogdata){
      this.selectedVendor = this.dialogdata.vendorid;
      if(this.dialogdata.isVatApplied){
        this.showVat = !this.showVat;
      }
    }

    this.vendService.getVendors().subscribe(
      (data:any)=>{
        this.vendorList = data;
        console.log(this.vendorList);
      }
    )

  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    console.log('Input value:', inputValue);
    this.invService.getItemsBySKUID(inputValue).subscribe(
      (data:any)=>{
        if(data){
          this.inventoryData.patchValue(data);
          this.dialogdata = data;
          if(data.isVatApplied){
            this.showVat = !this.showVat;
          } 
        }else{
          //this.inventoryData.reset({skuID:inputValue});
          this.dialogdata = null;          
          this.inventoryData = this.fb.group({
            partsID:[0],
            description:['',Validators.required],
            manufacturer:['',Validators.required],
            vendorid:['',[Validators.required]],
            unitCost:[],
            quantityOnHand:[],
            miscellaniousCost:[],
            productCost:[],
            reOrderLevel:[],
            leadTime:[],
            lastReorderQuantity:[0],
            //categoryID:[0],
            miscellaniousChargeDescription:[''],
            createddate:[new Date],
            updatedDate:[new Date],
            skuID:[inputValue,Validators.required],
            //lastReorderDate:[new Date],
            isVatApplied:[false,Validators.required],
            vatPercent:[0]
          });

          this.inventoryData.valueChanges.subscribe(
            values=>{
                this.updateTotal();
            }
          );
          
        }
        
      }
    )
  }

  addItem(){
    debugger;
    var invData = this.inventoryData.value;
    if(this.inventoryData.valid){
      this.inventory = new Inventory(this.inventoryData.value);
    //console.log(this.inventory);
    if(this.dialogdata){
      this.invService.updateItem(this.inventory.partsID,this.inventory).subscribe(
        (data:any)=>{
          this._snackbar.open("Updated Successfully!","OK");
          this.dialogRef.close(true);
        }
      )
    }else{
      this.invService.addItem(this.inventory).subscribe(
        (data:any)=>{
          this._snackbar.open("Created Successfully!","OK");
          this.dialogRef.close(true);
        }
      )
    }
    }
  }

  updateTotal(){
    if(this.inventoryData.get('unitCost').value != null && this.inventoryData.get('miscellaniousCost').value != null){
      var uc = Number(this.inventoryData.get('unitCost').value);
      var mc = Number(this.inventoryData.get('miscellaniousCost').value);
      var total = uc+mc;
      this.inventoryData.get('productCost').setValue(total,{emitEvent:false});    
    }
   
   
  }

  showandhide(){
    this.showVat = !this.showVat;
  }

}
