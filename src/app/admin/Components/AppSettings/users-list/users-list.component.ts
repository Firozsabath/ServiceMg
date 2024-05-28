import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogUsersComponent } from 'src/app/admin/dialogs/AppSettingsDialogs/dialog-users/dialog-users.component';
import { DialogConfirmBoxComponent } from 'src/app/admin/dialogs/dialog-confirm-box/dialog-confirm-box.component';
import { ConfirmDialogModel } from 'src/app/models/ConfirmDialogModel';
import { User } from 'src/app/models/User';
import { AuthenticationserviceService } from 'src/app/service/auth/authenticationservice.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  displayedColumns:string[] = ["id","username","email","role","password","Actions"];
  dataSource:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) msort: MatSort;
  constructor(private authService:AuthenticationserviceService, private dialog:MatDialog, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.authService.getUsers().subscribe(
      (data:any)=>{
        console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.msort;
      }
    )
  }

  addUser(){    
    let dialogRef = this.dialog.open(DialogUsersComponent,{width:"30vw"});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getUsers();
        }
      },
      error:(err)=>{}
    })
  }

  applyFilter(event:Event){

  }

  editUser(us:User){
    let dialogRef = this.dialog.open(DialogUsersComponent,{width:"30vw",data:us});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getUsers();
        }
      },
      error:(err)=>{}
    })
  }

  deleteUser(id:string){
    const message = `Are you sure you want to delete the company?`;
    var dialogData = new ConfirmDialogModel("Confirm Action",message);
    let diRef = this.dialog.open(DialogConfirmBoxComponent,{width:"25vw",data:dialogData})

    diRef.afterClosed().subscribe(res=>{
      if(res){
        this.authService.deleteUser(id).subscribe({
          next:(val:any)=>{
            this._snackBar.open("Deleted Successfully!","Ok");
            this.getUsers();
          }
        })
      }
    })
  }

}
