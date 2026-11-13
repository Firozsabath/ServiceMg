import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuotationOpService {
  private quotationSource = new BehaviorSubject<any>(null);
  apiUrl = environment.baseApiUrl;
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

  postQuotation(data:any):Observable<any>{
    return this.http.post<any>(this.apiUrl+"Quotation/PostQuotationDetails",data);
  }

  getAllQuots(){
    return this.http.get<any>(this.apiUrl+"Quotation");
  }

  getQuotInfoByID(id:any):Observable<any>{
    return this.http.get<any>(this.apiUrl+"Quotation/GetQuotDetailsForInvoice",{params:{id:id}});
  }

  getQuotInfoByQuotID(id:any):Observable<any>{
    return this.http.get<any>(this.apiUrl+"Quotation/GetQuotDetailsByQuotID",{params:{id:id}});
  }

  getQuotInfoByQuotNum(quotNum:string):Observable<any>{
    return this.http.get<any>(this.apiUrl+"Quotation/GetQuotDetailsByQuotNum",{params:{quotNum:quotNum}});
  }

   // delete a invoice statuses
   deleteQuot(id:number){
    return this.http.delete<any>(this.apiUrl+`Quotation/${id}`);
  }
}
