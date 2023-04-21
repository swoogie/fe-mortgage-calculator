import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { UserAuthService } from '../services/user-auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: UserAuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();


    console.log('interceptor request');
    if (token) {
      request = request.clone({
        setHeaders: { Authorization : `Bearer ${token}`}
      })
    }
  
    
    return next.handle(request);
  }
}
