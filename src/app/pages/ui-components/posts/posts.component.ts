import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ProviderService} from 'src/app/service/provider-service/provider.service';
import {API_TYPE} from 'src/app/model/apiType';
import {User} from 'src/app/model/user';
import {PostType} from 'src/app/model/post-type';
import {of} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {Like, PostResponse} from "../../../model/post-response";
import {DomSanitizer} from "@angular/platform-browser";
import {ViewPostModalComponent} from "../view-post-modal/view-post-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {NgxPubSubService} from "@pscoped/ngx-pub-sub";
import {MatSnackBar} from "@angular/material/snack-bar";


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
export class PostsComponent implements OnInit {
  /** Useful when making a request to the server */
  showPlaceholder: Boolean = true;
  skip = 0;

  private readonly limit = 3;


  /**
   * @description loadPosts method will depend on this decorator to load contents
   * Default value will home
   *
   */
  @Input('postState') postState: PostType = PostType.HOMEPAGE_POSTS;

  /**
   * @description postData will recieve data from any parent component
   */
  @Input('postData') postData: any = '';
  @Input('userIdAdmin') userIdAdmin;

  post: Array<PostResponse> = []

  private currentUser: User = JSON.parse(localStorage.getItem('active_user'));


  pendingPost: Boolean = false;


  private postId: {} = null;
  private path;
  private apiType: API_TYPE;
  private queryParam;
  private openSpinner: boolean = false

  constructor(private provider: ProviderService,private sanitizer: DomSanitizer,private dialog: MatDialog,
              private pubSubService: NgxPubSubService,private snackBar: MatSnackBar) { }


  ngOnInit() {
    // this.loadPosts(this.postState)
    console.log('current user',this.currentUser);
    setTimeout(() => this.loadPosts(this.postState), 2000)
    this.onPostCreatedEventSubscription()
    this.onPostedSuccessfulEvent()
    this.onPostRejectedEvent()
  }

  /**
   * @description Depends on postState to load data from the webservice
   * @param postType
   */
  loadPosts(postType: PostType) {

    this.path = '';
    //If the parent component is not an Admin Component
    if (this.userIdAdmin == null) {
      this.queryParam = `?user=${this.currentUser._id}&page=0&limit=5`
    }
    // Homepage posts
    if (postType === PostType.HOMEPAGE_POSTS) {
      this.apiType = API_TYPE.POST;
      this.path = ''
      this.queryParam = '?page=' + this.skip + '&limit=' + this.limit + '';
    }

    // User posts
    if (postType === PostType.USER_POSTS) {
      this.apiType = API_TYPE.POST
      this.path = `search`
      this.queryParam = `?query=${this.postData}&limit=${this.limit}&skip=${this.skip}`

    }

    // Search posts
    if (postType === PostType.SEARCH_POSTS) {
      this.apiType = API_TYPE.POST;
      this.path = 'search'
      this.queryParam = `?query=${this.postData}&limit=${this.limit}&skip=${this.skip}`

    }

    //Account Review Post
    if (postType === PostType.ACCOUNT_REVIEW) {
      this.apiType = API_TYPE.POST
      this.path = `${this.userIdAdmin}/unhealthy`;
      this.queryParam = `?limit= ${this.limit}&skip= ${this.skip}`

    }

    //Post review posts
    if (postType === PostType.POST_REVIEW) {
      console.log("userIdAdmin", "cvbbvb");
      this.apiType = API_TYPE.ADMIN
      this.path = `/blacklist/posts/reviews`;
      this.queryParam = `?limit= ${this.limit}&skip= ${this.skip}`

    }


    this.load(this.apiType, this.path, this.queryParam);

  }

  likeFilter(likes: Array<Like>) {
    let lookup = likes.find((like) => like._id == this.currentUser._id);
    return !!lookup;
  }

  loadMore() {
    this.skip += 1;
    this.openSpinner = true;
    this.loadPosts(this.postState)
  }




   load(apiType, path, query) {
    this.provider.get(apiType, path, query == '' ? '' : query)
      .pipe(
        map((response: PostResponse[]) => {

          return response.map((postresponce) => {
            // Mapping posts For Account and Post Review
            return postresponce.post ? postresponce.post : postresponce;
          }).map((data: any) => {
            return new PostResponse(data._id, data.imageLink[0], data.userDetail[0]._id, data.createdDate, data.isHealthy, data.userDetail[0].profilePicture, data.userDetail[0].username, data.likes, data.content, data.comments);
          })
          }),
          switchMap((postArr: Array<PostResponse>) => this.requestImages(postArr))
        )
      .subscribe(
          (res:Array<PostResponse>) => {
            this.post = this.post.concat(res);
            console.log(res)
          },
          (error) => {
            this.showPlaceholder = false;
            this.provider.onTokenExpired(error.responseMessage, error.statusCode)
          },
          () => {
           this.openSpinner = false;
           this.showPlaceholder = false
          }
      )
  }



  requestImages(posts: Array<PostResponse>) {
    for (let post of posts) {
      let queryParam = `?imagename=${post.image}`;
      let headerOption = { responseType: 'blob' };
      this.provider.get(API_TYPE.DEFAULT, 'download', queryParam, headerOption)
        .subscribe(
          (res) => {
            post.downloadedImageBlob = URL.createObjectURL(res);
          },
          (error => post.downloadedImageBlob = 'assets/img/placeholder.png')
        )
    }


    return of(posts)

  }

  /**
   * @deprecated
   */
  loadNewData() {
    this.post = [];
    this.skip = 0;
    //this.limit = 4;
    let apiType = API_TYPE.POST;
    let path = ''
    let queryParam = '?page=' + this.skip + '&limit=' + this.limit;
    this.load(this.apiType, this.path, queryParam);
    this.skip += 1;
  }

  setPostId(pid) {
    this.postId = { pid: pid, rand: Math.random() }
  }


  deletePost(pid){
    this.showPlaceholder = true
    this.provider.delete(API_TYPE.POST,pid,'').subscribe(
      

      (res: Array<any>) => {
        console.log('Success' + res)
        this.post = []
        this.loadPosts(this.postState)
      },
      (error) => {
        console.log('Success' + error)
        this.snackBar.open(`An Error occurred`,'ok',{duration: 3000})
        this.showPlaceholder = false;
        this.provider.onTokenExpired(error.responseMessage, error.statusCode)
      },
      () => {
        console.log(`Complete {}`)
        this.snackBar.open(`Post removed successfully`,'ok',{duration: 3000})
        this.showPlaceholder = false
      }
    )


  }

  openPost($event: MouseEvent, post: PostResponse) {
    $event.preventDefault()
    let dialogRef = this.dialog.open(ViewPostModalComponent, {
      width: '1000px',
      height: '500px',
      position: {
        top: '0'
      },
      data: post
    })
  }

  sanitize(downloadedImageBlob: any) {
    return this.sanitizer.bypassSecurityTrustUrl(downloadedImageBlob);
  }

  react(post: PostResponse) {
    let lookup = post.likes.findIndex(like => this.currentUser._id == like._id)
    let path = `${post.id}/user/${this.currentUser._id}/likes`;
    if (lookup != -1) {
      // id found
      // unlike
      post.likes.splice(lookup, 1)
      this.provider.delete(API_TYPE.POST, path, '')
        .subscribe((res) => console.log(`Unliked`))
    } else {
      // id not found
      // like
      // @ts-ignore
      post.likes.push({ _id: this.currentUser._id })

      // send  a request
      let body = {};
      this.provider.put(API_TYPE.POST, path, body)
        .subscribe((res) => console.log(`liked`))
    }



  }



  acceptBlacklistedPost(reviewId) {
    console.log(reviewId)
    this.provider.put(API_TYPE.ADMIN, `blacklist/posts/reviews/${reviewId}`, '').subscribe((res: { err: boolean, message: string }) => {
      this.loadNewData();
    }, (err) => {
      console.log(err);
    }, () => {

    })
  }

  onPostCreatedEventSubscription() : void{
      this.pubSubService.subscribe('onPostCreatedEvent',(data: PostResponse) => {
          this.pendingPost = true
      })
  }

  onPostedSuccessfulEvent(): void{
    this.pubSubService.subscribe(`POST_CREATED_EVENT`,() => {
       this.skip = 0
       this.pendingPost = false;
       this.showPlaceholder = true;
       this.post = [];
       setTimeout(() => this.loadPosts(this.postState),2000)
    })
  }

  onPostRejectedEvent(): void{
     this.pubSubService.subscribe(`UNHEALTHY_POST_EVENT`,() => {
        this.pendingPost = false
     })
  }

  //   load(apiType,path, query) {
//     this.provider.get(apiType, path, query == '' ? '' : query)
//       .pipe(
//           map((response: Array<any>) => {
//               let postsArr: Array<PostResponse> = [];
//               for(let data of response){
//                   let post = new PostResponse(data._id,data.imageLink[0],data.userDetail[0]._id,data.createdDate,data.isHealthy,data.userDetail[0].profilePicture,data.userDetail[0].username,data.likes,data.content,data.comments);
//                   postsArr.push(post)
//               }
//               return postsArr
//           }),
//           switchMap((postArr: Array<PostResponse>) => this.requestImages(postArr))
//       )
//       .subscribe(
//         (res: Array<PostResponse>) => {
//          //   this.post = res;
//          this.post = this.post.concat(res);

//         },
//         (error) => {

//           this.showPlaceholder = false;
//           this.provider.onTokenExpired(error.responseMessage, error.statusCode)
//         },
//         () => {
//           this.openSpinner = false;
//           this.showPlaceholder = false
//         }
//
//     )


}
