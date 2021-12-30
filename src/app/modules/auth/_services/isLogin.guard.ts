import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from "..";

@Injectable({ providedIn: 'root' })
export class IsLoginGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = this.authService.getToken();
        if (!token || localStorage.getItem('isFirstTime') || route.queryParams?.allow) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(["/main-page"]);

        return false;
    }
}