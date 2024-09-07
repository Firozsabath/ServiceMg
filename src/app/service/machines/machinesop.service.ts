import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Machines } from 'src/app/models/Machines';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MachinesopService { 

  apiUrl = environment.baseApiUrl;
  constructor(private http:HttpClient) { }

  getMachines():Observable<any>{    
    return this.http.get<any>(this.apiUrl+"Machines");
  }
  getMachineByID(id:number):Observable<any>{
    return this.http.get<any>(this.apiUrl+`Machines/${id}`);
  }
  getMachineByBranch(id:number){
    return this.http.get<any>(this.apiUrl+`Machines/GetBYBranch/${id}`);
  }
  addMachine(data:Machines):Observable<any>{
    //debugger;
    return this.http.post<any>(this.apiUrl+"Machines",data);
  }
  updateMachine(id:number,data:Machines):Observable<any>{
    return this.http.put<any>(this.apiUrl+`Machines/${id}`,data);
  }
  deleteMachine(id:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl+`Machines/${id}`);
  }

  getContractTypes():Observable<any>{
    return this.http.get<any>(this.apiUrl+"ApplicationSpecific/ContractTypes");
  }
}
