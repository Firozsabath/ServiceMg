import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TechnicianopsService } from 'src/app/service/technician/technicianops.service';

@Component({
  selector: 'app-ticketsresponseviolationratio',
  templateUrl: './ticketsresponseviolationratio.component.html',
  styleUrls: ['./ticketsresponseviolationratio.component.css']
})
export class TicketsresponseviolationratioComponent implements OnInit {

  displayedColumns: string[] = ['id','name','tickets','responseviolations'];
  dataSource: any;
  ticketDetails:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private techService:TechnicianopsService) { }

  ngOnInit(): void {
    this.getticketDetails();
  }

  getticketDetails(){
    this.techService.getResponseViolationByTechnicians().subscribe(
      (data:any)=>{       
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        //console.log(data);
      }
    )
  }

}
