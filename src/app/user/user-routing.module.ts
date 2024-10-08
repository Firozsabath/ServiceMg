import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompniesComponent } from './compnies/compnies.component';
import { RequestlistComponent } from './requestlist/requestlist.component';
import { TicketdetailsComponent } from './ticketdetails/ticketdetails.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
     children:[
      {
          path: '',
          component: RequestlistComponent,
      },
      {
        path: 'tickets',
        component: RequestlistComponent,
      },
      {
        path:'ticketDetails',
        component: TicketdetailsComponent
      },
      {
        path:'companies',
        component:CompniesComponent
      }    
    ],    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
