import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, shareReplay, tap } from 'rxjs';
import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationserviceService {

  //private apiUrl = "https://localhost:7053/api/";
  private apiUrl = environment.baseApiUrl;
  private isAuthenticated = false;
  constructor(private http:HttpClient, private _router:Router) { }

  getUsers():Observable<any>{
    return this.http.get<any>(this.apiUrl+"Auth");
  }
  postUser(data:User):Observable<User>{
    return this.http.post<User>(this.apiUrl+"Auth/register",data);
  }
  getValidated(data: any)
  {
    return this.http.post<User>(this.apiUrl+"Auth/login",data).pipe(     
      tap(res=>this.setSession),
      shareReplay()
    );
    
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

  isUserAuthenticated():boolean{
    return this.isAuthenticated;
  }


  public setSession(authResult) {
    debugger;   

    if(authResult != null)
    {      
      debugger;   
      this.isAuthenticated = true;
      localStorage.setItem('token',authResult);
      var decodedData = this.decodeToken(authResult);
      var role = decodedData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      localStorage.setItem('userId',decodedData['jti']);
      localStorage.setItem('userEmail',decodedData['sub']);
      localStorage.setItem('userRole',role);
      localStorage.setItem("expires_at", decodedData['exp'] );
      var expTime:number = +decodedData['exp'];
      var timeUntilExpiration = this.tockenExpiryTime(expTime);
      this.autoLogout(timeUntilExpiration);
      //console.log(decodedData);
      if(role == 'Admin'){
        this._router.navigateByUrl('/admin/dashboard');
      }else if(role == 'Technician'){
        this._router.navigateByUrl('/user');
      }      
    }    
  }  

  autoLogin(){
    //debugger;    
    var isExp = this.isTokenExpired(localStorage.getItem('expires_at'));
    if(isExp){
      this.logout()
    }
    this.isAuthenticated = true;
    var expTime : number = +localStorage.getItem('expires_at');
    var timeUntilExpiration = this.tockenExpiryTime(expTime);
    if(timeUntilExpiration > 0){
      this.autoLogout(timeUntilExpiration);
    }else{
      this.logout();
    }   
  }
  
  autoLogout(expirationDT:number){
    console.log(expirationDT);
    setTimeout((e)=>{
      this.logout();
    }, expirationDT)
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem('userId');

    localStorage.removeItem('userEmail');
    localStorage.removeItem("expires_at");
    localStorage.removeItem("userRole");

    this._router.navigateByUrl('/');
  }


  private isTokenExpired(tokenExp: string): boolean {   
    if (!tokenExp) {
      return true;
    }
    var expTime : number = +tokenExp;
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(expTime);

    return expirationDate < new Date();
  }

  private tockenExpiryTime(exp:number){
    let dte = new Date().getTime();    
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(exp);    
    var expdt = expirationDate.getTime();
    const timeUntilExpiration = expirationDate.getTime() - dte;

    return timeUntilExpiration;
  }

  private decodeToken(token: string) {
    if (!token) {
      return;
    }
    const _decodeToken = (token: string) => {
      try {
        return JSON.parse(atob(token));
      } catch {
        return;
      }
    };
    return token
      .split('.')
      .map(token => _decodeToken(token))
      .reduce((acc, curr) => {
        if (!!curr) acc = { ...acc, ...curr };
        return acc;
      }, Object.create(null));
  }
}
