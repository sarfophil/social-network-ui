import {Component, OnInit} from '@angular/core';
import {ProviderService} from "../../../../service/provider-service/provider.service";
import {User} from "../../../../model/user";
import {API_TYPE} from "../../../../model/apiType";
import {Advert} from "../../../../model/advert";
import {animate, state, style, transition, trigger} from "@angular/animations";
import lottie from "lottie-web"

import { environment } from 'src/environments/environment';
import {DomSanitizer} from "@angular/platform-browser";
import {of} from "rxjs";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-ad-widget',
  templateUrl: './ad-widget.component.html',
  styleUrls: ['./ad-widget.component.css'],
  animations: [
    trigger('searchTrigger',[
      state('open',
        style({
          display: 'block'
        })),
      state('close',style({
        display:'none',
      }))
    ])
  ]
})
export class AdWidgetComponent implements OnInit {

  user: User;

  adsList : Array<Advert>;

  isLoading: boolean = true;

  isLoadingMore: boolean = false;

  limit: number = 3;

  skip: number = 0;

  constructor(private provider: ProviderService,private sanitizer: DomSanitizer) { }

  ngOnInit() {
      this.user = JSON.parse(localStorage.getItem('active_user'))
      this.loadAnimy();
      setTimeout(()=> this.loadAds(),1000)
  }


  loadAnimy(){
    lottie.loadAnimation({
      container: document.getElementById('animy'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/lottie/19125-targeting-the-ads.json'
    })
  }

  loadAds(){
    this.isLoading = true;
    let url = `${this.user._id}/ads`;
    let queryParam = `?skip=${this.skip}&limit=${this.limit}`;
    this.provider.get(API_TYPE.USER, url)
      .pipe(
          switchMap((data: Array<Advert>) => this.requestImage(data))
      )
      .subscribe(
      (response: Array<Advert>) => {
          this.adsList = response;
      },
      (error => {
        this.isLoading = false;
      }),
      (()=>{
        this.isLoading = false;
        this.isLoadingMore = false
      })
    )
  }

  requestImage(adverts: Array<Advert>){
    for(let advert of adverts){
      let queryParam = `?imagename=${advert.banner[0]}`;
      let headerOption = {responseType: 'blob'};
      this.provider.get(API_TYPE.DEFAULT,'download',queryParam,headerOption)
        .subscribe(
          (res) => {
            let objectUrl = URL.createObjectURL(res);
            advert.bannerImageUrl = objectUrl

          },
          (error => advert.bannerImageUrl = 'assets/img/placeholder.png')
        )
    }


    return of(adverts)

  }

  visit(ad: Advert) {

  }

  redirect(link: string) {
    window.open(link)
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  loadMore() {
      this.isLoadingMore = true;
      this.skip += 1 * this.limit;
      this.loadAds()
  }
}
