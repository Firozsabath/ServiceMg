import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-student',
  templateUrl: './sidebar-student.component.html',
  styleUrls: ['./sidebar-student.component.css']
})
export class SidebarStudentComponent {
  constructor(public router: Router) { }

  get requestsActive(): boolean {
    const path = this.router.url.split(/[?#]/)[0];
    return path === '/user' || path === '/user/tickets' || path === '/user/ticketDetails';
  }

  @Output() closeSideNav = new EventEmitter<void>();
}
