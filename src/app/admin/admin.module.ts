import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminMainpageComponent } from './Components/admin-mainpage/admin-mainpage.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
//import { AdminMainpageComponent } from './components/admin-mainpage/admin-mainpage.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CompaniesListComponent } from './Components/companies-list/companies-list.component';
import { RouterModule } from '@angular/router';
import { TechniciansComponent } from './Components/technicians/technicians.component';
import { ServicerequestsallComponent } from './Components/servicerequestsall/servicerequestsall.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MachinesListComponent } from './Components/machines-list/machines-list.component';
import { BranchesListComponent } from './Components/branches-list/branches-list.component';
import {MatSelectModule} from '@angular/material/select';
import { DialogCompanyComponent } from './dialogs/dialog-company/dialog-company.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogTechnicianComponent } from './dialogs/dialog-technician/dialog-technician.component';
import { DialogBranchesComponent } from './dialogs/dialog-branches/dialog-branches.component';
import { DialogMachinesComponent } from './dialogs/dialog-machines/dialog-machines.component';
import { DialogConfirmBoxComponent } from './dialogs/dialog-confirm-box/dialog-confirm-box.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { DialogServiceRequestComponent } from './dialogs/dialog-service-request/dialog-service-request.component';
import { ServicerequestComponent } from './Components/servicerequest/servicerequest.component';
import { TicketsQuickViewComponent } from './Components/tickets-quick-view/tickets-quick-view.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { TicketsbycategoryComponent } from './Components/charts/ticketsbycategory/ticketsbycategory.component';
import { TicketsbystatusComponent } from './Components/charts/ticketsbystatus/ticketsbystatus.component';
import { MatSortModule } from '@angular/material/sort';
import { InventoryListComponent } from './Components/inventory-list/inventory-list.component';
import { DialogInventoryComponent } from './dialogs/dialog-inventory/dialog-inventory.component';
import { UsersListComponent } from './Components/AppSettings/users-list/users-list.component';
import { RequesttypeListComponent } from './Components/AppSettings/requesttype-list/requesttype-list.component';
import { RequestcategoriesListComponent } from './Components/AppSettings/requestcategories-list/requestcategories-list.component';
import { RequestprioritiesListComponent } from './Components/AppSettings/requestpriorities-list/requestpriorities-list.component';
import { DialogUsersComponent } from './dialogs/AppSettingsDialogs/dialog-users/dialog-users.component';
import { DialogServicerequestscategoriesComponent } from './dialogs/AppSettingsDialogs/dialog-servicerequestscategories/dialog-servicerequestscategories.component';
import { DialogServicerequeststypesComponent } from './dialogs/AppSettingsDialogs/dialog-servicerequeststypes/dialog-servicerequeststypes.component';
import { DialogServicerequestsprioritiesComponent } from './dialogs/AppSettingsDialogs/dialog-servicerequestspriorities/dialog-servicerequestspriorities.component';
import { DialogVendorsComponent } from './dialogs/AppSettingsDialogs/dialog-vendors/dialog-vendors.component';
import { VendorsListComponent } from './Components/AppSettings/vendors-list/vendors-list.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DialogServicepartsComponent } from './dialogs/dialog-service-request/dialog-serviceparts/dialog-serviceparts.component';
import { DialogPartsupdateComponent } from './dialogs/dialog-service-request/dialog-partsupdate/dialog-partsupdate.component';
import { DialogRequeststatusupdateComponent } from './dialogs/dialog-service-request/dialog-requeststatusupdate/dialog-requeststatusupdate.component';
import { ServicerequestsReportComponent } from './Components/Reports/servicerequests-report/servicerequests-report.component';
import { QuotationComponent } from './Components/Finance/quotation/quotation.component';
import { QuotationdisplayComponent } from './Components/Finance/quotationdisplay/quotationdisplay.component';
import { TicketsresponseviolationratioComponent } from './Components/charts/ticketsresponseviolationratio/ticketsresponseviolationratio.component';
@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminMainpageComponent,
    CompaniesListComponent,
    TechniciansComponent,
    ServicerequestsallComponent,
    MachinesListComponent,
    BranchesListComponent,
    DialogCompanyComponent,
    DialogTechnicianComponent,
    DialogBranchesComponent,
    DialogMachinesComponent,
    DialogConfirmBoxComponent,
    DialogServiceRequestComponent,
    ServicerequestComponent,
    TicketsQuickViewComponent,
    TicketsbycategoryComponent,
    TicketsbystatusComponent,
    InventoryListComponent,
    DialogInventoryComponent,
    UsersListComponent,
    RequesttypeListComponent,
    RequestcategoriesListComponent,
    RequestprioritiesListComponent,
    DialogUsersComponent,
    DialogServicerequestscategoriesComponent,
    DialogServicerequeststypesComponent,
    DialogServicerequestsprioritiesComponent,
    DialogVendorsComponent,
    VendorsListComponent,
    DialogServicepartsComponent,
    DialogPartsupdateComponent,
    DialogRequeststatusupdateComponent,
    ServicerequestsReportComponent,
    QuotationComponent,
    QuotationdisplayComponent,
    TicketsresponseviolationratioComponent
  ],
  imports: [    
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    SharedModuleModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,    
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxChartsModule,
    MatProgressBarModule
  ],
  providers:[
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ]
})
export class AdminModule { }
