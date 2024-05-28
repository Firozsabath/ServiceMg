import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogVendorsComponent } from 'src/app/admin/dialogs/AppSettingsDialogs/dialog-vendors/dialog-vendors.component';
import { DialogConfirmBoxComponent } from 'src/app/admin/dialogs/dialog-confirm-box/dialog-confirm-box.component';
import { ConfirmDialogModel } from 'src/app/models/ConfirmDialogModel';
import { Vendors } from 'src/app/models/Vendors';
import { VendorsopService } from 'src/app/service/vendors/vendorsop.service';

@Component({
  selector: 'app-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: ['./vendors-list.component.css']
})
export class VendorsListComponent implements OnInit {

  displayedColumns:string[] = ["id","name","email","contctnum","contactname","address","Actions"];
  dataSource:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) msort: MatSort;
  constructor(private vendorService:VendorsopService, private dialog:MatDialog, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.getVendors();
  }

  getVendors(){
    this.vendorService.getVendors().subscribe(
      (data:any)=>{
        console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.msort;
      }
    )
  }

  addVendor(){    
    let dialogRef = this.dialog.open(DialogVendorsComponent,{width:"30vw"});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getVendors();
        }
      },
      error:(err)=>{}
    })
  }

  applyFilter(event:Event){

  }

  editVendor(us:Vendors){
    let dialogRef = this.dialog.open(DialogVendorsComponent,{width:"30vw",data:us});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getVendors();
        }
      },
      error:(err)=>{}
    })
  }

  deleteVendor(id:string){
    const message = `Are you sure you want to delete the company?`;
    var dialogData = new ConfirmDialogModel("Confirm Action",message);
    let diRef = this.dialog.open(DialogConfirmBoxComponent,{width:"25vw",data:dialogData})

    diRef.afterClosed().subscribe(res=>{
      if(res){
        this.vendorService.deleteVendor(id).subscribe({
          next:(val:any)=>{
            this._snackBar.open("Deleted Successfully!","Ok");
            this.getVendors();
          }
        })
      }
    })
  }

}
