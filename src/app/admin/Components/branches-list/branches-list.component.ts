import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Branches } from 'src/app/models/Branches';
import { Companiesdropdown } from 'src/app/models/Companies';
import { ConfirmDialogModel } from 'src/app/models/ConfirmDialogModel';
import { BranchesopsService } from 'src/app/service/branches/branchesops.service';
import { CompaniesopService } from 'src/app/service/companies/companiesop.service';
import { DialogBranchesComponent } from '../../dialogs/dialog-branches/dialog-branches.component';
import { DialogConfirmBoxComponent } from '../../dialogs/dialog-confirm-box/dialog-confirm-box.component';

@Component({
  selector: 'app-branches-list',
  templateUrl: './branches-list.component.html',
  styleUrls: ['./branches-list.component.css']
})
export class BranchesListComponent implements OnInit {

  branches: any;
  
  selectedValue:any;
  companyList:Companiesdropdown[];
  constructor(private branchService:BranchesopsService,private compServices:CompaniesopService, private fb:FormBuilder, private dialog:MatDialog, private _snackBar:MatSnackBar) { 
  } 
  Loginform = this.fb.group({
    compid:['',[Validators.required]]   
  })
  

  ngOnInit(): void {
    this.getAllBranches();

    this.compServices.getCompanies().subscribe(
      (data:any)=>{
        this.companyList = data.map(p=>({
          id:p.id,
          name:p.name
        }));
      }
    )
  }

  getAllBranches(){
    this.branchService.getBranches().subscribe(
      (data:any)=>{
        this.branches = data;
        //console.log(this.branches);
      }
    )
  }

  getBranchesbyCompany(id:number){
    this.branchService.getBranchByCompany(id).subscribe(
      (data:any)=>{
        this.branches = data;
      });
  }
  

  onSearch(){
    console.log(this.selectedValue);
    this.getBranchesbyCompany(this.selectedValue);
  }

  addBranch(){
     var dialofRef =  this.dialog.open(DialogBranchesComponent,{width:"40vw"});

     dialofRef.afterClosed().subscribe({
      next:(data:any)=>{
        if(data){
          this._snackBar.open("Added Successfull","OK");
          this.getAllBranches();
        }
      }
     })
  }

  editBranch(branch:any){
    var dialofRef =  this.dialog.open(DialogBranchesComponent,{width:"40vw",data:branch});

     dialofRef.afterClosed().subscribe({
      next:(data:any)=>{
        if(data){
          this._snackBar.open("Added Successfull","OK");
          this.getAllBranches();
        }
      }
     })
  }

  deleteBranch(id:number){
    const message = `Are you sure you want to delete this branch?`;
    var dialogData = new ConfirmDialogModel("Confirm Action",message);
    let diRef = this.dialog.open(DialogConfirmBoxComponent,{width:"25vw",data:dialogData})

    diRef.afterClosed().subscribe(res=>{
      if(res){
        this.branchService.deleteBranch(id).subscribe({
          next:(val:any)=>{
            this._snackBar.open("Updated Successfully!","Ok");
            this.getAllBranches();
          }
        })
      }
    })
  }

}
