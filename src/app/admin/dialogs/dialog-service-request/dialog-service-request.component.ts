import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs';
import { PriorityLevels, TicketsDropdownDTO } from 'src/app/models/PriorityLevels';
import { MachinesopService } from 'src/app/service/machines/machinesop.service';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';
import { TechnicianopsService } from 'src/app/service/technician/technicianops.service';

@Component({
  selector: 'app-dialog-service-request',
  templateUrl: './dialog-service-request.component.html',
  styleUrls: ['./dialog-service-request.component.css']
})
export class DialogServiceRequestComponent implements OnInit {

  machineList:any;
  selectMachine:any;
  selectedTechnician:any;
  selectedPriority:any;
  selectedRequestTypes:any;
  selectedRequestStatus:any;
  technicianList:any;
  dropDowns: TicketsDropdownDTO;
  priorities:any;
  requestTypesList:any;
  statusesList:any;
  isPosting:Boolean = true;
  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialogdata: any,private requestService: ServicerequestopService, private machineService:MachinesopService,private techService: TechnicianopsService, private dialogRef:MatDialogRef<DialogServiceRequestComponent>, private _snackbar:MatSnackBar) { 

    // this.requestData.valueChanges.subscribe(
    //   values=>{
    //       this.updateCompletionDate();
    //   }
    // );
  }

  ngOnInit(): void {
    //debugger;   
    this.requestData.patchValue(this.dialogdata);
    if(this.dialogdata){
      //this.dialogdata.machineID = true ? this.selectMachine = this.dialogdata.machineID : "";
      this.selectMachine = this.dialogdata.machineID;
      this.selectedTechnician = this.dialogdata.technicianID;
      this.selectedPriority = this.dialogdata.priorityID;
      this.selectedRequestTypes = this.dialogdata.serviceTypeID;
      this.selectedRequestStatus = this.dialogdata.serviceStatusID;
      this.isPosting = false;
    }

    this.requestData.valueChanges.pipe(debounceTime(300)).subscribe(
      values=>{
          this.updateCompletionDate();
      }
    );
   

    this.machineService.getMachines().subscribe(
      (data:any)=>{
        this.machineList = data.map(p=>({
          id:p.id,
          name:p.name+'-'+p.branchName
        }));
      }
    )

    this.techService.getTechnicians().subscribe(
      (data:any)=>{
        this.technicianList = data.map(p=>({
          id:p.id,
          name:p.name
        }));
      }
    )

    this.requestService.getDropdowns().subscribe(
      (data:any)=>{
        this.dropDowns = data;        
        this.priorities = this.dropDowns.priorities; 
        this.requestTypesList = this.dropDowns.requestTypes;
        this.statusesList = this.dropDowns.statuses;
      }
    );

    
   
      //console.log(this.priorities);

  }

  requestData = this.fb.group({
    id:[0],
    machineID:[Validators.required],
    technicianID:[Validators.required],
    requestedDate:[new Date(),Validators.required],
    complatedDate:[Validators.required],
    estimatedCompleteDate:[new Date,Validators.required],
    description:['',Validators.required],
    subject:['',Validators.required],
    customerFeedback:['',Validators.required],
    serviceTypeID:[Validators.required],
    priorityID:[Validators.required],
    serviceStatusID:[Validators.required],
  });

  get serviceControls() {return this.requestData.controls;}

  addticketrequest(){
    //debugger;
    console.log(this.requestData.value);
    if(this.requestData.valid){
      if(this.dialogdata){
        this.requestService.updateRequest(this.requestData.value.id,this.requestData.value).subscribe(
          (data:any)=>{
            this._snackbar.open("Updated Successfully!","Ok");
                this.dialogRef.close(true);
          }
        )
      }
      else{
        this.requestService.postRequest(this.requestData.value).subscribe(
          (data:any)=>{
            this._snackbar.open("Created Successfully!","Ok");
                this.dialogRef.close(true);
          }
        )
      }
    }    
  }

  updateCompletionDate(){
    var uc = Number(this.requestData.get('priorityID').value);
    var date = new Date;
    if(uc == 3){
      date.setDate(date.getDate()+1)
    }
    if(uc == 2){
      date.setDate(date.getDate()+2)
    }
    if(uc == 1){
      date.setDate(date.getDate()+3)
    }   
    
    this.requestData.get('estimatedCompleteDate').patchValue(date);    
  }

}
