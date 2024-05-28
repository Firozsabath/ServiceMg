import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Chart } from 'src/app/models/Chart';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';

@Component({
  selector: 'app-ticketsbycategory',
  templateUrl: './ticketsbycategory.component.html',
  styleUrls: ['./ticketsbycategory.component.css']
})
export class TicketsbycategoryComponent implements OnInit {

  view: [number, number] = [700, 300];
  dataset : Chart[];
  constructor(private ticketService:ServicerequestopService) {
    //this.view = [innerWidth / 1.3, 700];
   }

  ngOnInit(): void {
    this.getDetails();
  }
 
  multi: any[];

  
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Category';
  showYAxisLabel = true;
  yAxisLabel = 'Ticket Count';
  timeline = true;
  doughnut = true;  
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB'],
  };
  //pie
  showLabels = true;    

  getDetails(){
    this.ticketService.getTicketsByCategory().subscribe(
      (data:any)=>{
        this.dataset = data;
        //console.log(this.dataset);
      }
    )
  }

  onSelect(event) {
    console.log(event);
  }

  onResize(event) {
   // this.view = [event.target.innerWidth / 1.35, 400];
}
}
