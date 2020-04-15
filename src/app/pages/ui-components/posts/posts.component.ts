import { Component, OnInit, Input,AfterContentInit,OnChanges } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
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
    trigger('loadingPlaceholder', [
      state('open', style({
        display: 'show',
        animation: 'fadeIn ease-in 0.2s'
      })),
      state('close', style({
        display: 'none'
      })),
      transition('open => close', [
        animate('0s 1s ease-out')
      ])
    ])
  ]
})
export class PostsComponent implements OnInit,AfterContentInit,OnChanges {
  /** Useful when making a request to the server */
  showPlaceholder: Boolean = false;
  page = 0;
  limit = 4;

  /**
   * @description loadPosts method will depend on this decorator to load contents
   * Default value will home
   *
   */
  @Input('postState') postState: PostType;

  /**
   * @description postData will recieve data from any parent component
   */
  @Input('postData') postData: any = '';
  @Input('userIdAdmin') userIdAdmin;

  post: Array<any> = []

  private currentUser: User = JSON.parse(localStorage.getItem('active_user'))
  private postId: {} = null;
  private path ;
  private apiType : API_TYPE;
  private queryParam;

  constructor(private provider: ProviderService) { }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log("Post state",this.postState);
  }
  ngAfterContentInit(): void {
    console.log("Post state",this.postState);
  }

  ngOnInit() {
    this.loadPosts(this.postState)
  }

  /**
   * @description Depends on postState to load data from the webservice
   * @param postType
   */
  loadPosts(postType: PostType) {

     this.path = '';
     this.queryParam =  `?user=${this.userIdAdmin ? this.userIdAdmin :this.currentUser._id}&page=0&limit=5`


    // Homepage posts
    if (postType === PostType.HOMEPAGE_POSTS) {
      this.apiType = API_TYPE.POST;
      this.path = ''
      this.queryParam = '?page=' + this.page + '&limit=' + this.limit + '';
    }

    // User posts
    if (postType === PostType.USER_POSTS) {
      this.apiType = API_TYPE.POST
      this.path = ``
      this.queryParam = `?query=${this.postData}&limit= ${this.limit}`

    }

    if (postType === PostType.UNHELATHY_POST) {
      console.log("userIdAdmin");
      this.apiType = API_TYPE.POST
      this.path = `${this.userIdAdmin}/unhealthy`;
      this.queryParam = `?query=${this.postData}&limit= ${this.limit}`

    }

    // Search posts
    if (postType === PostType.SEARCH_POSTS) {
      this.apiType = API_TYPE.POST;
      this.path = 'search'
     this.queryParam = `?query=${this.postData}&limit= ${this.limit}`

    }

    this.load(this.apiType, this.path, this.queryParam);

  }

  likeFilter(likes, id) {
    return likes.indexOf(id) !== -1;
  }

  loadMore() {
    let query = '?page=' + this.page + '&limit=' + this.limit + '';
    this.load('','', query);
    this.page += 1;
  }



  load(apiType,path, query) {
    console.log('loading',apiType  +   "  "  + path  + "  " + query);
    this.provider.get(apiType, path, query == '' ? '' : query).subscribe(
      
      (res: Array<any>) => {
        console.log("res",res)
        this.post = this.post.concat(res);


        // const sortedActivities = this.post.sort((a, b) => b.createdDate - a.createdDate)
      },
      (error) => {
        console.log('Error' , error)

        this.showPlaceholder = false;
        this.provider.onTokenExpired(error.responseMessage, error.statusCode)
      },
      () => {
        console.log(`Complete {}`)
        console.log(this.post)

        this.showPlaceholder = true
      }
    )
  }

  loadNewData() {
    this.post=[];
    this.page = 0;
    this.limit = 4;
    let apiType = API_TYPE.POST;
    let path = ''
    let queryParam = '?page=' + this.page + '&limit=' + this.limit;
    this.load(this.apiType,this.path, queryParam);
    this.page += 1;
  }

  setPostId(pid){
    this.postId= {pid:pid,rand:Math.random()}
  }

  deletePost(pid){
    this.provider.delete(API_TYPE.POST,pid,'').subscribe(
      (res: Array<any>) => {
        console.log('Success' + res)
        this.loadNewData()
      },
      (error) => {
        console.log('Success' + error)

        this.showPlaceholder = false;
        this.provider.onTokenExpired(error.responseMessage, error.statusCode)
      },
      () => {
        console.log(`Complete {}`)
        this.showPlaceholder = true
      }
    )

  }


}
