import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGGuard } from '../guards/auth-g.guard';
import { Inventory } from '../models/Inventory';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminMainpageComponent } from './Components/admin-mainpage/admin-mainpage.component';
import { RequestcategoriesListComponent } from './Components/AppSettings/requestcategories-list/requestcategories-list.component';
import { RequestprioritiesListComponent } from './Components/AppSettings/requestpriorities-list/requestpriorities-list.component';
import { RequesttypeListComponent } from './Components/AppSettings/requesttype-list/requesttype-list.component';
import { UsersListComponent } from './Components/AppSettings/users-list/users-list.component';
import { VendorsListComponent } from './Components/AppSettings/vendors-list/vendors-list.component';
import { BranchesListComponent } from './Components/branches-list/branches-list.component';
import { CompaniesListComponent } from './Components/companies-list/companies-list.component';
import { InvoiceListComponent } from './Components/Finance/invoice-list/invoice-list.component';
import { InvoicePreviewComponent } from './Components/Finance/invoice-preview/invoice-preview.component';
import { InvoiceComponent } from './Components/Finance/invoice/invoice.component';
import { QuotationCreationComponent } from './Components/finance/quotation-creation/quotation-creation.component';
import { QuotationListComponent } from './components/finance/quotation-list/quotation-list.component';
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
    canActivate:[AuthGGuard],
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
        path: 'reqcategories',
        component: RequestcategoriesListComponent,
      },
      {
        path: 'reqTypes',
        component: RequesttypeListComponent,
      },
      {
        path: 'reqpriorities',
        component: RequestprioritiesListComponent,
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
      {
        path:'fin/invoicegen',
        component:InvoiceComponent
      },
      {
        path:'fin/allquots',
        component:QuotationListComponent
      },
      {
        path:'fin/invoicePreview',
        component:InvoicePreviewComponent
      },
      {
        path:'fin/allinvoices',
        component:InvoiceListComponent
      },
      {
        path:'fin/generateQuot',
        component:QuotationCreationComponent
      }
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
