import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Chart } from 'src/app/models/Chart';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';

@Component({
  selector: 'app-ticketsbystatus',
  templateUrl: './ticketsbystatus.component.html',
  styleUrls: ['./ticketsbystatus.component.css']
})
export class TicketsbystatusComponent implements OnInit {
  
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
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  showXAxisLabel = true;
  xAxisLabel = 'Statuses';
  showYAxisLabel = true;
  yAxisLabel = 'Ticket Count';
  timeline = true;
  doughnut = true;  
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#9370DB', '#87CEFA', '#910909', '#90EE90'],
  };
  //pie
  showLabels = true;    

  getDetails(){
    this.ticketService.getTicketsRatioByStatus().subscribe(
      (data:any)=>{
        this.dataset = data;
        console.log(this.dataset);
      }
    )
  }

  onSelect(event) {
    console.log(event);
  }

}
