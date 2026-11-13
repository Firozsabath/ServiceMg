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
  displayedColumns: string[] = [
    'requestid',
    'subject',
    'company',
    'technician',
    'priority',
    'requestType',
    'serviceStatus',
    'estimatedCompleteDate',
    'requestedDate',
    'Actions'
  ];
  dataSource: any;
  priorityBG:string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) msort: MatSort;

  ngOnInit(): void {
    this.getAllTickets();


  }
  

  getAllTickets() {
    this.ticketServices.getTickets().subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data || []);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.msort;
      },
      error: (error) => {
        this._snackBar.open('Error loading service requests', 'Close', { duration: 3000 });
        console.error('Error loading service requests:', error);
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }

  applyFilter(event: Event) {
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

    //alert(this.pageIndex);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  getPendingRequests(): number {
    return this.dataSource.data.filter(request => 
      request.serviceStatus === 'Pending' || 
      request.serviceStatus === 'In Progress'
    ).length;
  }

  getHighPriorityRequests(): number {
    return this.dataSource.data.filter(request => 
      request.priority === 'High'
    ).length;
  }

  getCompletedRequests(): number {
    return this.dataSource.data.filter(request => 
      request.serviceStatus === 'Completed'
    ).length;
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'High': return 'priority_high';
      case 'Medium': return 'priority';
      case 'Low': return 'low_priority';
      default: return 'priority';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'New': return 'fiber_new';
      case 'In Progress': return 'pending';
      case 'Completed': return 'task_alt';
      case 'Cancelled': return 'cancel';
      default: return 'help';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'New': return 'status-new';
      case 'In Progress': return 'status-in-progress';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  isOverdue(date: string): boolean {
    if (!date) return false;
    const dueDate = new Date(date);
    const today = new Date();
    return dueDate < today;
  }

  clearFilter(input: HTMLInputElement): void {
    input.value = '';
    const event = new Event('keyup');
    input.dispatchEvent(event);
  }

}
