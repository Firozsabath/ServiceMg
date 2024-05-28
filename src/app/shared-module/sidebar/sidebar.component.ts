import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() closeSideNav = new EventEmitter();
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  panelOpenState = false;
  
  onToggleClose(){
    this.closeSideNav.emit();
    console.log(this.closeSideNav.emit());
  }

}
