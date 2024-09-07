import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequestTypes } from 'src/app/models/PriorityLevels';
import { ReuquestTypeOpsService } from 'src/app/service/requestTypes/reuquest-type-ops.service';

@Component({
  selector: 'app-dialog-servicerequeststypes',
  templateUrl: './dialog-servicerequeststypes.component.html',
  styleUrls: ['./dialog-servicerequeststypes.component.css']
})
export class DialogServicerequeststypesComponent implements OnInit {

  rTypeData:FormGroup;
  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialogdata: any, private rTypeService:ReuquestTypeOpsService, private dialogRef:MatDialogRef<DialogServicerequeststypesComponent>, private _snackbar:MatSnackBar) {

    this.rTypeData = this.fb.group({
      id:[0],
      description:['',Validators.required]
    })
   }

  ngOnInit(): void {
    this.rTypeData.patchValue(this.dialogdata)
  }

  addRequestType(){
    if(this.rTypeData.valid){
      var requestType = new RequestTypes(this.rTypeData.value);

      if(this.dialogdata){
        this.rTypeService.updateItem(requestType.id,requestType).subscribe(
          (data:any)=>{
            this._snackbar.open("Updated Successfully!","OK");
            this.dialogRef.close(true);
          }
        )
      }else{
        this.rTypeService.addItem(requestType).subscribe(
          (data:any)=>{
            this._snackbar.open("Added Successfully!","OK");
            this.dialogRef.close(true);
          }
        )
      }

    }
  }

}
