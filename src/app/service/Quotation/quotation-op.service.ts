import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuotationOpService {
  private quotationSource = new BehaviorSubject<any>(null);
  apiUrl = "https://localhost:7053/api/";
  currentQuotation = this.quotationSource.asObservable();

  constructor(public http:HttpClient) { }

  setQuotation(quotation: any): void {
    this.quotationSource.next(quotation);
  }

  getQuotInfo(quot:any):Observable<any>{
    //let params = new HttpParams();
    //if (quot) {
      //params = params.set('quot', quot);
    //}    
    //return this.http.get<any>(this.apiUrl+`Quotation/GetQuotationDetails`,{params});
    return this.http.post<any>(this.apiUrl+"Quotation/GetQuotationDetails",quot);
  }
}
