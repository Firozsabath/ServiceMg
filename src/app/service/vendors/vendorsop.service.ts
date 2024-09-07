import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vendors } from 'src/app/models/Vendors';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorsopService {

  apiUrl = environment.baseApiUrl;
  constructor(private http:HttpClient) { }

  getVendors():Observable<any>{
    return this.http.get<any>(this.apiUrl+"Vendors");
  }
  postVendor(data:Vendors):Observable<Vendors>{
    debugger;
    return this.http.post<Vendors>(this.apiUrl+"Vendors",data);
  }
  
  getVendorByID(id:number):Observable<any>{
    return this.http.get<any>(this.apiUrl+`Vendors/${id}`);
  }

  updateVendor(id:number,data:Vendors):Observable<any>{
    return this.http.put<any>(this.apiUrl+`Vendors/${id}`,data);
  }

  deleteVendor(id:string):Observable<any>{
    return this.http.delete<any>(this.apiUrl+`Vendors/${id}`);
  }
}
