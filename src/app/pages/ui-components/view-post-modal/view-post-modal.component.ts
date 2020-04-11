import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/model/user';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { Comment } from 'src/app/model/comment';
import { pipe, Observable, of } from 'rxjs';
import { map, switchMap, catchError, take, flatMap, tap } from 'rxjs/operators';
import { state, trigger, style } from '@angular/animations';

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
    ])
  ]
})
export class ViewPostModalComponent implements OnInit {

  post: any;
  likes: string = ''
  currentUser: User = JSON.parse(localStorage.getItem('active_user'))

  /** Comment Data limit */
  private limit: number = 5;

  private  skip: number = 0;

  comments: Array<Comment> = []

  // Proxy Array for processing of comments
  commentProxyDataList: Array<Comment> = []

  isLoading: boolean = true;


  constructor(public dialogRef: MatDialogRef<ViewPostModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private provider:ProviderService) { }

  ngOnInit() {
      this.post = this.data;
      this.likes = this.hasCurrentUserLiked() ? 
            `You and ${this.post.likes.length - 1} people liked this`: 
            `${this.post.likes.length} people liked this`;
      this.loadComments()

  }

  hasCurrentUserLiked = (): Boolean =>{
      let likes = this.post.likes;
      for(let userId of likes){
         if(userId == this.currentUser._id) return true;
      }
      return false;
  }


  loadComments(){
    let path = `${this.post._id}/comments?limit=${this.limit}&skip=${this.skip}`
    this.provider.get(API_TYPE.POST,path,'')
    .pipe(
      switchMap((res:Array<Comment>) => this.addResultToArray(res)),
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
           this.isLoading = false
           this.comments = data
        },
        (err)=> {
          console.log(`Error Error`)
          this.isLoading = false
        }
        
    )

  }

  addResultToArray(res:Array<Comment>):Observable<Array<Comment>>{
    return new Observable<Array<Comment>>((resolve) => {
       for (const comment of res) {
          this.commentProxyDataList.push(comment)
       }
       resolve.next(this.commentProxyDataList)
    })
  }

  
  viewMore(){
    this.skip += 1 * this.limit;
  }

}
