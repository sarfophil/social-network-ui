import { Component, OnInit } from '@angular/core';
import { FollowerResponse } from 'src/app/model/follower-response';
import { User } from 'src/app/model/user';
import { ActivatedRoute } from '@angular/router';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { API_TYPE } from 'src/app/model/apiType';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

  allUsers: Array<FollowerResponse> = [];
  tempUsersHolder: Array<FollowerResponse> = [];

  following:Array<FollowerResponse> = [];
  tempFollowingHolder: Array<FollowerResponse> = [];

  followers: Array<FollowerResponse> = [];
  tempFollowersHolder: Array<FollowerResponse> = [];

  user: User = JSON.parse(localStorage.getItem("active_user"));
  isLoading: Boolean = true;
  constructor(private route: ActivatedRoute, private providerService: ProviderService, private pubSub: NgxPubSubService) { }

  ngOnInit() {
    setTimeout(() => this.loadUsers(), 2000)
  }

  loadUsers() {
    let path = `all-users`;
    // @ts-ignore
    this.providerService.get(API_TYPE.USER, `${path}`, '')
      .subscribe(
        (response: Array<any>) => {
          this.allUsers = response;
          this.tempUsersHolder=this.allUsers;
          this.isLoading = false;
        },
        (error => {
          this.providerService.onTokenExpired(error.error, error.status);
          this.isLoading = false;
        })

      )
  }

  /**
   * Method performs a checkup if current user follows a specific user.
   * @param follower$
   */
  isFollowing(follower$: FollowerResponse): boolean {
    let findCurrentUser = follower$.followers.find((follower) => follower.userId == this.user._id)
    return findCurrentUser ? true : false;
  }

  search(value: String) {
    this.allUsers = this.allUsers.filter((userx) => {
      return userx.username.toLowerCase().indexOf(value.toLowerCase()) > -1
    })
    if (value.length == 0) this.allUsers = this.tempUsersHolder;
  }

  follow(follower$: FollowerResponse) {

    follower$.isFollowing = true
    let path = `${this.user._id}/follow/${follower$._id}`;
    this.following.push(follower$);
    this.providerService.put(API_TYPE.USER, path, {})
      .subscribe((res) => {
        this.pubSub.publishEvent('FOLLOWED_USER_EVENT', {
          friendId: follower$._id
        })
        //this.ngOnInit();
      }, (error => console.log(`An error occured`)));

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
        });
        this.loadUsers();
      },(error => console.log(`An error occured`)));
  }

}

