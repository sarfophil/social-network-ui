import {Component, HostListener, Input, OnInit} from '@angular/core';
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
  showPlaceholder: Boolean = false;
  skip = 0;
  limit = 1;

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

  post: Array<PostResponse> = []

  private currentUser: User = JSON.parse(localStorage.getItem('active_user'));

  private postId: {} = null;
  private path ;
  private apiType : API_TYPE;
  private queryParam;
  private openSpinner: boolean = false
  constructor(private provider: ProviderService,private sanitizer: DomSanitizer,private dialog: MatDialog) { }

  ngOnInit() {
    setTimeout(() => this.loadPosts(this.postState), 2000)
  }

  /**
   * @description Depends on postState to load data from the webservice
   * @param postType
   */
  loadPosts(postType: PostType) {

     this.path = '';
     this.queryParam = `?user=${this.currentUser._id}&page=0&limit=5`


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

  likeFilter(likes:Array<Like>) {
    let lookup = likes.find((like) => like._id == this.currentUser._id);
    return !!lookup;
  }

  loadMore() {
    this.skip += this.limit;
    this.openSpinner = true;
    this.loadPosts(this.postState)
  }



  load(apiType,path, query) {
    this.provider.get(apiType, path, query == '' ? '' : query)
      .pipe(
          map((response: Array<any>) => {
              let postsArr: Array<PostResponse> = [];
              for(let data of response){
                  let post = new PostResponse(data._id,data.imageLink[0],data.userDetail[0]._id,data.createdDate,data.isHealthy,data.userDetail[0].profilePicture,data.userDetail[0].username,data.likes,data.content,data.comments);
                  postsArr.push(post)
              }
              return postsArr
          }),
          switchMap((postArr: Array<PostResponse>) => this.requestImages(postArr))
      )
      .subscribe(
        (res: Array<PostResponse>) => {
         //   this.post = res;
         this.post = this.post.concat(res);

        },
        (error) => {

          this.showPlaceholder = false;
          this.provider.onTokenExpired(error.responseMessage, error.statusCode)
        },
        () => {
          this.openSpinner = false;
          this.showPlaceholder = true
        }
    )
  }

  requestImages(posts: Array<PostResponse>){
    for(let post of posts){
      let queryParam = `?imagename=${post.image}`;
      let headerOption = {responseType: 'blob'};
      this.provider.get(API_TYPE.DEFAULT,'download',queryParam,headerOption)
        .subscribe(
          (res) => {
            let objectUrl = URL.createObjectURL(res);
            post.downloadedImageBlob = objectUrl;
          },
          (error => post.downloadedImageBlob = 'assets/img/placeholder.png')
        )
    }


    return of(posts)

  }

  loadNewData() {
    this.post=[];
    this.skip = 0;
    this.limit = 4;
    let apiType = API_TYPE.POST;
    let path = ''
    let queryParam = '?page=' + this.skip + '&limit=' + this.limit;
    this.load(this.apiType,this.path, queryParam);
    this.skip += 1;
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


  openPost($event: MouseEvent,post:PostResponse) {
    $event.preventDefault()
    let dialogRef = this.dialog.open(ViewPostModalComponent,{
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
     if(lookup != -1) {
        // id found
        // unlike
        post.likes.splice(lookup,1)
       this.provider.delete(API_TYPE.POST, path,'')
         .subscribe((res) => console.log(`Unliked`))
     }else{
       // id not found
       // like
       // @ts-ignore
       post.likes.push({_id: this.currentUser._id})

       // send  a request
       let body = {};
       this.provider.put(API_TYPE.POST,path,body)
         .subscribe((res) => console.log(`liked`))
     }
     console.log(`Lookup: ${lookup}`)
     console.log(post.likes)
     console.log(post.likes.length)


  }
}
