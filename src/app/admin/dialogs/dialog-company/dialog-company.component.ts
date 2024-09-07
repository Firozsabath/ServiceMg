import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Companies } from 'src/app/models/Companies';
import { Technicians } from 'src/app/models/Technicians';
import { CompaniesopService } from 'src/app/service/companies/companiesop.service';
import { TechnicianopsService } from 'src/app/service/technician/technicianops.service';

@Component({
  selector: 'app-dialog-company',
  templateUrl: './dialog-company.component.html',
  styleUrls: ['./dialog-company.component.css']
})
export class DialogCompanyComponent implements OnInit {

  techin: Technicians;
  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialogdata: any,private compService: CompaniesopService, private dialogRef:MatDialogRef<DialogCompanyComponent>, private _snackbar:MatSnackBar) { }

  companyData = this.fb.group({
    id:[0],
    name:['',Validators.required],
    contactPerson:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    companySize:['',Validators.required],
    address:['',Validators.required],
    notes:[''],
    createddate:[new Date],
    assignedDiscount:[]
  })

  ngOnInit(): void {    
    this.companyData.patchValue(this.dialogdata);    
  }

  addCompany(){
    debugger;
    if(this.companyData.valid){
      var item = this.companyData.value;
      var postData: Companies={id:item.id,name:item.name,address:item.address,contactPerson:item.contactPerson,createdDate:item.createddate,email:item.email,updatedTime:new Date,
        isBlocked:false,notes:item.notes,companySize:item.companySize,assignedDiscount:item.assignedDiscount};     
      
      if(this.dialogdata){
        this.compService.updateCompany(postData.id,postData).subscribe({
          next:(val:any)=>{
            this._snackbar.open("Updated Successfully!","Ok");
            this.dialogRef.close(true);
          }
        })
      }else{
        this.compService.addCompany(postData).subscribe({
          next:(val:any)=>{
            //console.log(val);
            this._snackbar.open("Created Successfully!","Ok");
            this.dialogRef.close(true);
          }
      });
      }
    }          
  }

}
