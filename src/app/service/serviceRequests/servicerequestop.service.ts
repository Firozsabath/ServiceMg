import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicerequestopService {

  apiUrl = environment.baseApiUrl;
  constructor(private http:HttpClient) { }

  getTickets():Observable<any>{
    return this.http.get<any>(this.apiUrl+"ServiceRequest");
  }

  getTicketByID(id:number):Observable<any>{
    return this.http.get<any>(this.apiUrl+`ServiceRequest/${id}`);
  }

  getTicketsByCategory():Observable<any>{
    return this.http.get<any>(this.apiUrl+"ServiceRequest/GetByCategory");
  }

  getTicketsRatioByStatus():Observable<any>{
    return this.http.get<any>(this.apiUrl+"ServiceRequest/GetByStatus");
  }

  getTicketByTechnician(id:number):Observable<any>{
    return this.http.get<any>(this.apiUrl+`ServiceRequest/GetByTechnician/${id}`);
  }

  getTicketByMachine(id:number):Observable<any>{
    return this.http.get<any>(this.apiUrl+`ServiceRequest/${id}`);
  }

  getTicketsFIltered(machineId?:number,branchId?:number,companyId?:number,technicianId?:number,statusId?:number):Observable<any>{
    let params = new HttpParams();
    if (companyId) {
      params = params.set('companyId', companyId.toString());
    }
    if (branchId) {
      params = params.set('branchId', branchId.toString());
    }
    if (machineId) {
      params = params.set('machineId', machineId.toString());
    }
    if (technicianId) {
      params = params.set('technicianId', technicianId.toString());
    }
    if (statusId) {
      params = params.set('statusId', statusId.toString());
    }
    return this.http.get<any>(this.apiUrl+`ServiceRequest/GetFilteredRequest`,{params});
  }

  getDropdowns():Observable<any>{
    return this.http.get<any>(this.apiUrl+"ApplicationSpecific/GetTicketsDropdowns");
  }

  getReportDropdowns():Observable<any>{
    return this.http.get<any>(this.apiUrl+"ApplicationSpecific/GetDropsForrequestsReport");
  }

  postRequest(data:any):Observable<any>{
    return this.http.post<any>(this.apiUrl+"ServiceRequest",data);
  }

  updateRequest(id:number, data:any):Observable<any>{
    return this.http.put<any>(this.apiUrl+`ServiceRequest/${id}`,data);
  }

  updateStatus(id:number, data:any):Observable<any>{
    return this.http.put<any>(this.apiUrl+`ServiceRequest/UpdateStatus/${id}`,data)
  }

  resondRequest(id:number, data:any):Observable<any>{
    return this.http.put<any>(this.apiUrl+`ServiceRequest/RespondRequest/${id}`,data)
  }

  deleteRequest(id:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl+`ServiceRequest/${id}`);
  }


}
