import {Component, OnInit} from '@angular/core';
import {ProviderService} from "../../../../service/provider-service/provider.service";
import {User} from "../../../../model/user";
import {API_TYPE} from "../../../../model/apiType";
import {Advert} from "../../../../model/advert";
import {animate, state, style, transition, trigger} from "@angular/animations";
import lottie from "lottie-web"

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

  constructor(private provider: ProviderService) { }

  ngOnInit() {
      this.user = JSON.parse(localStorage.getItem('active_user'))
      this.loadAnimy()

      setTimeout(() => this.loadAds(),2000)
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
    let queryParam = `?skip=0&limit=9`;
    this.provider.get(API_TYPE.USER, url).subscribe(
      (response: Array<Advert>) => {
          this.isLoading = false;
          this.adsList = response;
      },
      (error => {
        this.isLoading = false;
      })
    )

  }

  visit(ad: Advert) {

  }
}
