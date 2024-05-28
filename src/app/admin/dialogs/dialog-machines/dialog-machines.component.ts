import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BranchessDropdown } from 'src/app/models/Branches';
import { Machines } from 'src/app/models/Machines';
import { BranchesopsService } from 'src/app/service/branches/branchesops.service';
import { MachinesopService } from 'src/app/service/machines/machinesop.service';

@Component({
  selector: 'app-dialog-machines',
  templateUrl: './dialog-machines.component.html',
  styleUrls: ['./dialog-machines.component.css']
})
export class DialogMachinesComponent implements OnInit {

  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialogdata: any, private machService:MachinesopService, private branchService:BranchesopsService,private dialogRef:MatDialogRef<DialogMachinesComponent>, private _snackbar:MatSnackBar) { }

  machPostData:Machines;
  branchList:BranchessDropdown[];
  selectedBranch:any;
  contractType:any;
  selectContract:any;
  machFormData = this.fb.group({
    id:[0],
    branchID:[Validators.required],
    name:['',Validators.required],
    model:['',Validators.required],
    manufacturer:['',Validators.required],
    createdTime:[new Date],
    updatedTime:[new Date],
    installationDate:[],
    contractEndDate:[Validators.required],
    contractTypeID:[1,Validators.required],
    skuID:['',Validators.required]
  })
  
  ngOnInit(): void {
    if(this.dialogdata){
      if(this.dialogdata.branchID != ''){
        this.selectedBranch = this.dialogdata.branchID
      }
      if(this.dialogdata.contractTypeID != ''){
        this.selectContract = this.dialogdata.contractTypeID
      }
      this.machFormData.patchValue(this.dialogdata)
    }

    this.branchService.getBranchListWithCompnay().subscribe(
      (data:any)=>{
        this.branchList = data;        
      }
    )

    this.machService.getContractTypes().subscribe(
      (data:any)=>{
        this.contractType = data;
      }
    )
  }

  addMachines(){
    console.log(this.machFormData.value);
    if(this.machFormData.valid){
      var item =this.machFormData.value;
      this.machPostData = {id:item.id,branchID:item.branchID,manufacturer:item.manufacturer,model:item.model,
        name:item.name,contractTypeID:item.contractTypeID,contractEndDate:item.contractEndDate,installationDate:item.installationDate,skuID:item.skuID
        ,createdTime:item.createdTime,updatedTime:new Date}
      
      if(this.dialogdata){
        this.machService.updateMachine(this.machPostData.id, this.machPostData).subscribe({
          next:(data:any)=>{
            this._snackbar.open("Updated Successfully!","OK",{duration:2500})
            this.dialogRef.close(true);
          }
        })
      }else{
        this.machService.addMachine(this.machPostData).subscribe({
          next:(data:any)=>{
            this._snackbar.open("Added Successfully!","OK",{duration:2500})
            this.dialogRef.close(true);
          }
        })
      }
      
    }
   
  }

}
