import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Inventory } from '../models/Inventory';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminMainpageComponent } from './Components/admin-mainpage/admin-mainpage.component';
import { UsersListComponent } from './Components/AppSettings/users-list/users-list.component';
import { VendorsListComponent } from './Components/AppSettings/vendors-list/vendors-list.component';
import { BranchesListComponent } from './Components/branches-list/branches-list.component';
import { CompaniesListComponent } from './Components/companies-list/companies-list.component';
import { QuotationComponent } from './Components/Finance/quotation/quotation.component';
import { QuotationdisplayComponent } from './Components/Finance/quotationdisplay/quotationdisplay.component';
import { InventoryListComponent } from './Components/inventory-list/inventory-list.component';
import { MachinesListComponent } from './Components/machines-list/machines-list.component';
import { ServicerequestsReportComponent } from './Components/Reports/servicerequests-report/servicerequests-report.component';
import { ServicerequestComponent } from './Components/servicerequest/servicerequest.component';
import { ServicerequestsallComponent } from './Components/servicerequestsall/servicerequestsall.component';
import { TechniciansComponent } from './Components/technicians/technicians.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
     children:[
      {
          path: '',
          component: AdminMainpageComponent,
      },    
      {
        path: 'dashboard',
        component: AdminMainpageComponent,
      },   
      {
        path: 'companieslist',
        component: CompaniesListComponent,
      },      
      {
        path: 'techinicians',
        component: TechniciansComponent,
      },            
      {
        path: 'tickets',
        component: ServicerequestsallComponent,
      },
      {
        path: 'ticketView',
        component: ServicerequestComponent,
      },
      {
        path: 'machines',
        component: MachinesListComponent,
      },
      {
        path: 'branches',
        component: BranchesListComponent,
      },
      {
        path: 'inventory',
        component: InventoryListComponent,
      },
      {
        path: 'users',
        component: UsersListComponent,
      },
      {
        path: 'vendors',
        component: VendorsListComponent,
      },
      {
          path:'reports/servicerquests',
          component:ServicerequestsReportComponent
      },
      {
        path:'fin/quotation',
        component:QuotationComponent
      },
      {
        path:'fin/quotationview',
        component:QuotationdisplayComponent
      },
    ],    
  },
  // {
  //       path: 'companies',
  //       component: CompaniesListComponent,
  //     },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
