import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketsDropdownDTO } from 'src/app/models/PriorityLevels';
import { MachinesopService } from 'src/app/service/machines/machinesop.service';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';
import { TechnicianopsService } from 'src/app/service/technician/technicianops.service';

@Component({
  selector: 'app-dialog-requeststatusupdate',
  templateUrl: './dialog-requeststatusupdate.component.html',
  styleUrls: ['./dialog-requeststatusupdate.component.css']
})
export class DialogRequeststatusupdateComponent implements OnInit {

  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialogdata: any,private requestService: ServicerequestopService, 
  private machineService:MachinesopService,private techService: TechnicianopsService, private dialogRef:MatDialogRef<DialogRequeststatusupdateComponent>,
  private _snackbar:MatSnackBar) { }

  dropDowns: TicketsDropdownDTO;
  priorities:any;
  requestTypesList:any;
  statusesList:any;
  selectedRequestStatus:any;
  serviceID:any;
  requestData:FormGroup;
  ngOnInit(): void {    
    if(this.dialogdata.type == "status"){
      this.requestData = this.fb.group({
        serviceStatusID :[],
        technicianComment:[''],
        serviceID:[],
        technicianID:[]
      })

      if(localStorage.getItem('userId') != null){
        var techID:number = +localStorage.getItem('userId');
        this.requestData.get('technicianID').setValue(techID);
      }
      
      
      this.requestService.getDropdowns().subscribe(
        (data:any)=>{
          this.dropDowns = data;        
          this.priorities = this.dropDowns.priorities; 
          this.requestTypesList = this.dropDowns.requestTypes;
          this.statusesList = this.dropDowns.statuses;
        }
      ); 
      
    }else if(this.dialogdata.type == "respond"){
      this.requestData = this.fb.group({        
        respondMessage:[''],
        serviceID:[]
      })
    }
    if(this.dialogdata){
      this.serviceID = this.dialogdata.id;
      this.requestData.get('serviceID').setValue(this.serviceID);
    }
  }

  updateticketStatus(){
      console.log(this.requestData.value);
      if(this.dialogdata){
        if(this.dialogdata.type == 'status'){
          this.requestService.updateStatus(this.requestData.value.serviceID,this.requestData.value).subscribe(
            (data:any)=>{
              this._snackbar.open("Updated Successfully!","Ok");
                  this.dialogRef.close(true);
            }
          )
        }else if(this.dialogdata.type == 'respond'){
          this.requestService.resondRequest(this.requestData.value.serviceID,this.requestData.value).subscribe(
            (data:any)=>{
              this._snackbar.open("Updated Successfully!","Ok");
                  this.dialogRef.close(true);
            }
          )
        }
      }
      
  }

}
