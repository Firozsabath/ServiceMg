import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationserviceService {

  apiUrl = "https://localhost:7053/api/";
  constructor(private http:HttpClient) { }

  getUsers():Observable<any>{
    return this.http.get<any>(this.apiUrl+"Auth");
  }
  postUser(data:User):Observable<User>{
    return this.http.post<User>(this.apiUrl+"Auth/register",data);
  }
  getValidated(data: any)
  {
    return this.http.post<any>(this.apiUrl+"Auth/login",data);
  }

  getUserRoles():Observable<any>{
    return this.http.get<any>(this.apiUrl+"Auth/UserRoles");
  }

  updateUser(data:User):Observable<any>{
    return this.http.put<any>(this.apiUrl+"Auth",data);
  }

  deleteUser(id:string):Observable<any>{
    return this.http.delete<any>(this.apiUrl+`Auth/${id}`);
  }
}
