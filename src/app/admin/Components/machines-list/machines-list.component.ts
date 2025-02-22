import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Branches, BranchessDropdown } from 'src/app/models/Branches';
import { Companies, Companiesdropdown } from 'src/app/models/Companies';
import { ConfirmDialogModel } from 'src/app/models/ConfirmDialogModel';
import { Machines, MachinesVM } from 'src/app/models/Machines';
import { BranchesopsService } from 'src/app/service/branches/branchesops.service';
import { MachinesopService } from 'src/app/service/machines/machinesop.service';
import { DialogConfirmBoxComponent } from '../../dialogs/dialog-confirm-box/dialog-confirm-box.component';
import { DialogMachinesComponent } from '../../dialogs/dialog-machines/dialog-machines.component';

@Component({
  selector: 'app-machines-list',
  templateUrl: './machines-list.component.html',
  styleUrls: ['./machines-list.component.css']
})
export class MachinesListComponent implements OnInit {

  displayedColumns: string[] = ['id','model','skuid','manufacturer','contractType','createddate','installationdate','contractenddate','Actions'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) msort: MatSort;

  constructor(private fb:FormBuilder, private machineServices:MachinesopService, private branchService:BranchesopsService, private dialog:MatDialog, private _snackBar:MatSnackBar) { }

  selectedCompany:any;
  selectedBranch:any;
  branchList:BranchessDropdown[];
  filteredBranch:any;
  machines:MachinesVM[];  
  machineData = this.fb.group({
    branchID:[Validators.required]
  })

  ngOnInit(): void {
    this.getAllMachines();

    this.branchService.getBranchListWithCompnay().subscribe(
      (data:any)=>{
        this.branchList = data;
        console.log(this.branchList);
        this.filteredBranch = [...this.branchList];
       
      }
    )   
  }

  updateFilteredBranches(filtered:any[]){
    this.filteredBranch = filtered;
  }

  getAllMachines(){
    this.machineServices.getMachines().subscribe(
      (data:any)=>{
        this.machines = data;        
        console.log(this.machines);
        this.dataSource = new MatTableDataSource(this.machines);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.msort;
      }
    );
  }

  onSearch(slBranch:any){
    //console.log(this.selectedBranch);
    if(this.selectedBranch == undefined){
      this.selectedBranch = 0;
    }
    this.machineServices.getMachineByBranch(this.selectedBranch).subscribe(
      (data:any)=>{
        this.machines = data;
        this.dataSource = new MatTableDataSource(this.machines);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.msort;
      }
    )
  }

  addBranch(){
    var dialofRef =  this.dialog.open(DialogMachinesComponent,{width:"40vw"});

    dialofRef.afterClosed().subscribe({
     next:(data:any)=>{
       if(data){
         this._snackBar.open("Added Successfull","OK");
         this.getAllMachines();
       }
     }
    })
  }

  editMachine(mach:any){
    var dialofRef =  this.dialog.open(DialogMachinesComponent,{width:"40vw", data:mach});

    dialofRef.afterClosed().subscribe({
     next:(data:any)=>{
       if(data){
         this._snackBar.open("Updated Successfull","OK");
         this.getAllMachines();
       }
     }
    })
  }

  deleteMachine(id:number){
    const message = `Are you sure you want to delete the machine?`;
    var dialogData = new ConfirmDialogModel("Confirm Action",message);
    let diRef = this.dialog.open(DialogConfirmBoxComponent,{width:"25vw",data:dialogData})

    diRef.afterClosed().subscribe(res=>{
      if(res){
        this.machineServices.deleteMachine(id).subscribe({
          next:(val:any)=>{
            this._snackBar.open("Deleted Successfully!","Ok");
            this.getAllMachines();
          }
        })
      }
    })
  }

}
