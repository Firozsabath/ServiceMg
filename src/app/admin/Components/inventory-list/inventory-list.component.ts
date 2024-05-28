import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Inventory } from 'src/app/models/Inventory';
import { InventoryopService } from 'src/app/service/inventory/inventoryop.service';
import { DialogInventoryComponent } from '../../dialogs/dialog-inventory/dialog-inventory.component';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {

  displayedColumns: string[] = ['id','name','skuid','manufacturer','vendor','quantity','unitcost','miscellanious','totalcost','createdDate','Actions'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) msort: MatSort;
  constructor(private inventoryservice:InventoryopService, private dialogP: MatDialog, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.getAllInventoryItems();
  }


  getAllInventoryItems(){
    this.inventoryservice.getItems().subscribe(
      (data:any)=>{
        this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.msort;
          console.log(data);
      }
    )
  }

  addItem(){
    var tech:Inventory;

    let dialogRef = this.dialogP.open(DialogInventoryComponent,{width:"30vw",data:tech});
  
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getAllInventoryItems();
        }
      },
      error:(err)=>{}
    });
  }

  applyFilter(event:Event){

  }

  editItem(data:any){
    let dialogRef = this.dialogP.open(DialogInventoryComponent,{width:"30vw",data:data});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getAllInventoryItems();
        }
      },
      error:(err)=>{}
    })
  }

  deleteItem(id:number){

  }

}
