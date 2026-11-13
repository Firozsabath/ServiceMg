import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QuotationOpService } from 'src/app/service/Quotation/quotation-op.service';

@Component({
  selector: 'app-dialog-quotation-data-preview',
  templateUrl: './dialog-quotation-data-preview.component.html',
  styleUrls: ['./dialog-quotation-data-preview.component.css']
})
export class DialogQuotationDataPreviewComponent implements OnInit {
  quotation: any;
  quotationItems: any[] = [];
  userEmailId: string;
  isLoading: boolean = false;
  isPreviewOnly: boolean = false;
  isProcessingData: boolean = false;
  quotaData: any; // Processed data from the server

  constructor(
    private dialogRef: MatDialogRef<DialogQuotationDataPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private quotationService: QuotationOpService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userEmailId = localStorage.getItem('userEmail');
    this.isPreviewOnly = this.data?.isPreviewOnly || false;
    this.isLoading = true;
    
    // Get quotation data from dialog data or service
    if (this.data && this.data.quotation) {
      this.quotation = this.data.quotation;
      
      // Process the data through the server
      this.processQuotationData();
    } else {
      // Fallback to service if not provided in data
      this.quotationService.currentQuotation.subscribe(
        (quot: any) => {
          this.quotation = quot;
          
          // Process the data through the server
          this.processQuotationData();
        }
      );
    }
  }

  processQuotationData(): void {
    this._snackBar.open("Processing quotation data...", "", { duration: 0 });
    this.isProcessingData = true;
    console.log(this.quotation);
    // Post the data to getQuotInfo to get the processed data back
    this.quotationService.getQuotInfo(this.quotation).subscribe({
      next: (data: any) => {
        this._snackBar.dismiss();
        this.quotaData = data;
         
        // Generate a unique quotation number if not already set
        if (!this.quotaData.quotationNum && this.quotaData.counter) {
          this.quotaData.quotationNum = this.generateUniqueNumber(this.quotaData.counter);
        }
        
        // Set the quotation items from the processed data
        // Check both properties as the API might return either one
        if (this.quotaData.quotationItems) {
          this.quotationItems = this.quotaData.quotationItems;
        } else if (this.quotaData.quotataionItems) {
          this.quotationItems = this.quotaData.quotataionItems;
          // For consistency, also set the standard property name
          this.quotaData.quotationItems = this.quotaData.quotataionItems;
        } else {
          // Fallback to empty array if neither property exists
          this.quotationItems = [];
          this.quotaData.quotationItems = [];
        }
        
        // Update the original quotation with the processed data for display
        this.quotation = this.quotaData;
        
        console.log('Processed quotation data:', this.quotaData);
        this.isLoading = false;
        this.isProcessingData = false;
      },
      error: (error) => {
        this._snackBar.open("Error processing quotation data", "OK");
        console.error('Error processing quotation:', error);
        this.isLoading = false;
        this.isProcessingData = false;
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  downloadQuotationPDF(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    // If this is preview only mode, we need to save the data
    if (this.isPreviewOnly) {
      this.saveAndGeneratePDF();
      this.generatePdf();
    } else {
      // If data is already saved, just generate the PDF
      this.generatePdf();
    }
  }

  async saveAndGeneratePDF(): Promise<void> {
    try {
      const pdfBlobPromise = this.generatePdfBlob();
      if (!pdfBlobPromise) {
        this.isLoading = false;
        return;
      }
      
      const pdfBlob = await pdfBlobPromise;
      if (!pdfBlob) {
        this.isLoading = false;
        return;
      }
      
      const formData = new FormData();
      
      // Append file (as blob)
      formData.append('file', pdfBlob, `quot_${this.quotaData.quotationNum}.pdf`);
      
      // Set the created user
      this.quotaData.createdUser = this.userEmailId;
      
      // Append model (as JSON string)
      formData.append('invoice', JSON.stringify(this.quotaData));
      
      // Save to database
      this.quotationService.postQuotation(formData).subscribe({
        next: (data: any) => {
          this._snackBar.open("Downloaded and saved successfully!", "OK");
          this.dialogRef.close({ saved: true });
          this.isLoading = false;
        },
        error: (error) => {
          this._snackBar.open("Error saving quotation", "OK");
          console.error('Error saving quotation:', error);
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Error in saveAndGeneratePDF:', error);
      this._snackBar.open("Error generating PDF", "OK");
      this.isLoading = false;
    }
  }

  generatePdfBlob(): Promise<Blob> | null {
    const content = document.getElementById('quotation-preview');
    if (!content) {
      this._snackBar.open("No content to generate PDF", "OK");
      return null;
    }
    
    return html2canvas(content, {
      scale: 2, // Increase scale for better resolution
      useCORS: true,
      logging: false,
      scrollY: -window.scrollY // Handle any scroll issues
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 0.75); // Reduce quality for smaller size
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Calculate dimensions to fit within A4
      let imgWidth = pageWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Center the image on the page
      const x = 0;
      const y = 0;
      
      // Add image to the PDF with compression
      pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');
      
      return pdf.output('blob');
    }).catch(error => {
      console.error('Error generating PDF blob:', error);
      this._snackBar.open("Error generating PDF", "OK");
      return null;
    });
  }

  generatePdf = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Get the HTML element
      const content = document.getElementById('quotation-preview');

      if (!content) {
        this._snackBar.open("No content to generate PDF", "OK");
        this.isLoading = false;
        return;
      }

      // Create canvas from HTML content
      const canvas = await html2canvas(content, {
        scale: 2, // Increase scale for better resolution
        useCORS: true,
        logging: true,
        scrollY: -window.scrollY // Handle any scroll issues
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.75); // Reduce quality for smaller size

      // Calculate dimensions to fit within A4
      let imgWidth = pageWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pageHeight) {
        imgWidth = (canvas.width * pageHeight) / canvas.height;
        imgHeight = pageHeight;
      }

      // Center the image on the page
      const x = (pageWidth - imgWidth) / 2;
      const y = 0;

      // Add image to the PDF with compression
      pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');

      // Generate filename based on quotation number
      const filename = this.quotaData.quotationNum ? 
        `quot_${this.quotaData.quotationNum}.pdf` : 
        `quotation_${new Date().getTime()}.pdf`;

      // Save the PDF
      pdf.save(filename);

      this._snackBar.open("PDF generated successfully", "OK");
      this.isLoading = false;
      
      // Close the dialog without saving (already saved)
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
    return 'Quot-' + year + '-' + month + '-' + num.toString();
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
