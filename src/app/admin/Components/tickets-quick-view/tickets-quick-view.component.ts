import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TechnicianopsService } from 'src/app/service/technician/technicianops.service';

@Component({
  selector: 'app-tickets-quick-view',
  templateUrl: './tickets-quick-view.component.html',
  styleUrls: ['./tickets-quick-view.component.css']
})
export class TicketsQuickViewComponent implements OnInit {

  displayedColumns: string[] = ['id','name','tickets','onhold','overdue'];
  dataSource: any;
  ticketDetails:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private techService:TechnicianopsService) { }

  ngOnInit(): void {
    this.getticketDetails();
  }

  getticketDetails(){
    this.techService.getTechnicianTickets().subscribe(
      (data:any)=>{       
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        //console.log(data);
      }
    )
  }

}
