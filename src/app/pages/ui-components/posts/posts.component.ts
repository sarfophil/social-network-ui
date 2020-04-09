import { Component, OnInit, Input } from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { User } from 'src/app/model/user';
import { Post } from 'src/app/model/post';
import { PostType } from 'src/app/model/post-type';

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
  
  /** 
   * @description loadPosts method will depend on this decorator to load contents
   * Default value will home
   * 
   */
  @Input('postState') postState: PostType = PostType.HOMEPAGE_POSTS

  /**
   * @description postData will recieve data from any parent component
   */
  @Input('postData') postData: any = '';

  post: Array<Post> = []

  private currentUser: User = JSON.parse(localStorage.getItem('active_user'))

  constructor(private provider:ProviderService) { }

  ngOnInit() {
    this.loadPosts(this.postState)
  }

  /**
   * @description Depends on postState to load data from the webservice
   * @param postType 
   */
  loadPosts(postType: PostType){

    let apiType: API_TYPE; 
    let path = '';  
    let queryParam = `?user=${this.currentUser._id}&page=0&limit=5`

    // Homepage posts
    if(postType === PostType.HOMEPAGE_POSTS){
      apiType = API_TYPE.POST;
      path = ''
    }

    // User posts
    if(postType === PostType.USER_POSTS){
      apiType = API_TYPE.USER
      path = `${this.currentUser._id}/posts`
      queryParam = `?limit=5&skip=5`
    }

    // Search posts
    if(postType === PostType.SEARCH_POSTS) {
        apiType = API_TYPE.USER;
        path = 'search'
        queryParam = `?query=${this.postData}&limit=5`
    }

    this.provider.get(API_TYPE.POST,`${path}`,queryParam).subscribe(
      (res: Array<Post>) => {
         console.log('Success'+res)
      },
      (error) => {
         this.showPlaceholder = false;
         this.provider.onTokenExpired(error.responseMessage,error.statusCode)
      },
      () => {
        console.log(`Complete {}`)
        this.showPlaceholder = true
      }
    )
  }

  

}
