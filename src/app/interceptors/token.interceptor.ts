import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { UserAuthService } from '../services/user-auth.service';
import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: UserAuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const adminToken = this.auth.getAdminToken();
    const userToken = this.auth.getToken();
    request = request.clone({
      setHeaders: { 'Content-Type': `application/json` },
    });

    if (adminToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${adminToken}` },
      });
    }
    if (userToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${userToken}` },
      });
    }

    return next.handle(request);
  }
}
