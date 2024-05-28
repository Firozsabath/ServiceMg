import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DialogServiceRequestComponent } from 'src/app/admin/dialogs/dialog-service-request/dialog-service-request.component';
import { ServiceRequestsVM } from 'src/app/models/ServiceRequests';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';

@Component({
  selector: 'app-ticketdetails',
  templateUrl: './ticketdetails.component.html',
  styleUrls: ['./ticketdetails.component.css']
})
export class TicketdetailsComponent implements OnInit {

  ticketID:any;
  ticket:ServiceRequestsVM;
  constructor(private route: ActivatedRoute, private ticketService:ServicerequestopService, private dialog:MatDialog, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.ticketID = params['ticketid'] || 0;      
    });

    this.getTicketInfo(this.ticketID);

  }

  getTicketInfo(id:number){
    this.ticketService.getTicketByID(id).subscribe({
      next:(data:any)=>{
        this.ticket = data;
        console.log(this.ticket);
      }
    })
  }

  onUpdate(request:any){   
    let dialogRef = this.dialog.open(DialogServiceRequestComponent,{width:"30vw",data:request});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getTicketInfo(request.id);
        }
      },
      error:(err)=>{}
    })
  }
}
