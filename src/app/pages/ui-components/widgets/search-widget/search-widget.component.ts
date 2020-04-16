import {Component, OnDestroy, OnInit} from '@angular/core';
import lottie from "lottie-web"
import {Observable, Subject} from "rxjs";
import {ProviderService} from "../../../../service/provider-service/provider.service";
import {debounceTime, distinctUntilChanged, filter, map, mergeMap, switchMap} from "rxjs/operators";
import {API_TYPE} from "../../../../model/apiType";
import {User} from "../../../../model/user";
import {state, style, trigger} from "@angular/animations";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxPubSubService} from "@pscoped/ngx-pub-sub";
import {Location} from "@angular/common";

/**
 * Search Response
 */
export class SearchResponse {
    user: User;
    isAFollower: Boolean = false

    constructor(user: User,isAFollower:Boolean) {
      this.user = user
      this.isAFollower = isAFollower
    }
}

@Component({
  selector: 'app-search-widget',
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.css'],
  animations: [
    trigger('animationTrigger',[
      state('open',style({
          display: 'block'
      })),
      state('close',style({
          display: 'none'
      })),
      state('showloader',style({
        display: 'block'
      }))
    ])
  ],
  providers: [Location]
})
export class SearchWidgetComponent implements OnInit,OnDestroy {
  searchTopic$: Subject<String> = new Subject<String>();
  search$: Observable<any>;
  currentUser: User;
  searchResult: Array<SearchResponse> = [];
  onKeyUpEvent:Boolean = true;
  lottieAnimation: any;
  showProgressSpinner: Boolean = false;
  constructor(private provider: ProviderService,private route: ActivatedRoute,
              private snackbar:MatSnackBar,private pubSub: NgxPubSubService,
              private _router: Router,private location: Location) { }

  ngOnInit() {
    this.searchAnimie();
    this.doSearch()

    // Find User
    this.route.data.subscribe((data: any) => {
        this.currentUser = data.user;
    })
  }

  searchAnimie(){
    this.lottieAnimation = lottie.loadAnimation({
      container: document.getElementById('searchBox'),
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'assets/lottie/3882-joindetail.json'
    })
  }

  doSearch(){
    this.search$ = this.searchTopic$.pipe(
          filter((value) => {
            if(value.length > 2) this.onKeyUpEvent = false
            return value.length > 2
          }),
          debounceTime(10),
          distinctUntilChanged(),
          switchMap((value) => {
            this.showProgressSpinner = true;
            return this.performSearchRequest(value)
          }),
          map((users:Array<SearchResponse>) => {
            let searchResult$processed:Array<SearchResponse> = []
            users.map((search) => {
              if(search.user._id != this.currentUser._id)
                searchResult$processed.push(search)
            })
            this.showProgressSpinner = false;
            return searchResult$processed;
          })
    )
  }

  onSearch(value:string){
    if(value.length == 0){
       this.onKeyUpEvent = true
    }else{
      this.onKeyUpEvent = false
      this.searchTopic$.next(value);
    }
  }

  performSearchRequest(value: String): Observable<Array<SearchResponse>>{
    return new Observable<Array<SearchResponse>>((observer) => {
        let queryParam = `?username=${value}&limit=5&skip=0`;
        this.provider.get(API_TYPE.USER,'search',queryParam)
          .subscribe((res: Array<User>)=> {
              for(let user of res){
                let isAFollowerAlready = user.followers.find((follower: any) => follower.userId == this.currentUser._id)
                let searchModel;
                if(!isAFollowerAlready){
                  searchModel = new SearchResponse(user,false)
                }else{
                  searchModel = new SearchResponse(user,true)
                }
                //clear
                this.searchResult = [];
                this.searchResult.push(searchModel)

              }
              observer.next(this.searchResult)
          },(error => observer.next(this.searchResult)))
    })
  }


  ngOnDestroy(): void {
  }


  follow(user: User,event: MouseEvent) {
    event.preventDefault();
    let findIndex = this.searchResult.findIndex((result) => user._id == result.user._id)
    if(findIndex != -1) {
       this.searchResult[findIndex].isAFollower = true;
    }
    let path = `${this.currentUser._id}/follow/${user._id}`;
    this.provider.put(API_TYPE.USER,path,{})
      .subscribe((res) => {
          console.log(`Publishing Event`)
          this.pubSub.publishEvent('FOLLOWED_USER_EVENT', {
              friendId: user._id
          })
      },error => {
          this.snackbar.open('Unable to submit request','OK')
      })
  }

  unfollow(user: User, $event: MouseEvent) {
    $event.preventDefault();
    let findIndex = this.searchResult.findIndex((result) => user._id == result.user._id)
    if(findIndex != -1) {
      this.searchResult[findIndex].isAFollower = false;
    }

    // /:userId/unfollow/:friendId
    let path = `${this.currentUser._id}/unfollow/${user._id}`;
    this.provider.put(API_TYPE.USER, path,{}).subscribe((res) => {
      //  console.log(`Publishing Event`)
        this.pubSub.publishEvent('UNFOLLOWED_USER_EVENT', {
            friendId: user._id
        })
    })
  }

  goToUserProfile($event: MouseEvent,result:SearchResponse) {
    $event.preventDefault()
    this._router.navigateByUrl('/home',{skipLocationChange: true})
      .then(()=> {
        console.log(this.location.path())
        this._router.navigate(['/profile/'+result.user._id+'/timeline'])
      })
  }
}

