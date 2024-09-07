import { Component } from '@angular/core';
import { AuthenticationserviceService } from './service/auth/authenticationservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ServiceManagement';

 
  constructor(private authService:AuthenticationserviceService) { 
    
  }

  ngOnInit(){   
      this.authService.autoLogin();    
  }

}
