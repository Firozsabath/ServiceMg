import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogServiceRequestComponent } from 'src/app/admin/dialogs/dialog-service-request/dialog-service-request.component';
import { MachinesopService } from 'src/app/service/machines/machinesop.service';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';

@Component({
  selector: 'app-requestlist',
  templateUrl: './requestlist.component.html',
  styleUrls: ['./requestlist.component.css']
})
export class RequestlistComponent implements OnInit {

  displayedColumns: string[] = ['id','No','subject','machine','technician','estimatedCompleteDate','requestedDate','priority','serviceStatus','requestType','Actions'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) msort: MatSort;
  constructor(private fb:FormBuilder,private ticketServices: ServicerequestopService, private machineServices:MachinesopService, private dialog:MatDialog, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.getAllTickets();
  }

  getAllTickets(){
    this.ticketServices.getTicketByTechnician(1).subscribe(
      (data:any)=>{
        console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.msort;
      }
    )
  }


  addTicket(){
    let dialogRef = this.dialog.open(DialogServiceRequestComponent,{width:"30vw"});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getAllTickets();
        }
      },
      error:(err)=>{}
    })
  }

  editTicket(request:any){
    let dialogRef = this.dialog.open(DialogServiceRequestComponent,{width:"30vw",data:request});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getAllTickets();
        }
      },
      error:(err)=>{}
    })
  }


}
