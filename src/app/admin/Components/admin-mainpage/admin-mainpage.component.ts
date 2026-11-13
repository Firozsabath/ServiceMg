import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-mainpage',
  templateUrl: './admin-mainpage.component.html',
  styleUrls: ['./admin-mainpage.component.css']
})
export class AdminMainpageComponent implements OnInit {
  // Date filter
  selectedDateRange: string = 'today';

  // Summary metrics
  pendingTickets: number = 0;
  pendingTicketsTrend: number = 0;
  resolvedToday: number = 0;
  resolvedTrend: number = 0;
  avgResponseTime: string = '0h';
  responseTimeTrend: number = 0;
  satisfactionRate: number = 0;
  satisfactionTrend: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Implement API calls to fetch dashboard data
    // For now using mock data
    this.pendingTickets = 24;
    this.pendingTicketsTrend = -5;
    this.resolvedToday = 12;
    this.resolvedTrend = 15;
    this.avgResponseTime = '2.5h';
    this.responseTimeTrend = -10;
    this.satisfactionRate = 92;
    this.satisfactionTrend = 3;
  }
}
