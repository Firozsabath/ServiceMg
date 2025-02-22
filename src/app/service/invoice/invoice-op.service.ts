import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceOpService {

  private invoiceSource = new BehaviorSubject<any>(null);
  apiUrl = environment.baseApiUrl;
  currentInvoice = this.invoiceSource.asObservable();

  constructor(public http:HttpClient) { }

  setInvoice(invoice:any): void{
    this.invoiceSource.next(invoice);
  }

  getInvoiceInfo(inv:any):Observable<any>{   
    return this.http.post<any>(this.apiUrl+"Invoice/GetInvoiceDetails",inv);
  }

  getAllInvoices(){
    return this.http.get<any>(this.apiUrl+"Invoice");
  }

  postInvoice(data:any):Observable<any>{
    return this.http.post<any>(this.apiUrl+"Invoice/PostInvoiceData",data);
  }


}
