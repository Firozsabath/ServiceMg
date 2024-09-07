import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialogModel } from 'src/app/models/ConfirmDialogModel';
import { ServiceParts } from 'src/app/models/ServiceParts';
import { ServiceRequestAttachments, ServiceRequests, ServiceRequestsVM, TechnicianNotesVM } from 'src/app/models/ServiceRequests';
import { ServicepartsopService } from 'src/app/service/serviceparts/servicepartsop.service';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';
import { environment } from 'src/environments/environment';
import { DialogConfirmBoxComponent } from '../../dialogs/dialog-confirm-box/dialog-confirm-box.component';
import { DialogPartsupdateComponent } from '../../dialogs/dialog-service-request/dialog-partsupdate/dialog-partsupdate.component';
import { DialogRequeststatusupdateComponent } from '../../dialogs/dialog-service-request/dialog-requeststatusupdate/dialog-requeststatusupdate.component';
import { DialogServiceRequestComponent } from '../../dialogs/dialog-service-request/dialog-service-request.component';
import { DialogServicepartsComponent } from '../../dialogs/dialog-service-request/dialog-serviceparts/dialog-serviceparts.component';

@Component({
  selector: 'app-servicerequest',
  templateUrl: './servicerequest.component.html',
  styleUrls: ['./servicerequest.component.css']
})
export class ServicerequestComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
    private ticketService:ServicerequestopService, private sParts:ServicepartsopService,
    private dialog:MatDialog, private _snackBar:MatSnackBar) { }

  ticketID:any;
  ticket:ServiceRequestsVM; 
  usedParts: ServiceParts[];
  technicianNotes: TechnicianNotesVM[];
  attachments:ServiceRequestAttachments[];
  displayedColumns: string[] = ['id','serviceid','partsid','quantity','Actions'];
  dataSource: any;
  panelOpenState:boolean=true;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.ticketID = params['ticketid'] || 0;
      //console     
      this.getTicketInfo(this.ticketID);
      this.getUsedPartsByService(this.ticketID); 
      //console.log(this.technicianNotes);
    });

    
  }

  getTicketInfo(id:number){
    this.ticketService.getTicketByID(id).subscribe({
      next:(data:any)=>{
        this.ticket = data;
        this.technicianNotes = data.notes;
        this.attachments = data.attachments;
        //console.log(this.technicianNotes);

        console.log(this.attachments);
      }
    })
  }
  getUsedPartsByService(id:number){
      this.sParts.getPartsBYService(id).subscribe(
        (data:any)=>{
          this.usedParts = data;
          this.dataSource = new MatTableDataSource(this.usedParts);
          //console.log(this.usedParts);
        }
      )
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

  onUpdateStatus(serviceid:number,Type:string){
    let dialogRef = this.dialog.open(DialogRequeststatusupdateComponent,{width:"30vw",data:{id:serviceid,type:Type}});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getTicketInfo(serviceid);
        }
      },
      error:(err)=>{}
    })
  }

  addUsedParts(data:any){
    let dialogRef = this.dialog.open(DialogServicepartsComponent,{width:"40vw",data:{id:data}});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          debugger;
          this.getUsedPartsByService(data);
        }
      },
      error:(err)=>{}
    })
  }
  editItem(data:any){
    let dialogRef = this.dialog.open(DialogPartsupdateComponent,{width:"30vw",data:data});
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getUsedPartsByService(data.serviceID);
        }
      },
      error:(err)=>{}
    })
  }
  deleteItem(id:number, serviceid:number){
    console.log(id);
    const message = `Are you sure you want to delete the machine?`;
    var dialogData = new ConfirmDialogModel("Confirm Action",message);
    let diRef = this.dialog.open(DialogConfirmBoxComponent,{width:"25vw",data:dialogData})

    diRef.afterClosed().subscribe(res=>{
      if(res){
        this.sParts.deleteParts(id).subscribe({
          next:(val:any)=>{
            this._snackBar.open("Deleted Successfully!","Ok");
            this.getUsedPartsByService(serviceid);
          }
        })
      }
    })
  }

  formatTimeDifference(timeString: string): string {
    if(timeString != null){
      const totalHours = parseFloat(timeString);

    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);
    const seconds = Math.floor((((totalHours - hours) * 60) - minutes) * 60);

    return `${hours} hours, ${minutes} minutes`;
    }
  }

  getImgUrl(url:string){
    var durl= environment.staticFileUrl //'https://localhost:7053/';
      return durl+url;
  }

}
