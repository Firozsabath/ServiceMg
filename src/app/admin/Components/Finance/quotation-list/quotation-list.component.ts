import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogInvoicepreviewComponent } from 'src/app/admin/dialogs/dialog-finance/dialog-invoicepreview/dialog-invoicepreview.component';
import { DialogQuotationpreviewComponent } from 'src/app/admin/dialogs/dialog-finance/dialog-quotationpreview/dialog-quotationpreview.component';
import { QuotationOpService } from 'src/app/service/Quotation/quotation-op.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.css']
})
export class QuotationListComponent implements OnInit {

  displayedColumns: string[] = ['id','quotationNum','companyName','dateCreated','validUntil','totalAmount','Actions'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) msort: MatSort;
  constructor(private quotService:QuotationOpService, private route:Router, private dialog:MatDialog, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.getQuotsDetails();
  }

  getQuotsDetails(){
    this.quotService.getAllQuots().subscribe((data:any)=>{
      console.log(data)

      this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.msort;
    })
  }

  addNewQuot(){
      this.route.navigate(['/admin/fin/quotation']);
  }

  convertToInvoice(quotId:any){
    //console.log(quotId);
    var dialofRef =  this.dialog.open(DialogInvoicepreviewComponent,{
      width: '100vw', // Full width
      height: '100vh', // Full height
      maxWidth: '100vw', // Ensure it doesn't exceed screen width
      maxHeight: '100vh', // Ensure it doesn't exceed screen height
      data:quotId
   
    });

    //this.route.navigate(['/admin/fin/invoicePreview'],{queryParams:{quotID:quotId}});
  }

  downloadQuot(dt:any){
      this.route.navigate(['/admin/fin/quotationview'],{queryParams:{id:dt}});
  }

  sendEmail(dt:any){

  }

  getImgUrl(url:string){
    var durl= environment.staticFileUrl //'https://localhost:7053/';
      return durl+url;
  }

}
