import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root'
})
export class CanActivateTeamService implements CanActivate{

  constructor(private router: Router) { }
  canActivate(route: import("@angular/router").ActivatedRouteSnapshot,
              state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
    return this.permission(route.data.role);
  }

  permission(role: Array<String>): boolean {
      let user: User = JSON.parse(localStorage.getItem('active_user'));
      let accessToken = localStorage.getItem('access_token');
      if(accessToken){
          // check user's state
          if(user && user.isActive){
            // check role
            let checkRole = role.find((r:string) => r == user.role);

            return checkRole? true: false;
          }else{
            this.router.navigate(['/login']);
            return false;
          }
      }
      return false;
  }


}
