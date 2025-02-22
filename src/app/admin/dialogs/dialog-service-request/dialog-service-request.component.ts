import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs';
import { PriorityLevels, TicketsDropdownDTO, TicketsReportDropdownDTO } from 'src/app/models/PriorityLevels';
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
  dropDowns: TicketsReportDropdownDTO;
  priorities:any;
  requestTypesList:any;
  statusesList:any;
  isPosting:Boolean = true;  
  selectedBranch:any;
  selectedCompany:any;
  companies:any;
  branches:any;
  showContrcatInfo:boolean = false;
  mcontractInfo:any;
  isContractExpired:boolean = false;
  //settings: EditorSettings;
  editorConfig={base_url:'/tinymce', suffix:'.min', plugins:'lists link image table wordcount'}
  selectedFiles: File[] = [];
  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialogdata: any,private requestService: ServicerequestopService, private machineService:MachinesopService,private techService: TechnicianopsService, private dialogRef:MatDialogRef<DialogServiceRequestComponent>, private _snackbar:MatSnackBar) { 

    // this.requestData.valueChanges.subscribe(
    //   values=>{
    //       this.updateCompletionDate();
    //   }
    // );
  }

  filteredCompanies:any[];
  filteredBranches:any[];
  filteredMachines:any[];

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
      this.selectedCompany = this.dialogdata.companyID;
      this.selectedBranch = this.dialogdata.branchID;
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
       //console.log(data);
       this.filteredMachines = [...this.machineList];
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

    this.requestService.getReportDropdowns().subscribe(
      (data:any)=>{
        this.dropDowns = data;        
        this.priorities = this.dropDowns.priorities; 
        this.requestTypesList = this.dropDowns.requestTypes;
        this.statusesList = this.dropDowns.statuses;
        this.branches = this.dropDowns.requestBranches;

        this.filteredCompanies = [...this.dropDowns.requestCompanies];
        this.filteredBranches = [...this.branches];
      }
    );

    
   
      //console.log(this.priorities);

  }

  requestData = this.fb.group({
    id:[0],
    machineID:['',Validators.required],
    companyID:[0,Validators.required],
    branchId:[0,Validators.required],
    technicianID:[Validators.required],
    requestedDate:[new Date(),Validators.required],
    //complatedDate:[Validators.required],
    estimatedCompleteDate:[new Date,Validators.required],
    description:['',Validators.required],
    subject:['',Validators.required],
    customerFeedback:[''],
    serviceTypeID:[Validators.required],
    priorityID:['',Validators.required],
    serviceStatusID:[Validators.required],
    requestID:[''],
    documents: [null]
  });

  get serviceControls() {return this.requestData.controls;}

  updateFilteredDrops(drpType:string, filtered: any[]) {
    if(drpType == 'companies'){
      this.filteredCompanies = filtered;
    }else if(drpType == 'machines'){
      this.filteredMachines = filtered;
    }else if(drpType == 'branches'){
      this.filteredBranches = filtered;
    }
  }

  addticketrequest(){
    debugger;
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
        const formData = new FormData();       
        formData.append('ID',this.requestData.get('id')?.value.toString());
        formData.append('MachineID',this.requestData.get('machineID')?.value || '0')
        formData.append('TechnicianID',this.requestData.get('technicianID')?.value || '')
        formData.append('RequestedDate', this.formatDate(this.requestData.get('requestedDate')?.value.toString()) || '')
        formData.append('ComplatedDate','')
        formData.append('EstimatedCompleteDate',this.formatDate(this.requestData.get('estimatedCompleteDate')?.value.toString()) || '')
        formData.append('Subject',this.requestData.get('subject')?.value || '')
        formData.append('Description',this.requestData.get('description')?.value || '')
        formData.append('CustomerFeedback',this.requestData.get('customerFeedback')?.value || '')
        formData.append('ServiceTypeID',this.requestData.get('serviceTypeID')?.value || '')
        formData.append('PriorityID',this.requestData.get('priorityID')?.value || '')
        formData.append('ServiceStatusID',this.requestData.get('serviceStatusID')?.value || '')
        formData.append('RespondTime','')
        formData.append('RespondedinHours','')
        formData.append('RespondMessage','')
        formData.append('TechnicianComment','')
        formData.append('RequestID',this.requestData.get('requestID')?.value || '')
        for (let file of this.selectedFiles) {
          formData.append('Documents', file, file.name);
        }

        this.requestService.postRequest(formData).subscribe(
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

  onFileSelected(event: any): void {
    if (event.target.files) {
      this.selectedFiles = Array.from(event.target.files);
      console.log(this.selectedFiles);
    }
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  onSelectCompany(companyID:any){
    //console.log(companyID.value);
    if(companyID.value == undefined){
      this.requestService.getReportDropdowns().subscribe(
        (data:any)=>{
          this.dropDowns = data;
          this.filteredBranches = this.dropDowns.requestBranches;
        }
      );
    }else{
      this.requestService.getReportDropdowns().subscribe(
        (data:any)=>{
          this.dropDowns = data;
          this.filteredBranches = this.dropDowns.requestBranches.filter((i)=>i.foreignID == companyID.value);
        }
      );
    }
    
  }

  onSelectBranches(branchID:any){
   if(branchID.value == undefined){
    this.machineService.getMachines().subscribe(
      (data:any)=>{
        this.filteredMachines = data;
      }
    );
   }else{
    this.machineService.getMachines().subscribe(
      (data:any)=>{
        this.filteredMachines = data.filter((p)=>p.branchID == branchID.value);
      }
    );
   }    

  }

  onSelectMachine(eve:any){
    const mID = eve.value;
    if(mID != null && mID != undefined){
      this.machineService.getContractBYMachine(mID).subscribe(
        (data:any)=>{
          this.mcontractInfo = data;
          if(this.mcontractInfo.id != 0){
            this.showContrcatInfo = true;
            var expdate = new Date(this.mcontractInfo.contractEndDate);
            var todayDate = new Date();
            if(expdate<todayDate){
                this.isContractExpired = true;
            }else{
              this.isContractExpired = false;
            }
          }
        }
      );
    }
    else{
      this.showContrcatInfo = false;
    }
  }



}
