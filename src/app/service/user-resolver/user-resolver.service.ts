import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {User} from "../../model/user";
import {EMPTY, Observable, of} from "rxjs";
import {API_TYPE} from "../../model/apiType";
import {mergeMap, take} from "rxjs/operators";
import {ProviderService} from "../provider-service/provider.service";

@Injectable({
  providedIn: "root"
})
export class UserResolverService implements Resolve<User>{

  constructor(private provider: ProviderService,private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | Promise<User> | User {
    let userId = route.paramMap.get('userId')
    // @ts-ignore
    return this.provider.get(API_TYPE.USER,`find/${userId}`,'').pipe(
      take(1),
      mergeMap((user:User) => {
        if(user) {
          return of(user)
        }else{
          // @ts-ignore
          this.router.navigate(['/404'])
          return EMPTY;
        }
      })
    )
  }
}
