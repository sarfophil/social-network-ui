import { Component, OnInit, Input } from '@angular/core';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import {trigger,state,style,transition, animate} from '@angular/animations';
import lottie from "lottie-web"
import { API_TYPE } from 'src/app/model/apiType';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.css']
})
export class ProfilePhotoComponent implements OnInit {
 
  /** Image names */
  @Input("imageName") imageName: string;
  /** css styles */
  @Input("style") style: Object = {};

  isLoading:Boolean = true;

  imageSrc:any = 'assets/img/user.png';
  
  constructor(private providerService: ProviderService,private sanitizer:DomSanitizer) { }

  ngOnInit() {
    if(this.imageName) this.loadImage()
  }

  



  loadImage(){
     let headerOption = {responseType: 'blob'}
     this.providerService.get(API_TYPE.DEFAULT,'download',`?imagename=${this.imageName}`,headerOption)
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

}
