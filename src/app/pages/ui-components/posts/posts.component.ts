import { Component, OnInit } from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { User } from 'src/app/model/user';
import { Post } from 'src/app/model/post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  animations: [
    trigger('loadingPlaceholder',[
      state('open',style({
          display: 'show',
          animation: 'fadeIn ease-in 0.2s'
      })),
      state('close',style({
        display: 'none'
      })),
      transition('open => close', [
        animate('0s 1s ease-out')
      ])
    ])
  ]
})
export class PostsComponent implements OnInit {

  /** Useful when making a request to the server */
  showPlaceholder:Boolean = false;

  post: Array<Post> = []

  constructor(private provider:ProviderService) { }

  ngOnInit() {
    this.loadPosts()
  }

  loadPosts(){
   // this.showPlaceholder = true;
    let user: User = JSON.parse(localStorage.getItem('active_user'))
    const queryParam = `?user=${user._id}&page=0&limit=5`
    this.provider.get(API_TYPE.POST,'',queryParam).subscribe(
      (res: Array<Post>) => {
         console.log('Success'+res)
      },
      (error) => {
         this.showPlaceholder = false;
         console.log(error)
         this.provider.onTokenExpired(error.responseMessage,error.statusCode)
      },
      () => {
        console.log(`Complete {}`)
        this.showPlaceholder = true
      }
    )
  }

  

}
