import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Branches } from 'src/app/models/Branches';
import { Companiesdropdown } from 'src/app/models/Companies';
import { BranchesopsService } from 'src/app/service/branches/branchesops.service';
import { CompaniesopService } from 'src/app/service/companies/companiesop.service';

@Component({
  selector: 'app-dialog-branches',
  templateUrl: './dialog-branches.component.html',
  styleUrls: ['./dialog-branches.component.css']
})
export class DialogBranchesComponent implements OnInit {

  currentFile?: File;
  progress = 0;
  message = '';

  fileName = 'Select a doc1';
  fileName2 = 'Select a doc2';
  fileInfos: any;
  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialogdata: any, private compServices:CompaniesopService, private branchService:BranchesopsService,private dialogRef:MatDialogRef<DialogBranchesComponent>, private _snackbar:MatSnackBar) { }

  braPostData:Branches;
  companyList:Companiesdropdown[];
  selectedValue:any;  
  branchData = this.fb.group({
      id:[0],
      companyID:[0,Validators.required],
      branchName:['',Validators.required],
      contactNumber:['',Validators.required],
      trnNumber:['',Validators.required],
      contactPerson:['',Validators.required],
      createdTime:[new Date,Validators.required],
      updateTime:[new Date,Validators.required],
      doc1:[''],
      doc2:[''],
  })

  ngOnInit(): void {

    this.branchData.patchValue(this.dialogdata);
    this.selectedValue = this.branchData.value.companyID;
    this.compServices.getCompanies().subscribe(
      (data:any)=>{
        this.companyList = data.map(p=>({
          id:p.id,
          name:p.name
        }));
      }
    )

  }

  addBranches(){
    console.log(this.branchData);
    if(this.branchData.valid){
      var item = this.branchData.value;
      this.braPostData = {id:item.id,branchName:item.branchName,companyID:item.companyID,contactNumber:item.contactNumber,contactPerson:item.contactPerson,trnNumber:item.trnNumber,createdTime:item.createdTime,updateTime:new Date,doc1:item.doc1,doc2:item.doc2};
      if(this.dialogdata){
        this.branchService.updateBranch(this.braPostData.id,this.braPostData).subscribe({
          next:(data:any)=>{
           this._snackbar.open("Added Successfully!","OK");
           this.dialogRef.close(true);
            }
          })
      }
      else
      {            
      this.branchService.addBranch(this.braPostData).subscribe({
        next:(data:any)=>{
         this._snackbar.open("Added Successfully!","OK");
         this.dialogRef.close(true);
          }
        })
      }
    }
   
  }

  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    } else {
      this.fileName = 'Select File';
    }
  }
  
  upload(type:string): void {
    this.progress = 0;
    this.message = '';
    var brID = this.branchData.value.id;
    //console.log();
    if (this.currentFile) {
      this.branchService.upload(this.currentFile,brID,type).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            //this.fileInfos = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }

          this.currentFile = undefined;
        }
      );
    }
  }

}
