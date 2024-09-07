import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceParts, ServicePartsVM } from 'src/app/models/ServiceParts';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicepartsopService {

  apiUrl = environment.baseApiUrl;
  constructor(private http:HttpClient) { }

  getAllUsedParts():Observable<any>{
    return this.http.get<any>(this.apiUrl+`ServiceParts`);
  }

  getPartsBYService(id:number):Observable<any>{
    return this.http.get<any>(this.apiUrl+`ServiceParts/ByService/${id}`);
  }

  postUsedParts(data:ServiceParts[]):Observable<any>{
    return this.http.post<any>(this.apiUrl+"ServiceParts",data);
  }

  updateUsedParts(id:number, data:ServicePartsVM):Observable<ServiceParts>{
    return this.http.put<ServiceParts>(this.apiUrl+`ServiceParts/${id}`,data);
  }

  deleteParts(id:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl+`ServiceParts/${id}`);
  }
}
