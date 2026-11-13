import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthenticationserviceService } from 'src/app/service/auth/authenticationservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  submitted = false;
  isSubmitting = false;
  errMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthenticationserviceService) { }

  Loginform = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  get Allcontrols() {
    return this.Loginform.controls;
  }

  OnSubmit(): void {
    if (this.isSubmitting) {
      return;
    }

    this.submitted = true;
    this.errMessage = '';
    if (this.Loginform.invalid) {
      this.Loginform.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.auth.getValidated(this.Loginform.value).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: (value: { token: string }) => this.auth.setSession(value.token),
      error: () => {
        this.errMessage = 'Unable to sign in. Check your credentials and try again. If the problem continues, contact your administrator.';
      }
    });
  }
}
