import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    console.log(`AuthGuard: Checking authentication for ${state.url}`);
    console.log('AuthGuard: isAuthenticated:', isAuthenticated);

    if (isAuthenticated) {
      console.log('AuthGuard: Access granted to', state.url);
      return true;
    } else {
      console.log('AuthGuard: Redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
