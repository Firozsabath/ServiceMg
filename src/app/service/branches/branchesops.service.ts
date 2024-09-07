import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Branches } from 'src/app/models/Branches';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchesopsService {

  apiUrl = environment.baseApiUrl;
  constructor(private http:HttpClient) { }

  getBranches():Observable<any>{
    return this.http.get<any>(this.apiUrl+"Branches");
  }
  getBranchByID(id:number):Observable<any>{
    return this.http.get<any>(this.apiUrl+`Branches/${id}`);
  }
  getBranchByCompany(id:number):Observable<any>{
    return this.http.get<any>(this.apiUrl+`Branches/GetByCompany/${id}`);
  }
  getBranchListWithCompnay():Observable<any>{
    return this.http.get<any>(this.apiUrl+"Branches/GetBranchwithCompnay");
  }
  addBranch(data:Branches):Observable<any>{
    return this.http.post<any>(this.apiUrl+"Branches",data);
  }
  updateBranch(id:number,data:Branches):Observable<any>{
    return this.http.put<any>(this.apiUrl+`Branches/${id}`,data);
  }
  deleteBranch(id:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl+`Branches/${id}`);
  }

  upload(file: File,brID,type): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('branchID', brID);
    formData.append('ftype', type);

    const req = new HttpRequest('POST', `${this.apiUrl}Branches/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

}
