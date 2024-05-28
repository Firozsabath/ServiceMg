import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderbarComponent } from './headerbar/headerbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from './sidebar/sidebar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { SidebarStudentComponent } from './sidebar-student/sidebar-student.component';
import {MatMenuModule} from '@angular/material/menu';
@NgModule({
  declarations: [
    HeaderbarComponent,
    SidebarComponent,
    SidebarStudentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatMenuModule
  ],
  exports:[
    HeaderbarComponent,
    SidebarComponent,
    SidebarStudentComponent
  ]
})
export class SharedModuleModule { }
