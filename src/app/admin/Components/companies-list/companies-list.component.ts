import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Companies } from 'src/app/models/Companies';
import { ConfirmDialogModel } from 'src/app/models/ConfirmDialogModel';
import { TableUtility } from 'src/app/models/TableUtility';
import { CompaniesopService } from 'src/app/service/companies/companiesop.service';
import { DialogCompanyComponent } from '../../dialogs/dialog-company/dialog-company.component';
import { DialogConfirmBoxComponent } from '../../dialogs/dialog-confirm-box/dialog-confirm-box.component';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.css']
})
export class CompaniesListComponent implements OnInit {

  displayedColumns: string[] = ['id','name','contactPerson','email','createdDate','Actions'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) msort: MatSort;
  constructor(private companiesService: CompaniesopService, private dialog:MatDialog, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.getCompanies();
  }

  exportTable() {
    TableUtility.exportTableToExcel("tblCompanies");
  }

  getCompanies(){
    //debugger;
    this.companiesService.getCompanies().subscribe(
      (data:any)=>{
        console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.msort;
      });
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addCompany(){
    //var company:Companies;
    let dialogRef = this.dialog.open(DialogCompanyComponent,{width:"30vw"});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getCompanies();
        }
      },
      error:(err)=>{}
    })
  }

  editCompany(comp:any){   
    console.log(comp);
    let dialogRef = this.dialog.open(DialogCompanyComponent,{width:"30vw",data:comp});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getCompanies();
        }
      },
      error:(err)=>{}
    })
  }

  deleteCompany(id:number){
    const message = `Are you sure you want to delete the company?`;
    var dialogData = new ConfirmDialogModel("Confirm Action",message);
    let diRef = this.dialog.open(DialogConfirmBoxComponent,{width:"25vw",data:dialogData})

    diRef.afterClosed().subscribe(res=>{
      if(res){
        this.companiesService.deleteCompany(id).subscribe({
          next:(val:any)=>{
            this._snackBar.open("Updated Successfully!","Ok");
            this.getCompanies();
          }
        })
      }
    })

  }

}
