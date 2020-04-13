import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import {trigger,state,style,transition, animate} from '@angular/animations';
import lottie from "lottie-web"
import { API_TYPE } from 'src/app/model/apiType';
import { DomSanitizer } from '@angular/platform-browser';
import {Subscription} from "rxjs";
import {NgxPubSubService} from "@pscoped/ngx-pub-sub";

@Component({
  selector: 'app-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.css']
})
export class ProfilePhotoComponent implements OnInit,OnDestroy {

  /** Image names */
  @Input("imageName") imageName: string;
  /** css styles */
  @Input("style") style: Object = {};

  /** Fetch image with userId */
  @Input("fetchWithUserId") fetchWithUserId: String

  isLoading:Boolean = true;

  imageSrc:any = 'assets/img/user.png';

  reloadSubscription : Subscription;

  constructor(private providerService: ProviderService,private sanitizer:DomSanitizer,
              private pubSub: NgxPubSubService) { }

  ngOnInit() {
    this.loadImage()
    this.reloadSubscription = this.pubSub.subscribe('PROFILE_CHANGED',data => {
        this.loadImage();
    })
  }

  loadImage(){
     let queryParam = `?imagename=${this.imageName}`
     if(this.fetchWithUserId && !this.imageName) queryParam = `?userId=${this.fetchWithUserId}`
     let headerOption = {responseType: 'blob'}
     this.providerService.get(API_TYPE.DEFAULT,'download',queryParam,headerOption)
     .subscribe(
       (res) => {
         let objectUrl = URL.createObjectURL(res)
         this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(objectUrl)
       },
       (error) => {
       //  this.isLoading = false
         this.imageSrc = 'assets/img/user.png'
       },
       () => this.isLoading = false
     )
  }

  ngOnDestroy(): void {
    this.reloadSubscription.unsubscribe()
  }


}
