import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    //HeaderComponent
    SharedModuleModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class AuthModule { }
