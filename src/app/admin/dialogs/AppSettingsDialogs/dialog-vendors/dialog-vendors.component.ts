import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Vendors } from 'src/app/models/Vendors';
import { VendorsopService } from 'src/app/service/vendors/vendorsop.service';

@Component({
  selector: 'app-dialog-vendors',
  templateUrl: './dialog-vendors.component.html',
  styleUrls: ['./dialog-vendors.component.css']
})
export class DialogVendorsComponent implements OnInit {

  vendor: Vendors;
  vendorData: FormGroup;
  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialogdata: any,private vendService: VendorsopService, private dialogRef:MatDialogRef<DialogVendorsComponent>, private _snackbar:MatSnackBar) { 

    this.vendorData = this.fb.group({
      id:[0],
      contactEmail:['',[Validators.required,Validators.email]],
      name:['',Validators.required],
      address:['',Validators.required],
      contactName:['',Validators.required],
      contactNumber:['',Validators.required]      
    })

  }

  ngOnInit(): void {
    this.vendorData.patchValue(this.dialogdata);
  }

  addVendor(){
    var vData = this.vendorData.value;
    this.vendor = new Vendors(this.vendorData.value);
   // console.log(this.inventory);
    if(this.dialogdata){
      this.vendService.updateVendor(this.vendor.id,this.vendor).subscribe(
        (data:any)=>{
          this._snackbar.open("Updated Successfully!","OK");
          this.dialogRef.close(true);
        }
      )

    }else{
      this.vendService.postVendor(this.vendor).subscribe(
        (data:any)=>{
          this._snackbar.open("Created Successfully!","OK");
          this.dialogRef.close(true);
        }
      )
    }
  }

}
