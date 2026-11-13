import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';
import { AdminLayoutComponent } from '../admin/admin-layout/admin-layout.component';
import { UserLayoutComponent } from '../user/user-layout/user-layout.component';
import { AuthenticationserviceService } from '../service/auth/authenticationservice.service';
import { HeaderbarComponent } from './headerbar/headerbar.component';
import { SidebarStudentComponent } from './sidebar-student/sidebar-student.component';
import { SharedModuleModule } from './shared-module.module';

@Component({ template: '' })
class RoutePlaceholderComponent { }

describe('Workspace navigation', () => {
  let viewport: BehaviorSubject<BreakpointState>;
  let auth: jasmine.SpyObj<AuthenticationserviceService>;
  let role: string;

  beforeEach(async () => {
    viewport = new BehaviorSubject<BreakpointState>({ matches: false, breakpoints: {} });
    auth = jasmine.createSpyObj('AuthenticationserviceService', ['logout']);
    role = 'Admin';
    spyOn(Storage.prototype, 'getItem').and.callFake((key: string) => {
      if (key === 'token') { return 'example-session'; }
      if (key === 'userEmail') { return 'member@example.test'; }
      if (key === 'userRole') { return role; }
      return null;
    });
    await TestBed.configureTestingModule({
      declarations: [AdminLayoutComponent, UserLayoutComponent, RoutePlaceholderComponent],
      imports: [SharedModuleModule, MatSidenavModule, NoopAnimationsModule, RouterTestingModule.withRoutes([
        { path: '**', component: RoutePlaceholderComponent }
      ])],
      providers: [
        { provide: BreakpointObserver, useValue: { observe: () => viewport.asObservable() } },
        { provide: AuthenticationserviceService, useValue: auth }
      ]
    }).compileComponents();
  });

  for (const layout of [AdminLayoutComponent, UserLayoutComponent]) {
    describe(layout.name, () => {
      let fixture: ComponentFixture<AdminLayoutComponent | UserLayoutComponent>;

      function create(mobile = false): MatSidenav {
        viewport.next({ matches: mobile, breakpoints: {} });
        fixture = TestBed.createComponent<AdminLayoutComponent | UserLayoutComponent>(layout);
        fixture.detectChanges();
        return fixture.debugElement.query(By.directive(MatSidenav)).componentInstance;
      }

      it('keeps desktop navigation available and connects the header toggle', () => {
        const sidenav = create();
        expect(sidenav.mode).toBe('side');
        expect(sidenav.opened).toBeTrue();
        fixture.nativeElement.querySelector('.navigation-toggle').click();
        fixture.detectChanges();
        expect(sidenav.opened).toBeFalse();
        expect(fixture.nativeElement.querySelector('.navigation-toggle').getAttribute('aria-expanded')).toBe('false');
      });

      it('opens mobile navigation as an overlay and closes it after selecting a link', async () => {
        const sidenav = create(true);
        expect(sidenav.mode).toBe('over');
        expect(sidenav.opened).toBeFalse();
        fixture.nativeElement.querySelector('.navigation-toggle').click();
        fixture.detectChanges();
        expect(sidenav.opened).toBeTrue();
        fixture.nativeElement.querySelector('.workspace-navigation a').click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(sidenav.opened).toBeFalse();
      });

      it('keeps desktop navigation open on selection and updates when the viewport changes', async () => {
        const sidenav = create();
        fixture.nativeElement.querySelector('.workspace-navigation a').click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(sidenav.opened).toBeTrue();
        viewport.next({ matches: true, breakpoints: {} });
        fixture.detectChanges();
        expect(sidenav.mode).toBe('over');
        expect(sidenav.opened).toBeFalse();
      });
    });
  }

  it('keeps account identity and sign out available in the lightweight header', () => {
    const fixture = TestBed.createComponent(HeaderbarComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.account-name').textContent).toContain('member@example.test');
    expect(fixture.nativeElement.querySelector('.account-role').textContent).toContain('Administrator');
    expect(fixture.nativeElement.querySelector('.workspace-brand').getAttribute('href')).toBe('/admin/dashboard');
    fixture.nativeElement.querySelector('.logout-button').click();
    expect(auth.logout).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });

  it('sends technician home navigation to the technician workspace', () => {
    role = 'Technician';
    const fixture = TestBed.createComponent(HeaderbarComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.workspace-brand').getAttribute('href')).toBe('/user');
    expect(fixture.nativeElement.querySelector('.account-role').textContent).toContain('Technician');
  });

  it('highlights technician requests for root, list, and ticket detail routes without highlighting companies', async () => {
    const fixture = TestBed.createComponent(SidebarStudentComponent);
    const router = TestBed.inject(Router);
    for (const path of ['/user', '/user/tickets', '/user/ticketDetails?id=42']) {
      await fixture.ngZone.run(() => router.navigateByUrl(path));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('a').classList.contains('nav-active')).toBeTrue();
    }
    await fixture.ngZone.run(() => router.navigateByUrl('/user/companies'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a').classList.contains('nav-active')).toBeFalse();
  });
});
