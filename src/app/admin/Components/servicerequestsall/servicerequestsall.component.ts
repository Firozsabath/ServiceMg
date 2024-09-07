import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogModel } from 'src/app/models/ConfirmDialogModel';
import { ServiceRequests, ServiceRequestsVM } from 'src/app/models/ServiceRequests';
import { MachinesopService } from 'src/app/service/machines/machinesop.service';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';
import { DialogConfirmBoxComponent } from '../../dialogs/dialog-confirm-box/dialog-confirm-box.component';
import { DialogServiceRequestComponent } from '../../dialogs/dialog-service-request/dialog-service-request.component';

@Component({
  selector: 'app-servicerequestsall',
  templateUrl: './servicerequestsall.component.html',
  styleUrls: ['./servicerequestsall.component.css']
})
export class ServicerequestsallComponent implements OnInit {

  constructor(private fb:FormBuilder,private ticketServices: ServicerequestopService , private machineServices:MachinesopService, private dialog:MatDialog, private _snackBar:MatSnackBar) { }
  displayedColumns: string[] = ['id','No','requestid','subject','machine','technician','estimatedCompleteDate','requestedDate','priority','serviceStatus','requestType','Actions'];
  dataSource: any;
  priorityBG:string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) msort: MatSort;

  ngOnInit(): void {
    this.getAllTickets();


  }
  

  getAllTickets(){
    this.ticketServices.getTickets().subscribe(
      (data:any)=>{
        console.log(data);
        this.priorityBG = data.priority=="Low"? "lowpriority" : data.priority=="High"? "highpriorioty":"";        
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.msort;
      }
    )
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addTicket(){
    let dialogRef = this.dialog.open(DialogServiceRequestComponent,{width:"60vw"});
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
    let dialogRef = this.dialog.open(DialogServiceRequestComponent,{width:"60vw",data:request});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getAllTickets();
        }
      },
      error:(err)=>{}
    })
  }

  deleteTicket(id:number){
    const message = `Are you sure you want to delete the ticket?`;
    var dialogData = new ConfirmDialogModel("Confirm Action",message);
    let diRef = this.dialog.open(DialogConfirmBoxComponent,{width:"25vw",data:dialogData})

    diRef.afterClosed().subscribe(res=>{
      if(res){
        this.ticketServices.deleteRequest(id).subscribe({
          next:(val:any)=>{
            this._snackBar.open("Deleted Successfully!","Ok");
            this.getAllTickets();
          }
        })
      }
    })
  }

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    alert(this.pageIndex);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

}
