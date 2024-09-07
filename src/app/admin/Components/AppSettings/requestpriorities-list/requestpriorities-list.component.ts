import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogServicerequestsprioritiesComponent } from 'src/app/admin/dialogs/AppSettingsDialogs/dialog-servicerequestspriorities/dialog-servicerequestspriorities.component';
import { DialogConfirmBoxComponent } from 'src/app/admin/dialogs/dialog-confirm-box/dialog-confirm-box.component';
import { ConfirmDialogModel } from 'src/app/models/ConfirmDialogModel';
import { RequestprioritiesopsService } from 'src/app/service/requestPriorities/requestprioritiesops.service';

@Component({
  selector: 'app-requestpriorities-list',
  templateUrl: './requestpriorities-list.component.html',
  styleUrls: ['./requestpriorities-list.component.css']
})
export class RequestprioritiesListComponent implements OnInit {

  rPriorityList:any;
  constructor(private requestPriorities: RequestprioritiesopsService, private dialog:MatDialog, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.getRequestPriorities();
  }

  getRequestPriorities(){
    this.requestPriorities.getItems().subscribe(
      (data)=>{
        this.rPriorityList = data;        
      }
    )
  }

  addrType(){
    let dialogRef = this.dialog.open(DialogServicerequestsprioritiesComponent,{width:"30vw"});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getRequestPriorities();
        }
      },
      error:(err)=>{}
    })
  }

  deleteRequestType(id:number){
    const message = `Are you sure you want to delete the request type?`;
    var dialogData = new ConfirmDialogModel("Confirm Action",message);
    let diRef = this.dialog.open(DialogConfirmBoxComponent,{width:"25vw",data:dialogData})

    diRef.afterClosed().subscribe(res=>{
      if(res){
        this.requestPriorities.deleteItem(id).subscribe({
          next:(val:any)=>{
            this._snackBar.open("Deleted Successfully!","Ok");
            this.getRequestPriorities();
          }
        })
      }
    })
  }

  editRequestType(rType:any){
    let dialogRef = this.dialog.open(DialogServicerequestsprioritiesComponent,{width:"30vw",data:rType});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getRequestPriorities();
        }
      },
      error:(err)=>{}
    })
  }

}
