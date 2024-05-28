import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { quotItems } from 'src/app/models/Quotation';
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
  quotaData:any;
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
          console.log(this.quotaData);
      }
    )
  }

  downloadQuotationPDF(): void {
    const data = document.getElementById('quotation');
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 208;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        //pdf.save(`quotation_${this.quotation.id}.pdf`);
        pdf.save(`quotation_test.pdf`);
      });
    }
  }


}
