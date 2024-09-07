import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PriorityLevels } from 'src/app/models/PriorityLevels';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestprioritiesopsService {

  apiUrl = environment.baseApiUrl+"AppSettings";
  constructor(private http:HttpClient) { }

  getItems():Observable<any>{   
    return this.http.get<any>(this.apiUrl+"/GetRequestPriorities");
  }  
  addItem(data:PriorityLevels):Observable<any>{
    return this.http.post<any>(this.apiUrl+"/AddRequestPriorities",data);
  }
  updateItem(id:number,data:PriorityLevels){
    return this.http.put<any>(this.apiUrl+`/UpdateRequestPriorities/${id}`,data);   
  }
  deleteItem(id:number){
    return this.http.delete<any>(this.apiUrl+`/DeleteRequestPriorities/${id}`);
  }
}
