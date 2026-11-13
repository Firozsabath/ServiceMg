import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  opened = true;
  isMobile = false;
  private destroyed = new Subject<void>();

  constructor(private breakpoints: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpoints.observe('(max-width: 960px)').pipe(takeUntil(this.destroyed)).subscribe(state => {
      this.isMobile = state.matches;
      this.opened = !state.matches;
    });
  }

  navOpen(): void {
    this.opened = !this.opened;
  }

  closeOnMobile(): void {
    if (this.isMobile) {
      this.opened = false;
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
