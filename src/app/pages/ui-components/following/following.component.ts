import { Component, OnInit } from '@angular/core';
import {API_TYPE} from "../../../model/apiType";
import {FollowerResponse} from "../../../model/follower-response";
import {ProviderService} from "../../../service/provider-service/provider.service";
import {NgxPubSubService} from "@pscoped/ngx-pub-sub";
import {User} from "../../../model/user";

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
  constructor(private providerService: ProviderService,private pubSub: NgxPubSubService) { }

  ngOnInit() {
    setTimeout(() => this.loadFriends(),2000)
  }

  loadFriends(){
    let path = `following`;
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
      return findCurrentUser? true : false;
  }
}
