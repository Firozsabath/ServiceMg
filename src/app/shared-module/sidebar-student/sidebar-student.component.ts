import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar-student',
  templateUrl: './sidebar-student.component.html',
  styleUrls: ['./sidebar-student.component.css']
})
export class SidebarStudentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() closeSideNav = new EventEmitter();

  panelOpenState = false;
  
  onToggleClose(){
    this.closeSideNav.emit();
    //console.log(this.closeSideNav.emit());
  }
}
