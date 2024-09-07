import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { quotation, QuotationItems, quotItems } from 'src/app/models/Quotation';
import { QuotationOpService } from 'src/app/service/Quotation/quotation-op.service';

@Component({
  selector: 'app-quotationdisplay',
  templateUrl: './quotationdisplay.component.html',
  styleUrls: ['./quotationdisplay.component.css']
})
export class QuotationdisplayComponent implements OnInit {

  constructor(private quotService:QuotationOpService) { }
  quotation:any;
  ids:number[]; 
  items:quotItems[];
  quotItems:QuotationItems[];
  quotaData:any;
  quotPrintData:quotation;
  ngOnInit(): void {
    this.quotService.currentQuotation.subscribe(
      (quot:any)=> {
        this.quotation= quot;              
      }
    )
    this.items = this.quotation.quotationItems
    this.ids = this.items.map(i=>i.partsId);
    console.log(this.ids); 
      debugger;
    this.quotService.getQuotInfo(this.quotation).subscribe(
      (data:any)=>{
          this.quotaData = data;
          this.quotaData.quotationNum = this.generateUniqueNumber();
          console.log(this.quotaData);
      }
    )
  }



  downloadQuotationPDF(): void {

    const data = document.getElementById('quotation');
    if (data) {
      // html2canvas(data).then(canvas => {
      //   const imgWidth = 208;
      //   const imgHeight = canvas.height * imgWidth / canvas.width;
      //   const contentDataURL = canvas.toDataURL('image/png');
      //   const pdf = new jsPDF('p', 'mm', 'a4');
      //   const position = 0;
      //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      //   //pdf.save(`quotation_${this.quotation.id}.pdf`);
      //   pdf.save(`quotation_test.pdf`);
      // });   

      this.generatePdf();
    }

    //console.log(this.quotaData);
    this.quotPrintData = this.quotaData as quotation;
    this.quotItems = this.quotPrintData.quotataionItems;
    console.log(this.quotPrintData);
    this.quotService.postQuotation(this.quotPrintData).subscribe(
        (data:any)=>{
            
        }
    )


    
  }

   generatePdf = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Get the HTML element
    const content = document.getElementById('quotation');

    if(!content){
      console.log("No content");
      return;
    }

    // Calculate scale factor
    const contentWidth = content.offsetWidth;
    const contentHeight = content.offsetHeight;
    const scaleX = pageWidth / contentWidth;
    const scaleY = pageHeight / contentHeight;
    const scale = Math.min(scaleX, scaleY);

    try{
      const canvas = await html2canvas(content, {
        scale: 2, // Increase scale for better resolution
        useCORS: true,
        logging: true,       
        scrollY: -window.scrollY, // Handle any scroll issues
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.75); // Reduce quality for smaller size

    // Calculate the aspect ratio and ensure it fits within A4
      let imgWidth = pageWidth;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pageHeight) {
        const imgWidth = (canvas.width * pageHeight) / canvas.height;
        const imgHeight = pageHeight;
    }

     // Center the image on the page
     const x = (pageWidth - imgWidth) / 2;
     const y = (pageHeight - imgHeight) / 2;

    // Add image to the PDF with compression
    pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');
    pdf.save('document.pdf');
    }
    catch(error){
      console.error('Error generating PDF:', error);
    }
    
};


  generateUniqueNumber(): string {
    const year = new Date().getFullYear().toString();
    const randomNum = Math.floor(Math.random() * 900000) + 100000; // Generate a 6-digit random number
    return 'Quot-'+ year +'/'+ randomNum.toString().padStart(6, '0'); // Pad with zeros if necessary
  }

  convertNumberToWords(data) {
    //debugger;
     var words = new Array();
     words[0] = '';
     words[1] = 'One';
     words[2] = 'Two';
     words[3] = 'Three';
     words[4] = 'Four';
     words[5] = 'Five';
     words[6] = 'Six';
     words[7] = 'Seven';
     words[8] = 'Eight';
     words[9] = 'Nine';
     words[10] = 'Ten';
     words[11] = 'Eleven';
     words[12] = 'Twelve';
     words[13] = 'Thirteen';
     words[14] = 'Fourteen';
     words[15] = 'Fifteen';
     words[16] = 'Sixteen';
     words[17] = 'Seventeen';
     words[18] = 'Eighteen';
     words[19] = 'Nineteen';
     words[20] = 'Twenty';
     words[30] = 'Thirty';
     words[40] = 'Forty';
     words[50] = 'Fifty';
     words[60] = 'Sixty';
     words[70] = 'Seventy';
     words[80] = 'Eighty';
     words[90] = 'Ninety';
     var amount = data;
     amount = amount.toString();
     var atemp = amount.split(".");
     var number = atemp[0].split(",").join("");
     var n_length = number.length;
     var words_string = "";
             let value;
 
     if (n_length <= 9) {
         var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
         var received_n_array = new Array();
         for (var i = 0; i < n_length; i++) {
             received_n_array[i] = number.substr(i, 1);
         }
         for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
             n_array[i] = received_n_array[j];
         }
         for (var i = 0, j = 1; i < 9; i++, j++) {
             if (i == 0 || i == 2 || i == 4 || i == 7) {
                 if (n_array[i] == 1) {
                     n_array[j] = 10 + parseInt(n_array[j] as any);
                     n_array[i] = 0;
                 }
             }
         }
         for (var i = 0; i < 9; i++) {
             if (i == 0 || i == 2 || i == 4 || i == 7) {
                 value = n_array[i] * 10;
             } else {
                 value = n_array[i];
             }
             if (value != 0) {
                 words_string += words[value] + " ";
             }
             if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                 words_string += "Crores ";
             }
             if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                 words_string += "Lakhs ";
             }
             if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                 words_string += "Thousand ";
             }
             if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                 words_string += "Hundred and ";
             } else if (i == 6 && value != 0) {
                 words_string += "Hundred ";
             }
         }
         words_string = words_string.split("  ").join(" ");
     }
     return words_string;
 }


}
