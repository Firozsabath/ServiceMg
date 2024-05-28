import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-headerbar',
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.css']
})
export class HeaderbarComponent implements OnInit {

 
  logbtnHide = true;
  constructor() { }

  @Output()
  open: EventEmitter<boolean> = new EventEmitter()

  ngOnInit(): void {
  }

  clickMenu() {
    this.open.emit(true);
    //console.log(this.logbtnHide);
  }

  logout(){

  }
}
