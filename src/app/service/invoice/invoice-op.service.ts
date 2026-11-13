import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InvoiceFilter, InvoiceListResponse } from 'src/app/models/invoice.model';
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

  // czreate a invoice statuses
  postInvoice(data:any):Observable<any>{
    return this.http.post<any>(this.apiUrl+"Invoice/PostInvoiceData",data);
  }

   // delete a invoice statuses
  deleteInvoice(id:number){
    return this.http.delete<any>(this.apiUrl+"Invoice"+`/${id}`);
  }

    // Get all invoice statuses
    getInvoiceStatuses(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}Invoice/GetInvoiceStatuses`);
    }

    updateInvoiceStatus(invoiceId: number, statusUpdate: {
      invoiceStatusId: number, 
      invoiceID : number
      updatedBy: string
    }): Observable<any> {
      return this.http.put(`${this.apiUrl}Invoice/${invoiceId}/status`, statusUpdate);
    }

    getInvoicesByDate(startdate:any, enddate:any):Observable<any>{
       // let params = new HttpParams()
        const params = new HttpParams()
      .set('startDate', startdate)
      .set('endDate', enddate);

    // Make the HTTP GET request with params
    return this.http.get<any[]>(`${this.apiUrl}Invoice/GetInvoicesByDate`, { params });
     
    }


    getInvoices(filter: InvoiceFilter): Observable<InvoiceListResponse> {
      let params = new HttpParams();
  
      if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
      if (filter.statusId) params = params.set('statusId', filter.statusId.toString());
      if (filter.fromDate) params = params.set('fromDate', filter.fromDate.toISOString());
      if (filter.toDate) params = params.set('toDate', filter.toDate.toISOString());
      if (filter.pageNumber) params = params.set('pageNumber', filter.pageNumber.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortDirection) params = params.set('sortDirection', filter.sortDirection);
  
      return this.http.get<InvoiceListResponse>(`${this.apiUrl}Invoice`, { params });
    }

    getInvoiceById(id: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}Invoice/GetInvoicesByID?id=${id}`);
    }

    sendInvoiceEmail(emailData: any) {
      return this.http.post(`${this.apiUrl}sendemail`, emailData);
    }

}
