import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoaderserviceService } from '../service/loader/loaderservice.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loadService:LoaderserviceService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.loadService.ShowLoader();
    return next.handle(request).pipe(
      tap(
        req => {
          if (req instanceof HttpResponse) {
            this.loadService.HideLoader();
          }
        },
        err => {
          this.loadService.HideLoader();
        }
      )
    );
   // return next.handle(request);


  }
}
