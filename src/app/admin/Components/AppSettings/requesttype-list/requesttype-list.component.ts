import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogServicerequeststypesComponent } from 'src/app/admin/dialogs/AppSettingsDialogs/dialog-servicerequeststypes/dialog-servicerequeststypes.component';
import { DialogConfirmBoxComponent } from 'src/app/admin/dialogs/dialog-confirm-box/dialog-confirm-box.component';
import { ConfirmDialogModel } from 'src/app/models/ConfirmDialogModel';
import { ReuquestTypeOpsService } from 'src/app/service/requestTypes/reuquest-type-ops.service';

@Component({
  selector: 'app-requesttype-list',
  templateUrl: './requesttype-list.component.html',
  styleUrls: ['./requesttype-list.component.css']
})
export class RequesttypeListComponent implements OnInit {

  rTypeList:any;
  constructor(private requestTypes: ReuquestTypeOpsService, private dialog:MatDialog, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.getRequestTypes();
  }

  getRequestTypes(){
    this.requestTypes.getItems().subscribe(
      (data)=>{
        this.rTypeList = data;
        //console.log(this.rTypeList);
      }
    )
  }

  addrType(){
    let dialogRef = this.dialog.open(DialogServicerequeststypesComponent,{width:"30vw"});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getRequestTypes();
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
        this.requestTypes.deleteItem(id).subscribe({
          next:(val:any)=>{
            this._snackBar.open("Deleted Successfully!","Ok");
            this.getRequestTypes();
          }
        })
      }
    })
  }

  editRequestType(rType:any){
    let dialogRef = this.dialog.open(DialogServicerequeststypesComponent,{width:"30vw",data:rType});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getRequestTypes();
        }
      },
      error:(err)=>{}
    })
  }
}
