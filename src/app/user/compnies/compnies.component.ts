import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CompaniesopService } from 'src/app/service/companies/companiesop.service';

@Component({
  selector: 'app-compnies',
  templateUrl: './compnies.component.html',
  styleUrls: ['./compnies.component.css']
})
export class CompniesComponent implements OnInit {

  displayedColumns: string[] = ['id','name','contactPerson','email','createdDate'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) msort: MatSort;
  constructor(private companiesService: CompaniesopService) { }

  ngOnInit(): void {
    this.getCompanies();
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
  


}
