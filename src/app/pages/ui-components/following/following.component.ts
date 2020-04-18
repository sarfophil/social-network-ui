import {Component, OnInit} from '@angular/core';
import {API_TYPE} from "../../../model/apiType";
import {FollowerResponse} from "../../../model/follower-response";
import {ProviderService} from "../../../service/provider-service/provider.service";
import {NgxPubSubService} from "@pscoped/ngx-pub-sub";
import {User} from "../../../model/user";
import {ActivatedRoute, Router} from "@angular/router";
import {FollowButtonState} from "../follow-button/follow-button.component";

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {

  following:Array<FollowerResponse> = [];
  tempFollowingHolder: Array<FollowerResponse> = [];
  isLoading:boolean = true;
  user: User = JSON.parse(localStorage.getItem("active_user"))
  lookupUser: User;
  constructor(private providerService: ProviderService,private pubSub: NgxPubSubService,private router: Router,private route: ActivatedRoute) { }

  ngOnInit() {
    setTimeout(() => this.loadFriends(),2000)
    this.route.parent.data.subscribe((data) => {
      this.lookupUser = data.user;
    })
    this.subscribeUserFollowedEvent()
    this.subscribeUserUnFollowedEvent()
  }

  loadFriends(){
    let path = `${this.lookupUser._id}/following`;
    // @ts-ignore
    this.providerService.get(API_TYPE.USER, `${path}`,'')
      .subscribe(
        (response: Array<any>) => {
          this.following = []
          for(let res of response){
            let followerResponse: FollowerResponse = res.userId;
            followerResponse.isFollowing = this.isFollowing(followerResponse)
            this.following.push(followerResponse)
          }
          this.tempFollowingHolder = this.following
          this.isLoading = false
        },
        (error => {
          this.providerService.onTokenExpired(error.error,error.status)
          this.isLoading = false
        })

      )
  }

  subscribeUserFollowedEvent() {
    this.pubSub.subscribe('FOLLOWED_USER_EVENT', (res) => {
      this.loadFriends()
    })
  }

  subscribeUserUnFollowedEvent() {
    this.pubSub.subscribe('UNFOLLOWED_USER_EVENT', (res) => {
      this.loadFriends()
    })
  }

  search(value: any) {
    this.following = this.following.filter((follower) => {
      return follower.username.toLowerCase().indexOf(value.toLowerCase()) > -1
    })
    if(value.length == 0) this.following = this.tempFollowingHolder;
  }


  unfollow(follower$: FollowerResponse) {
    // find index from the follower array
    let indexOfFollower = this.following.findIndex((follower) => follower._id == follower$._id)

    // find index from temp follower array
    let indexOfTempFollower = this.tempFollowingHolder.findIndex((follower) => follower._id == follower$._id)


    // remove from array
    this.following.splice(indexOfFollower,1)
    this.tempFollowingHolder.splice(indexOfTempFollower,1)
    // /:userId/unfollow/:friendId
    let path = `${this.user._id}/unfollow/${follower$._id}`;
    this.providerService.put(API_TYPE.USER,path,{})
      .subscribe((res) => {
        this.pubSub.publishEvent('UNFOLLOWED_USER_EVENT', {
          friendId: follower$._id
        })
        this.loadFriends()
      },(error => console.log(`An error occured`)))
  }

  /**
   * Method performs a checkup if current user follows a specific user.
   * @param follower$
   */
  isFollowing(follower$: FollowerResponse): boolean{
      let findCurrentUser = follower$.followers.find((follower) => follower.userId == this.user._id)
      return !!findCurrentUser;
  }

  goToProfile($event: MouseEvent, id: any) {
    $event.preventDefault()
      this.router.navigateByUrl(`/home`,{ skipLocationChange: true})
        .then(res => {
          this.router.navigate([`/profile/${id}/timeline`])
        })
  }

  performAction($event:any,follower$:FollowerResponse) {
      // successfull unfollowed
     if($event.status === FollowButtonState.UNFOLLOW){


       // only publish event if its the current user's profile
       if(this.lookupUser._id === this.user._id){
         // find index from temp follower array
         let indexOfTempFollower = this.tempFollowingHolder.findIndex((follower) => follower._id == follower$._id)
         this.tempFollowingHolder.splice(indexOfTempFollower,1)



         // publish event to listeners
         this.pubSub.publishEvent('UNFOLLOWED_USER_EVENT', {
           friendId: follower$._id
         })
       }

       // refresh
       this.loadFriends()

     } else if($event.status === FollowButtonState.FOLLOW) {
       // publish event to listeners
       // only publish event if its the current user's profile
       if(this.lookupUser._id === this.user._id){
         this.pubSub.publishEvent('FOLLOWED_USER_EVENT', {
           friendId: follower$._id
         })
       }
     }
  }


}
