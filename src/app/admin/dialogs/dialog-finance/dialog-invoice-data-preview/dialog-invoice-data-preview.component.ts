import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { InvoiceOpService } from 'src/app/service/invoice/invoice-op.service';

@Component({
  selector: 'app-dialog-invoice-data-preview',
  templateUrl: './dialog-invoice-data-preview.component.html',
  styleUrls: ['./dialog-invoice-data-preview.component.css']
})
export class DialogInvoiceDataPreviewComponent implements OnInit {
  invoice: any;
  invoiceItems: any[] = [];
  userEmailId: string;
  isLoading: boolean = false;
  isPreviewOnly: boolean = false;
  isProcessingData: boolean = false;
  invoiceData: any;

  constructor(
    private dialogRef: MatDialogRef<DialogInvoiceDataPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private invoiceService: InvoiceOpService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userEmailId = localStorage.getItem('userEmail');
    this.isPreviewOnly = this.data?.isPreviewOnly || false;
    this.isLoading = true;
    
    if (this.data && this.data.invoiceData) {
      this.invoice = this.data.invoiceData;
      this.processInvoiceData();
    } else {
      this.invoiceService.currentInvoice.subscribe(
        (inv: any) => {
          this.invoice = inv;
          this.processInvoiceData();
        }
      );
    }
  }

  processInvoiceData(): void {
    debugger;
    this._snackBar.open("Processing invoice data...", "", { duration: 0 });
    this.isProcessingData = true;
    
    this.invoiceService.getInvoiceInfo(this.invoice).subscribe({
      next: (data: any) => {
        this._snackBar.dismiss();
        this.invoiceData = data;
         
        if (!this.invoiceData.quotationNum && this.invoiceData.counter) {
          this.invoiceData.quotationNum = this.generateUniqueNumber(this.invoiceData.counter);
        }
        
        if (this.invoiceData.quotationItems) {
          this.invoiceItems = this.invoiceData.quotationItems;
        } else {
          this.invoiceItems = [];
          this.invoiceData.invoiceItems = [];
        }
        
        this.invoice = this.invoiceData;
        
        console.log('Processed invoice data:', this.invoiceData);
        this.isLoading = false;
        this.isProcessingData = false;
      },
      error: (error) => {
        this._snackBar.open("Error processing invoice data", "OK");
        console.error('Error processing invoice:', error);
        this.isLoading = false;
        this.isProcessingData = false;
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  downloadInvoicePDF(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    if (this.isPreviewOnly) {
      this.saveAndGeneratePDF();
    } else {
      this.generatePdf();
    }
  }

  async saveAndGeneratePDF(): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const content = document.getElementById('invoice-preview');

      if (!content) {
        this._snackBar.open("No content to generate PDF", "OK");
        this.isLoading = false;
        return;
      }

      const canvas = await html2canvas(content, {
        scale: 3,
        useCORS: true,
        logging: true,
        scrollY: -window.scrollY
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.75);

      let imgWidth = pageWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pageHeight) {
        imgWidth = (canvas.width * pageHeight) / canvas.height;
        imgHeight = pageHeight;
      }

      const x = (pageWidth - imgWidth) / 2;
      const y = 0;

      pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');

      const pdfBlob = pdf.output('blob');
      const formData = new FormData();

      formData.append('file', pdfBlob, `invoice_${this.invoiceData.quotationNum}.pdf`);

      this.invoiceData.createdUser = this.userEmailId;
      this.invoiceData.quotID = this.data?.quotID;

      formData.append('invoice', JSON.stringify(this.invoiceData));

      this.invoiceService.postInvoice(formData).subscribe({
        next: (response) => {
          this._snackBar.open("Invoice saved successfully", "OK");
          pdf.save(`invoice_${this.invoiceData.quotationNum}.pdf`);
          this.dialogRef.close({ saved: true });
          this.isLoading = false;
        },
        error: (error) => {
          this._snackBar.open("Error saving invoice", "OK");
          console.error('Error saving invoice:', error);
          this.isLoading = false;
        }
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      this._snackBar.open("Error generating PDF", "OK");
      this.isLoading = false;
    }
  }

  generatePdf = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const content = document.getElementById('invoice-preview');

      if (!content) {
        this._snackBar.open("No content to generate PDF", "OK");
        this.isLoading = false;
        return;
      }

      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: true,
        scrollY: -window.scrollY
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.75);

      let imgWidth = pageWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pageHeight) {
        imgWidth = (canvas.width * pageHeight) / canvas.height;
        imgHeight = pageHeight;
      }

      const x = (pageWidth - imgWidth) / 2;
      const y = 0;

      pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');

      const filename = this.invoiceData.invoiceNum ? 
        `inv_${this.invoiceData.invoiceNum}.pdf` : 
        `invoice_${new Date().getTime()}.pdf`;

      pdf.save(filename);

      this._snackBar.open("PDF generated successfully", "OK");
      this.isLoading = false;
      
      this.dialogRef.close();
    } catch (error) {
      console.error('Error generating PDF:', error);
      this._snackBar.open("Error generating PDF", "OK");
      this.isLoading = false;
    }
  };

  generateUniqueNumber(num: any): string {
    const year = new Date().getFullYear().toString();
    let month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    return 'Inv-' + year + '-' + month + '-' + num.toString();
  }

  convertNumberToWords(amount: number): string {
    if (!amount) return '';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const numToWords = (num: number): string => {
      if (num < 20) return ones[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
      if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numToWords(num % 100) : '');
      if (num < 100000) return numToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numToWords(num % 1000) : '');
      if (num < 10000000) return numToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numToWords(num % 100000) : '');
      return numToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numToWords(num % 10000000) : '');
    };
    
    const wholePart = Math.floor(amount);
    const decimalPart = Math.round((amount - wholePart) * 100);
    
    let result = numToWords(wholePart) + ' Dirhams';
    if (decimalPart > 0) {
      result += ' and ' + numToWords(decimalPart) + ' Fils';
    }
    
    return result;
  }
} 