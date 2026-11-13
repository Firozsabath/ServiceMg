import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { AuthenticationserviceService } from 'src/app/service/auth/authenticationservice.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let response: Subject<{ token: string }>;
  let auth: jasmine.SpyObj<AuthenticationserviceService>;

  beforeEach(async () => {
    response = new Subject<{ token: string }>();
    auth = jasmine.createSpyObj('AuthenticationserviceService', ['getValidated', 'setSession']);
    auth.getValidated.and.returnValue(response.asObservable());
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: AuthenticationserviceService, useValue: auth }]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function fillCredentials(): void {
    component.Loginform.setValue({ username: 'test-technician', password: 'example-password' });
  }

  it('shows required field errors without calling the API for an empty form', () => {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(auth.getValidated).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('#username-error').textContent).toContain('enter your username');
    expect(fixture.nativeElement.querySelector('#password-error').textContent).toContain('enter your password');
  });

  it('submits credentials once while a request is pending and starts the returned session', () => {
    fillCredentials();
    component.OnSubmit();
    component.OnSubmit();
    fixture.detectChanges();
    expect(auth.getValidated).toHaveBeenCalledOnceWith({ username: 'test-technician', password: 'example-password' });
    expect(fixture.nativeElement.querySelector('.sign-in-button').disabled).toBeTrue();
    response.next({ token: 'test-token' });
    response.complete();
    expect(auth.setSession).toHaveBeenCalledOnceWith('test-token');
    expect(component.isSubmitting).toBeFalse();
  });

  it('keeps credentials and allows retry after a failed request', () => {
    fillCredentials();
    component.OnSubmit();
    response.error({ status: 401 });
    fixture.detectChanges();
    expect(auth.setSession).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Unable to sign in');
    expect(fixture.nativeElement.querySelector('.sign-in-button').disabled).toBeFalse();
    expect(component.Loginform.value.username).toBe('test-technician');
    response = new Subject<{ token: string }>();
    auth.getValidated.and.returnValue(response.asObservable());
    component.OnSubmit();
    expect(component.errMessage).toBe('');
    expect(auth.getValidated).toHaveBeenCalledTimes(2);
    response.complete();
  });

  it('toggles password visibility with an accessible button without submitting', () => {
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.password-toggle');
    const password: HTMLInputElement = fixture.nativeElement.querySelector('#password');
    expect(password.type).toBe('password');
    expect(toggle.getAttribute('aria-label')).toBe('Show password');
    toggle.click();
    fixture.detectChanges();
    expect(password.type).toBe('text');
    expect(toggle.getAttribute('aria-label')).toBe('Hide password');
    expect(auth.getValidated).not.toHaveBeenCalled();
  });
});
