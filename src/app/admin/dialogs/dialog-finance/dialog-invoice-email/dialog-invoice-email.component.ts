import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-invoice-email',
  templateUrl: './dialog-invoice-email.component.html',
  styleUrls: ['./dialog-invoice-email.component.css']
})
export class DialogInvoiceEmailComponent implements OnInit {
  emailForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogInvoiceEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      invoiceNumber: string;
      companyName: string;
      companyEmail: string;
    }
  ) {
    this.emailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      cc: ['', [Validators.email]],
      subject: ['', [Validators.required]],
      message: ['']
    });
  }

  ngOnInit(): void {
    // Pre-fill form if company email is available
    if (this.data?.companyEmail) {
      this.emailForm.patchValue({
        to: this.data.companyEmail,
        subject: `Invoice ${this.data.invoiceNumber} - ${this.data.companyName}`,
        message: `Dear ${this.data.companyName},\n\nPlease find attached the invoice ${this.data.invoiceNumber}.\n\nBest regards,`
      });
    }
  }

  onSubmit(): void {
    if (this.emailForm.valid) {
      this.loading = true;
      const emailData = {
        ...this.emailForm.value,
        invoiceNumber: this.data.invoiceNumber
      };
      this.dialogRef.close(emailData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string): string {
    const control = this.emailForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }
} 