import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationserviceService } from 'src/app/service/auth/authenticationservice.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true
  submitted = false   
  errMessage: any;
  counter = ''; 
  constructor(private fb:FormBuilder, private _router:Router, private auth:AuthenticationserviceService) { }



  Loginform = this.fb.group({
    username:['',[Validators.required,Validators.email]],
    password:['',[Validators.required]],
  })

  get Allcontrols(){
    return this.Loginform.controls;
   }

  ngOnInit(): void {
  }

  OnSubmit(fd:any){
    this.submitted = true;
    if(this.Loginform.valid){
           
      this.auth.getValidated(this.Loginform.value).subscribe({
        next:(val:any)=>{
          console.log(val);
          this.counter = val.token;
            if(this.counter != null)
            {
              localStorage.setItem('token',this.counter);
              this._router.navigateByUrl('/admin/dashboard');
            }
        },
        error:(val:any)=>{
          //console.log(val);
          this.errMessage = "Incorrect UserName or Password!";
          console.log(val);
        }
      });
    }
  }

}
