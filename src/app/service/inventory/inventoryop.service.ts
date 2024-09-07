import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Inventory } from 'src/app/models/Inventory';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryopService {

  apiUrl = environment.baseApiUrl+"Inventory";
  constructor(private http:HttpClient) { }

  getItems():Observable<any>{   
    return this.http.get<any>(this.apiUrl);
  }
  getItemsByID(id:number):Observable<any>{
    return this.http.get<any>(this.apiUrl);
  }
  addItem(data:Inventory):Observable<any>{
    return this.http.post<any>(this.apiUrl,data);
  }
  updateItem(id:number,data:Inventory){
    return this.http.put<any>(this.apiUrl+`/${id}`,data);
   // return this.http.put<any>(this.apiUrl+`/${id}`,data);
  }
  deleteItem(id:number){
    return this.http.delete<any>(this.apiUrl+`/${id}`);
  }

  checkAvailability(id:number):Observable<boolean>{
    return this.http.get<any>(this.apiUrl+`/CheckAvailability/${id}`);
    // var data = this.http.get<any>(this.apiUrl).subscribe(
    //   (data:any)=>{
    //     return data;
    //   }
    // );
  }
}
