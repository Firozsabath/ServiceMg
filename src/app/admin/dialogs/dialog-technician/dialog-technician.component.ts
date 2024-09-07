import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Technicians } from 'src/app/models/Technicians';
import { TechnicianopsService } from 'src/app/service/technician/technicianops.service';
import { DialogCompanyComponent } from '../dialog-company/dialog-company.component';

@Component({
  selector: 'app-dialog-technician',
  templateUrl: './dialog-technician.component.html',
  styleUrls: ['./dialog-technician.component.css']
})
export class DialogTechnicianComponent implements OnInit {
  
  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialoddata: any,private techService: TechnicianopsService, private dialogRef:MatDialogRef<DialogCompanyComponent>, private _snackbar:MatSnackBar) { }

  technician = this.fb.group({
    id:[0],
    name:['',Validators.required],
    position:['',Validators.required],
    email:['',Validators.required],
    createddate:[new Date]
  })

  ngOnInit(): void {
    this.technician.patchValue(this.dialoddata);
  }

  addTechnican(){
    var item = this.technician.value;
    var postData: Technicians={id:item.id,name:item.name,position:item.position,email:item.email,imgUrl:"",createdTime:item.createddate,updateTime:new Date};
      console.log(postData);

      if(this.dialoddata){
        this.techService.updateTechnician(postData.id,postData).subscribe({
          next:(val:any)=>{
            this._snackbar.open("Updated Successfull!","OK")
            this.dialogRef.close(true);
          }
        })

      }else{
        this.techService.addTechnician(postData).subscribe({
          next:(val:any)=>{
            //console.log(val);
            this._snackbar.open("Created Successfully!","Ok");
            this.dialogRef.close(true);
          }
      });
      }

      

  }

}
