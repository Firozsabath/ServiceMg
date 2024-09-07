import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Companies } from 'src/app/models/Companies';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompaniesopService {

  apiUrl = environment.baseApiUrl+"Companies";
  constructor(private http:HttpClient) { }

  getCompanies():Observable<any>{   
    return this.http.get<any>(this.apiUrl);
  }
  getCompanyByID(id:number):Observable<any>{
    return this.http.get<any>(this.apiUrl);
  }
  addCompany(data:Companies):Observable<any>{
    return this.http.post<any>(this.apiUrl,data);
  }
  updateCompany(id:number,data:Companies){
    return this.http.put<any>(this.apiUrl+`/${id}`,data);
   // return this.http.put<any>(this.apiUrl+`/${id}`,data);
  }
  deleteCompany(id:number){
    return this.http.delete<any>(this.apiUrl+`/${id}`);
  }
}
