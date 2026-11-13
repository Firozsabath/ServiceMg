import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticationserviceService } from 'src/app/service/auth/authenticationservice.service';

@Component({
  selector: 'app-headerbar',
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.css']
})
export class HeaderbarComponent implements OnInit {
  @Input() navigationOpen = true;
  @Output() open = new EventEmitter<boolean>();
  userEmailId = '';
  userRole = 'Workspace member';
  userInitial = 'U';
  homeRoute = '/user';
  logoutbtnHide = true;

  constructor(private authService: AuthenticationserviceService) { }

  ngOnInit(): void {
    this.logoutbtnHide = !localStorage.getItem('token');
    this.userEmailId = localStorage.getItem('userEmail') || '';
    this.userInitial = this.userEmailId.charAt(0).toUpperCase() || 'U';
    const role = localStorage.getItem('userRole');
    this.userRole = role === 'Admin' ? 'Administrator' : role === 'Technician' ? 'Technician' : 'Workspace member';
    this.homeRoute = role === 'Admin' ? '/admin/dashboard' : '/user';
  }

  clickMenu(): void {
    this.open.emit(true);
  }

  logout(): void {
    this.authService.logout();
  }
}
