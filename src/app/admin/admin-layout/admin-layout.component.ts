import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  opened = true;
  constructor() { }

  ngOnInit(): void {
  }
  

  navOpen($event): void {
    // toggle condition here
    this.opened = !this.opened;   
  }

}
