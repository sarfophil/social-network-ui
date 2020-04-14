import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProviderService} from "../../../service/provider-service/provider.service";
import {API_TYPE} from "../../../model/apiType";
import {User} from "../../../model/user";
import {NgxPubSubService} from "@pscoped/ngx-pub-sub";
import {FollowerResponse} from "../../../model/follower-response";



@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {


  followers:Array<FollowerResponse> = [];
  tempFollowersHolder: Array<FollowerResponse> = []
  user: User = JSON.parse(localStorage.getItem("active_user"))
  isLoading: Boolean = true;
  constructor(private route: ActivatedRoute,private providerService: ProviderService,private pubSub: NgxPubSubService) { }

  ngOnInit() {
      setTimeout(() => this.loadFollowers(),2000)
  }


  loadFollowers(){
      let path = `followers`;
      // @ts-ignore
    this.providerService.get(API_TYPE.USER, `${path}`,'')
       .subscribe(
          (response: Array<any>) => {
            this.followers = []
            for(let res of response){
              let followerResponse: FollowerResponse = res.userId;
              followerResponse.isFollowing = this.isFollowing(followerResponse)
              this.followers.push(followerResponse)
            }
            this.tempFollowersHolder = this.followers
            this.isLoading = false
          },
         (error => {
             this.providerService.onTokenExpired(error.error,error.status)
             this.isLoading = false
         })

       )
  }

  /**
   * Method performs a checkup if current user follows a specific user.
   * @param follower$
   */
  isFollowing(follower$: FollowerResponse): boolean{
    let findCurrentUser = follower$.followers.find((follower) => follower.userId == this.user._id)
    return findCurrentUser? true : false;
  }

  search(value: String) {
      this.followers = this.followers.filter((follower) => {
         return follower.username.toLowerCase().indexOf(value.toLowerCase()) > -1
      })
      if(value.length == 0) this.followers = this.tempFollowersHolder;
  }

  follow(follower$: FollowerResponse) {

    follower$.isFollowing = true
    let path = `${this.user._id}/follow/${follower$._id}`;

    this.providerService.put(API_TYPE.USER,path,{})
      .subscribe((res) => {
        this.pubSub.publishEvent('FOLLOWED_USER_EVENT', {
          friendId: follower$._id
        })
        this.loadFollowers()
      },(error => console.log(`An error occured`)))
  }

}
