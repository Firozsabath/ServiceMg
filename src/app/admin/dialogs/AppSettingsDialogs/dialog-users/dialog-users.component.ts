import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/User';
import { AuthenticationserviceService } from 'src/app/service/auth/authenticationservice.service';

@Component({
  selector: 'app-dialog-users',
  templateUrl: './dialog-users.component.html',
  styleUrls: ['./dialog-users.component.css']
})
export class DialogUsersComponent implements OnInit {

  user:User;
  userData:FormGroup;
  roles:any;
  selectedRole:any;
  isUpdate:boolean = false;
  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dialogdata: any,private authService: AuthenticationserviceService, private dialogRef:MatDialogRef<DialogUsersComponent>, private _snackbar:MatSnackBar) { 

    this.userData = this.fb.group({
      id:[''],
      email:['',[Validators.required,Validators.email]],
      username:['',Validators.required],
      role:['',Validators.required],
      password:['',Validators.required],
    })

  }

  ngOnInit(): void {
    debugger;
    this.userData.patchValue(this.dialogdata);
    if(this.dialogdata){
      this.isUpdate = true;
      if(this.dialogdata.role != ""){
        this.selectedRole = this.dialogdata.role;
      }      
    }   

    this.authService.getUserRoles().subscribe(
      (data:any)=>{
          this.roles = data;
      }
    )
  }

  addUser(){
    var usData = this.userData.value;
    if(this.userData.valid){
      this.user = new User(this.userData.value);
      // console.log(this.inventory);
       if(this.dialogdata){
         this.authService.updateUser(this.user).subscribe(
           (data:any)=>{
             this._snackbar.open("Updated Successfully!","OK");
             this.dialogRef.close(true);
           }
         )
   
       }else{
         this.authService.postUser(this.user).subscribe(
           (data:any)=>{
             this._snackbar.open("Created Successfully!","OK");
             this.dialogRef.close(true);
           }
         )
       }
    }  
   
  }

}
