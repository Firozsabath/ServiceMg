import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestTypes } from 'src/app/models/PriorityLevels';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReuquestTypeOpsService {

  apiUrl = environment.baseApiUrl+"AppSettings";
  constructor(private http:HttpClient) { }

  getItems():Observable<any>{   
    return this.http.get<any>(this.apiUrl+"/GetRequestTypes");
  }
  getItemsByID(id:number):Observable<any>{
    return this.http.get<any>(this.apiUrl+"/GetRequestTypesByID");
  }
  addItem(data:RequestTypes):Observable<any>{
    return this.http.post<any>(this.apiUrl+"/AddRequestType",data);
  }
  updateItem(id:number,data:RequestTypes){
    return this.http.put<any>(this.apiUrl+`/UpdateRequestType/${id}`,data);   
  }
  deleteItem(id:number){
    return this.http.delete<any>(this.apiUrl+`/DeleteRequestType/${id}`);
  }
}
