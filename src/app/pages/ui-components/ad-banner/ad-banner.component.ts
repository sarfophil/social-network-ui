import {Component, OnInit, Sanitizer} from '@angular/core';
import {state, style, trigger} from "@angular/animations";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {API_TYPE} from "../../../model/apiType";
import {ProviderService} from "../../../service/provider-service/provider.service";
import {Advert} from "../../../model/advert";
import {Observable, of} from "rxjs";
import {switchMap} from "rxjs/operators";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-ad-banner',
  templateUrl: './ad-banner.component.html',
  styleUrls: ['./ad-banner.component.css'],
  animations: [
    trigger('loadingPlaceholder',[
      state('open',style({
        display: 'block'
      })),
      state('close',style({
        display: 'none'
      }))
    ])
  ]
})
export class AdBannerComponent implements OnInit {
  showPlaceholder: boolean = true;
  private  adId : string;
  advert: Advert;
  constructor(private router: Router,private route : ActivatedRoute,
              private providerService: ProviderService,private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.route.paramMap.subscribe((res:ParamMap) => {
       this.adId = res.get("adId")
    })

    setTimeout(() =>this.getAdvert(),1000)
  }

  getAdvert(){
    let path = `ads/${this.adId}`
    this.showPlaceholder = true
    // @ts-ignore
    // @ts-ignore
    this.providerService.get(API_TYPE.ADMIN, path,'')
      .pipe(
        switchMap((advert:any) => this.getImage(advert))
        )
      .subscribe((advertResp:Advert) => {
         this.advert = advertResp;
         this.showPlaceholder = false
      })
  }

  visit(advert: Advert) {
    window.open(advert.link)
  }

  getImage(advert: Advert): Observable<Advert>{
      console.log(advert)
      let queryParam = `?imagename=${advert.banner[0]}`;
      let headerOption = {responseType: 'blob'};
      this.providerService.get(API_TYPE.DEFAULT,'download',queryParam,headerOption)
        .subscribe(
          (res) => {
            advert.bannerImageUrl = URL.createObjectURL(res)

          },
          (error => advert.bannerImageUrl = 'assets/img/placeholder.png')
        )


    return of(advert)

  }

  sanitize(bannerImageUrl: any) {
    return this.sanitizer.bypassSecurityTrustUrl(bannerImageUrl);
  }
}
