import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogModel } from 'src/app/models/ConfirmDialogModel';
import { Technicians } from 'src/app/models/Technicians';
import { TechnicianopsService } from 'src/app/service/technician/technicianops.service';
import { DialogCompanyComponent } from '../../dialogs/dialog-company/dialog-company.component';
import { DialogConfirmBoxComponent } from '../../dialogs/dialog-confirm-box/dialog-confirm-box.component';
import { DialogTechnicianComponent } from '../../dialogs/dialog-technician/dialog-technician.component';

@Component({
  selector: 'app-technicians',
  templateUrl: './technicians.component.html',
  styleUrls: ['./technicians.component.css']
})
export class TechniciansComponent implements OnInit {

  displayedColumns: string[] = ['id','name','position','email','createdDate','Actions'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) msort: MatSort;
  constructor(private techServcies: TechnicianopsService, private dialogP: MatDialog, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.getTechnicians();
  }

  getTechnicians(){
      this.techServcies.getTechnicians().subscribe(
        (data:any)=>{
          console.log(data);
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.msort;
        }
      )
  }

  addtechnicians(){

    var tech:Technicians;

    let dialogRef = this.dialogP.open(DialogTechnicianComponent,{width:"30vw",data:tech});
  
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getTechnicians();
        }
      },
      error:(err)=>{}
    });
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editTechnician(data:any){
    let dialogRef = this.dialogP.open(DialogTechnicianComponent,{width:"30vw",data:data});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getTechnicians();
        }
      },
      error:(err)=>{}
    })
  }

  deleteTechnician(id:number){
    const message = `Are you sure you want to delete the machine?`;
    var dialogData = new ConfirmDialogModel("Confirm Action",message);
    let diRef = this.dialogP.open(DialogConfirmBoxComponent,{width:"25vw",data:dialogData})

    diRef.afterClosed().subscribe(res=>{
      if(res){
        this.techServcies.deleteTechnician(id).subscribe({
          next:(val:any)=>{
            this._snackBar.open("Deleted Successfully!","Ok");
            this.getTechnicians();
          }
        })
      }
    })
  }

}
