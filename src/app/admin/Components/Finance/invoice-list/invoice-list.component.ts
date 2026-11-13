import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogConfirmBoxComponent } from 'src/app/admin/dialogs/dialog-confirm-box/dialog-confirm-box.component';
import { DialogInvoiceStatusupdateComponent, InvoiceStatusDialogData } from 'src/app/admin/dialogs/dialog-finance/dialog-invoice-statusupdate/dialog-invoice-statusupdate.component';
import { DialogInvoiceEmailComponent } from '../../../dialogs/dialog-finance/dialog-invoice-email/dialog-invoice-email.component';
import { ConfirmDialogModel } from 'src/app/models/ConfirmDialogModel';
import { InvoiceOpService } from 'src/app/service/invoice/invoice-op.service';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'invoiceNumber', 'companyName', 'dateCreated', 'status', 'totalAmount', 'actions'];
  dataSource: MatTableDataSource<any>;
  isLoading = false;
  totalInvoices = 0;
  totalVatAmount = 0;
  totalAmount = 0;
  pendingInvoices = 0;
  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  readonly campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });

  constructor(
    private invoiceServices: InvoiceOpService,
    private route: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource();
    this.initFilterForm();
  }

  ngOnInit(): void {
    this.getInvoices();
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: ['']
    });
  }

  getInvoices() {
    this.isLoading = true;
    this.invoiceServices.getAllInvoices().subscribe({
      next: (response: any) => {
        this.dataSource.data = response.invoices || [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.updateStatistics(response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching invoices:', error);
        this._snackBar.open('Error loading invoices', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  updateStatistics(data: any) {
    this.totalInvoices = data.totalInvoiceCount || 0;
    this.totalVatAmount = data.totalInvoiceVat || 0;
    this.totalAmount = data.invoiceTotal || 0;
    this.pendingInvoices = data.pendingInvoices || 0;
  }

  applyFilter() {
    const formValues = this.filterForm.value;
    if (!formValues.fromDate || !formValues.toDate) {
      this._snackBar.open('Please select both start and end dates', 'Close', { duration: 3000 });
      return;
    }

    const startDate = formValues.fromDate.toISOString().split('T')[0];
    const endDate = formValues.toDate.toISOString().split('T')[0];

    this.isLoading = true;
    this.invoiceServices.getInvoicesByDate(startDate, endDate).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.invoices || [];
        this.updateStatistics(response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error filtering invoices:', error);
        this._snackBar.open('Error filtering invoices', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  clearFilter() {
    this.filterForm.reset();
    this.getInvoices();
    this._snackBar.open('Filter cleared', 'Close', { duration: 3000 });
  }

  addNewInvoice() {
    this.route.navigate(['/admin/fin/invoice-data-entry']);
  }

  downloadInvoice(invoice: any) {
    const downloadUrl = this.getImgUrl(invoice.filePath);
    window.open(downloadUrl, '_blank');
  }

  editInvoice(invoice: any) {
    this.route.navigate(['/admin/fin/invoice-data-entry', invoice.invoiceNumber]);
  }

  updateStatus(id: number, statusID: number, invoicenum: string) {
    const status: InvoiceStatusDialogData = {
      currentStatusId: statusID,
      invoiceId: id,
      invoiceNumber: invoicenum
    };
    
    const dialogRef = this.dialog.open(DialogInvoiceStatusupdateComponent, {
      width: "40vw",
      data: status
    });

    dialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this._snackBar.open("Status Updated Successfully", "OK", { duration: 3000 });
          this.getInvoices();
        }
      }
    });
  }

  deleteInvoice(invoice: any) {
    const message = `Are you sure you want to delete the invoice?`;
    var dialogData = new ConfirmDialogModel("Confirm Action", message);
    let diRef = this.dialog.open(DialogConfirmBoxComponent, { width: "25vw", data: dialogData })

    diRef.afterClosed().subscribe(res => {
      if (res) {
        this.isLoading = true;
        this.invoiceServices.deleteInvoice(invoice.id).subscribe({
          next: () => {
            this._snackBar.open("Updated Successfully!", "Ok");
            this.getInvoices();
          },
          error: (error) => {
            console.error('Error deleting invoice:', error);
            this._snackBar.open('Error deleting invoice', 'Close', { duration: 3000 });
            this.isLoading = false;
        }
      })
    }
  })
}

  getImgUrl(url: string) {
    var durl = environment.staticFileUrl //'https://localhost:7053/';
    return durl + url;
  }

  sendEmail(invoice: any) {
    const dialogRef = this.dialog.open(DialogInvoiceEmailComponent, {
      width: '500px',
      data: {
        invoiceNumber: invoice.invoiceNumber,
        companyName: invoice.companyName,
        companyEmail: invoice.companyEmail
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        const emailData = {
          invoiceId: invoice.id,
          to: result.to,
          cc: result.cc,
          subject: result.subject,
          message: result.message
        };

        this.invoiceServices.sendInvoiceEmail(emailData).subscribe({
          next: () => {
            this._snackBar.open('Invoice email sent successfully', 'Close', { duration: 3000 });
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error sending invoice email:', error);
            this._snackBar.open('Error sending invoice email', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
  }
}
