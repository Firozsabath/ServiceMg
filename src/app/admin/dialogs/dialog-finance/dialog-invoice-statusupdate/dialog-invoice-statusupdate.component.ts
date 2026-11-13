import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceOpService } from 'src/app/service/invoice/invoice-op.service';

export interface InvoiceStatusDialogData {
  invoiceId: number;
  currentStatusId: number;
  invoiceNumber: string;
}

@Component({
  selector: 'app-dialog-invoice-statusupdate',
  templateUrl: './dialog-invoice-statusupdate.component.html',
  styleUrls: ['./dialog-invoice-statusupdate.component.css']
})

export class DialogInvoiceStatusupdateComponent implements OnInit {

  statusForm: FormGroup;
  statuses: any[] = [];
  isLoading = false;
  errorMessage = '';
  
  constructor(private fb:FormBuilder, private invoiceService:InvoiceOpService,
    public dialogRef: MatDialogRef<DialogInvoiceStatusupdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InvoiceStatusDialogData
    ) { }

  ngOnInit(): void {
    this.statusForm = this.fb.group({
      statusId: [this.data.currentStatusId, Validators.required],
      notes: ['']
    });

    this.loadStatuses();
  }

  loadStatuses(): void {
    this.isLoading = true;
    this.invoiceService.getInvoiceStatuses().subscribe(
      (data) => {
        this.statuses = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load statuses. Please try again.';
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.statusForm.valid) {
      this.isLoading = true;
      const statusUpdate = {
        invoiceStatusId: this.statusForm.value.statusId,
        invoiceID: this.data.invoiceId,
        updatedBy : localStorage.getItem('userEmail')

      };

      this.invoiceService.updateInvoiceStatus(this.data.invoiceId,statusUpdate).subscribe(
        (result) => {
          this.isLoading = false;
          this.dialogRef.close(result);
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to update status. Please try again.';
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
