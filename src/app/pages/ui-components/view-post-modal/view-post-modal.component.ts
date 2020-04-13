import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from 'src/app/model/user';
import {ProviderService} from 'src/app/service/provider-service/provider.service';
import {API_TYPE} from 'src/app/model/apiType';
import {Comment} from 'src/app/model/comment';
import {Observable, Subscription} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Howl} from 'howler';
import {MatSnackBar} from "@angular/material/snack-bar";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {error} from "util";


export enum LoadingStrategy {
    DEFAULT, // Loads data from the beginning
    PARTIAL // Loads data based on the skip value
}

export interface TotalComments {
  comments:number
}

@Component({
  selector: 'app-view-post-modal',
  templateUrl: './view-post-modal.component.html',
  styleUrls: ['./view-post-modal.component.css'],
  animations: [
    trigger('isLoadingTrigger',[
      state('open',style({
         display: 'block'
      })),
      state('close',style({
        display: 'none'
      }))
    ]),
    trigger('makingRequestTrigger',[
       state('requesting',style({
           display: 'block'
       })),
       state('done',style({
           display: 'none'
       })),
       state('loadingImage',style({
          display: 'block'
       })),
       state('doneloading',style({
          display: 'none'
       })),
       transition('requesting => done',[
         animate('1s')
       ])
    ])
  ]
})
export class ViewPostModalComponent implements OnInit,OnDestroy {

  post: any;

  likes: string = '';

  currentUser: User = JSON.parse(localStorage.getItem('active_user'))

  /** Comment Data limit */
  private limit: number = 5;

  private  skip: number = 0;

  comments: Array<Comment> = [];

  // Proxy Array for processing of comments
  commentProxyDataList: Array<Comment> = [];

  isLoading: boolean = true;

  // Observable subscription
  subscription: Subscription;

  sound = new Howl({
    src: ['assets/sound/filling-your-inbox.mp3']
  });


  hasLiked: boolean = true;

  // Comment Input
  commentInput: string;

  //
  isCreatingCommentState: boolean = false;

  // Temporarily holds user comment and discards when posted successfully
  commentDataHolder : string = '';

  // total comments
  totalComments : number = 0;

  // current Image in src
  currentImagePreview: any;

  postImagesHolder: Array<SafeUrl> = [];

  // Flag to check state of fetching image
  isFetchingImages: boolean = true;

  // Current Index of the image
  currentImageIndex: number = 0;



  constructor(public dialogRef: MatDialogRef<ViewPostModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private provider:ProviderService,private snackBar: MatSnackBar,
              private sanitizer : DomSanitizer) { }

  ngOnInit() {
      this.post = this.data;
      this.populateLikes();
      this.loadComments(LoadingStrategy.PARTIAL);
      this.countComment();
      this.previewPostImages();

  }

  populateLikes() {
    this.likes = this.hasCurrentUserLiked() ?
      `You and ${this.post.likes.length - 1} people liked this`:
      `${this.post.likes.length} people liked this`;
  }

  hasCurrentUserLiked = (): Boolean =>{
      let likes = this.post.likes;
      for(let userId of likes){
         if(userId._id == this.currentUser._id) return true;
      }
      return false;
  }





  loadComments(loadingStrategy: LoadingStrategy){
    this.isLoading = true;
    let path = `${this.post._id}/comments?limit=${this.limit}&skip=${this.skip}`;
    this.subscription = this.provider.get(API_TYPE.POST,path,'')
      .pipe(
        filter((res: Array<Comment>) => res.length > 0),
        switchMap((res:Array<Comment>) => this.addResultToArray(res,loadingStrategy)),
        map((comments:Array<Comment>) => {
          return comments.sort((a:Comment,b:Comment) => {
            let comp1 = new Date(a.createdDate.toString());
            let comp2 = new Date(b.createdDate.toString());
            if(comp1 < comp2) return -1;

            if(comp1 < comp2) return 1;

            return 0
          })
        })
      )
      .subscribe(
        (data:Array<Comment>) => {
          this.isLoading = false;
          if(data.length > 0) {
            this.comments = data
          }
        },
        (err)=> {
          this.isLoading = false
        },
        () => {
           this.isLoading = false;
        }

        )

  }

  addResultToArray(res:Array<Comment>,loadingStrategy):Observable<Array<Comment>>{
    return new Observable<Array<Comment>>((resolve) => {
       if(loadingStrategy === LoadingStrategy.PARTIAL){
           for (const comment of res) {
             this.commentProxyDataList.push(comment)
           }
       }else {
          this.commentProxyDataList = res;
       }
       resolve.next(this.commentProxyDataList)
    })
  }




  viewMore($event: MouseEvent){
    $event.preventDefault();
    this.skip += 1 * this.limit;
    this.loadComments(LoadingStrategy.PARTIAL);

    // scroll to bottom
    let commentSection: HTMLElement = document.getElementById('commentSection');
    commentSection.scrollTop = commentSection.scrollHeight;
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeComment(comment$: Comment,event$: MouseEvent) {
      event$.preventDefault();
      let index = this.comments.findIndex((comment) => comment$._id === comment._id);
      this.comments.splice(index,1);
      let path = `${comment$.postId}/comments/${comment$._id}`;
      this.provider.delete(API_TYPE.POST,path).subscribe(
        (result) => {},
        (error) => {
            if(error){
                this.provider.onTokenExpired(error.responseMessage,error.statusCode)
            }
          },
        ()=>{
          let snackBar$ = this.snackBar.open(`Comment Removed !`,'Ok');
          this.sound.play()
        }
      )
  }

  createComment() {
      let path = `${this.post._id}/user/${this.currentUser._id}/comments`;
      let body = {
        "content": this.commentInput
      };
      this.commentDataHolder = this.commentInput; // Assigns comment to the holder
      this.isCreatingCommentState = true;
      this.provider.post(API_TYPE.POST,path,body)
        .subscribe((res) => {
          let snackBar$ = this.snackBar.open(`Comment Posted!`, 'OK');
          this.sound.play();
        },(error => {
            this.isCreatingCommentState = false;
            this.snackBar.open('An Error Occured');
            this.provider.onTokenExpired(error.responseMessage,error.statusCode)
        }),() => {
            this.commentInput = '';
            // Refresh
            this.skip = 0;
            this.loadComments(LoadingStrategy.DEFAULT);
            this.isCreatingCommentState = false;

            // scroll to bottom
            let commentSection: HTMLElement = document.getElementById('commentSection');
            commentSection.scrollTop = commentSection.scrollHeight;
        })
  }

  countComment(){
    let path = `${this.post._id}/comments/count`;
    let headerOption = {responseType: 'blob'}
     this.provider.get(API_TYPE.POST,path)
       .subscribe(
         (result:TotalComments) => {
              this.totalComments = result.comments
         }
       )
  }



  /**
   * Like Feature
   * @param action if true then user has liked else unliked
   */
  like(action: boolean) {
      let path = `${this.post._id}/user/${this.currentUser._id}/likes`;
      this.hasLiked = !action;

      if(action){
        this.likeClicked();
        let body = {};
        this.provider.put(API_TYPE.POST, path,body)
          .subscribe((res) => console.log(`Sent`))
      }else {
        this.unlikedClicked();
        this.provider.delete(API_TYPE.POST, path)
          .subscribe((res) => console.log(`Unliked`))
      }
  }

  likeClicked(): void{
    let totalLikes = this.post.likes.length + 1;
    this.likes = totalLikes == 1? `You liked this`:`You and ${totalLikes-1} people liked this`;
    console.log(totalLikes)
  }

  unlikedClicked(): void{
    let totalLikes = this.post.likes.length == 0? 0 : this.post.likes.length-1;
    this.likes = totalLikes == 0?'Be the first to like this':`${totalLikes} people liked this`;
  }

  nextImage(){
    this.currentImagePreview = this.postImagesHolder[this.currentImageIndex == this.postImagesHolder.length-1?
                                           this.postImagesHolder.length-1:this.currentImageIndex++]
  }

  prevImage(){
    this.currentImagePreview = this.postImagesHolder[this.currentImageIndex == 0?0:this.currentImageIndex-1]
  }

  /**
   * Preview Images
   */
  previewPostImages(){
    this.isFetchingImages = true;
    this.loadPostImages((res:boolean) =>{
        this.isFetchingImages = false;
        this.currentImagePreview = this.postImagesHolder[this.currentImageIndex]
    })
  }

  private loadPostImages(callback: Function) {
    let photos = this.post.imageLink;
    let waiting = photos.length;
    if (photos && photos.length > 0) {
      for (let photo of photos) {
        // @ts-ignore
        this.doRequestImage(photo,(url:SafeUrl) => {
            this.postImagesHolder.push(url);
            waiting--;
            this.complete(waiting,callback)
        });
      }
    }
    callback(false)
  }

  private complete(waiting:number,callback: Function){
      if(waiting == 0) callback(true)
  }

  // @ts-ignore
  private doRequestImage(image: string,callback: Function): void {
    let queryParam = `?imagename=${image}`;
    let headerOption = {responseType: 'blob'}
    this.provider.get(API_TYPE.DEFAULT, 'download',queryParam,headerOption)
      .subscribe(
        (res)=> {
           callback(this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res)))
        },
        (error => {
            callback(null)
        })
      )
  }


}
