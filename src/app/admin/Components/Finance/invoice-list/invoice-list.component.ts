import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InvoiceOpService } from 'src/app/service/invoice/invoice-op.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  displayedColumns: string[] = ['id','quotationNum','companyName','dateCreated','status','totalAmount','Actions'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) msort: MatSort;
  constructor(private invoiceServices:InvoiceOpService, private route:Router) { }

  ngOnInit(): void {
    this.getQuotsDetails();
  }

  getQuotsDetails(){
    this.invoiceServices.getAllInvoices().subscribe((data:any)=>{
      console.log(data)

      this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.msort;
    })
  }

  downloadQuot(dt:any){
    this.route.navigate(['/admin/fin/quotationview'],{queryParams:{id:dt}});
}

addNewInvoice(){
  this.route.navigate(['/admin/fin/invoicegen']);
}

getImgUrl(url:string){
  var durl= environment.staticFileUrl //'https://localhost:7053/';
    return durl+url;
}

}
