import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PriorityLevels } from 'src/app/models/PriorityLevels';
import { RequestprioritiesopsService } from 'src/app/service/requestPriorities/requestprioritiesops.service';

@Component({
  selector: 'app-dialog-servicerequestspriorities',
  templateUrl: './dialog-servicerequestspriorities.component.html',
  styleUrls: ['./dialog-servicerequestspriorities.component.css']
})
export class DialogServicerequestsprioritiesComponent implements OnInit {

  rPriorityData:FormGroup;
  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialogdata: any, private rPriorityService:RequestprioritiesopsService, private dialogRef:MatDialogRef<DialogServicerequestsprioritiesComponent>, private _snackbar:MatSnackBar) { 

    this.rPriorityData = this.fb.group({
      id:[0],
      description:['',Validators.required]
    })

  }

  ngOnInit(): void {
    this.rPriorityData.patchValue(this.dialogdata)
  }

  addrequestPriority(){
    if(this.rPriorityData.valid){
      var requestPriority = new PriorityLevels(this.rPriorityData.value);

      if(this.dialogdata){
        this.rPriorityService.updateItem(requestPriority.id,requestPriority).subscribe(
          (data:any)=>{
            this._snackbar.open("Updated Successfully!","OK");
            this.dialogRef.close(true);
          }
        )
      }else{
        this.rPriorityService.addItem(requestPriority).subscribe(
          (data:any)=>{
            this._snackbar.open("Added Successfully!","OK");
            this.dialogRef.close(true);
          }
        )
      }

    }
  }

}
