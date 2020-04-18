import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {Advert} from "../../model/advert";
import {EMPTY, Observable, of} from "rxjs";
import {ProviderService} from "../provider-service/provider.service";
import {API_TYPE} from "../../model/apiType";
import {mergeMap, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AdResolverService implements Resolve<Advert>{
  private  adIdParam: string;
  constructor(private providerService: ProviderService,private router: Router,private route: ActivatedRoute) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Advert> | Promise<Advert> | Advert {
    this.adIdParam = route.paramMap.get('adId')
    return this.findAd(this.adIdParam);
  }

  // @ts-ignore
  findAd(adId: String): Observable<Advert>{
    let path = `ads/${adId}`

    // @ts-ignore
    // @ts-ignore
    return this.providerService.get(API_TYPE.ADMIN, path,'')
      .pipe(
         take(1),
         mergeMap((ad: Advert) => {
            if(ad){
              return of(ad);
            }else{
              this.router.navigateByUrl('/404')
              return EMPTY;
            }
         })
      )
  }
}
