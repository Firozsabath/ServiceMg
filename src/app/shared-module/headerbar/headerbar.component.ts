import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationserviceService } from 'src/app/service/auth/authenticationservice.service';

@Component({
  selector: 'app-headerbar',
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.css']
})
export class HeaderbarComponent implements OnInit {

  userEmailId :string;
  logoutbtnHide = true;
  constructor(private authService: AuthenticationserviceService, private _router: Router) { }

  @Output()
  open: EventEmitter<boolean> = new EventEmitter()

  ngOnInit(): void {
    debugger;
    var token = localStorage.getItem('token');
    this.userEmailId = localStorage.getItem('userEmail');
    if(token!=null){
      this.logoutbtnHide = false;
    }
  }

  clickMenu() {
    this.open.emit(true);
    //console.log(this.logbtnHide);
  }

  logout(){    
    this.authService.logout();    
  }
}
