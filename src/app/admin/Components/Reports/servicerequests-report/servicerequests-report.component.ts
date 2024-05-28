import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BranchessDropdown } from 'src/app/models/Branches';
import { TicketsReportDropdownDTO } from 'src/app/models/PriorityLevels';
import { TableUtility } from 'src/app/models/TableUtility';
import { BranchesopsService } from 'src/app/service/branches/branchesops.service';
import { MachinesopService } from 'src/app/service/machines/machinesop.service';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';

@Component({
  selector: 'app-servicerequests-report',
  templateUrl: './servicerequests-report.component.html',
  styleUrls: ['./servicerequests-report.component.css']
})
export class ServicerequestsReportComponent implements OnInit {

  displayedColumns: string[] = ['id','No','subject','machine','technician','estimatedCompleteDate','requestedDate','completedDate','responsetime','priority','serviceStatus','requestType'];
  dataSource: any;  
  drps:TicketsReportDropdownDTO;
  selectedMachine:any;
  selectedBranch:any;
  selectedCompany:any;
  selectedRequestStatus:any;
  selectedTechnician:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) msort: MatSort;
  branchList:BranchessDropdown[];
  constructor(private fb:FormBuilder,private ticketServices: ServicerequestopService , private machineServices:MachinesopService, private branchService:BranchesopsService ) { }
  filterData= this.fb.group({
    machineId:[],
    branchId:[],
    companyId:[],
    serviceStatusID:[],
    technicianId:[]
  })
  ngOnInit(): void {
    this.getAllTickets();
    this.ticketServices.getReportDropdowns().subscribe(
      (data:any)=>{
        this.drps = data;      
        console.log(this.drps);  
      }
    )


  }

  getAllTickets(){
    this.ticketServices.getTickets().subscribe(
      (data:any)=>{
        //console.log(data);               
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.msort;
      }
    )
  }

  applyTableFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyCustomFilter(){
    console.log(this.filterData.value);
    var searchData = this.filterData.value;
    this.ticketServices.getTicketsFIltered(searchData.machineId,searchData.branchId,searchData.companyId,searchData.technicianId,searchData.serviceStatusID).subscribe(
      (data:any)=>{
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.msort;
      }
    )
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

  exportTable() {
    TableUtility.exportTableToExcel("rptrequesttbl");
  }

}
