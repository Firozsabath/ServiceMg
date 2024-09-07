import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationserviceService } from '../service/auth/authenticationservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGGuard implements CanActivate {

  constructor(private authServ:AuthenticationserviceService, private _router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!this.authServ.isUserAuthenticated()){
        this._router.navigate(['/']);
      }
      return true;
  }
  
}
