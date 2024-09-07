import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Technicians } from 'src/app/models/Technicians';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TechnicianopsService {

  apiUrl = environment.baseApiUrl;
  constructor(private http:HttpClient) { }

  getTechnicians():Observable<any>{    
    return this.http.get<any>(this.apiUrl+"Technicians");
  }
  getTechnicianTickets():Observable<any>{
    return this.http.get<any>(this.apiUrl+"Technicians/GetTechniciansticket");
  }
  getResponseViolationByTechnicians():Observable<any>{
    return this.http.get<any>(this.apiUrl+"Technicians/GetReponseCountByTechnician");
  }
  getTechnicianByID(id:number):Observable<any>{
    return this.http.get<any>(this.apiUrl+`Technicians/${id}`);
  }
  addTechnician(data:Technicians):Observable<any>{
    //debugger;
    return this.http.post<any>(this.apiUrl+"Technicians",data);
  }
  updateTechnician(id:number,data:Technicians):Observable<any>{
    return this.http.put<any>(this.apiUrl+`Technicians/${id}`,data);
  }
  deleteTechnician(id:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl+`Technicians/${id}`);
  }
}
