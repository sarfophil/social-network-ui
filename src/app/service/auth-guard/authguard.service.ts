import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {ProviderService} from "../provider-service/provider.service";
import {API_TYPE} from "../../model/apiType";

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate{

  constructor(private provider: ProviderService,private router: Router) { }
  token: String = localStorage.getItem("access_token")
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkLogin();
  }

  checkLogin(){
      if(!this.token) {
          // Login Page
         return true;
      }

      // verify token
      let path = `verify`
      this.provider.get(API_TYPE.TOKEN,path,'').subscribe(
        (res) => {
           this.router.navigate(['/home'])
           return true;
        }
      )
  }
}
