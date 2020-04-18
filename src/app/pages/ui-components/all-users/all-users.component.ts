import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FollowerResponse } from 'src/app/model/follower-response';
import { User } from 'src/app/model/user';
import { ActivatedRoute } from '@angular/router';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { API_TYPE } from 'src/app/model/apiType';
import { FollowButtonState } from '../follow-button/follow-button.component';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

  allUsers: Array<FollowerResponse> = [];
  tempUsersHolder: Array<FollowerResponse> = [];

  user: User = JSON.parse(localStorage.getItem("active_user"));
  lookupUser: User;
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
          this.allUsers = [];
          for (let res of response) {
            if (res._id !== this.user._id) {
              console.log(res._id);
              this.allUsers.push(res)
            }
          }
          this.tempUsersHolder = this.allUsers;
          this.isLoading = false;
        },
        (error => {
          this.providerService.onTokenExpired(error.error, error.status);
          this.isLoading = false;
        }))
  }

  search(value: String) {
    this.allUsers = this.allUsers.filter((userx) => {
      return userx.username.toLowerCase().indexOf(value.toLowerCase()) > -1
    })
    if (value.length == 0) this.allUsers = this.tempUsersHolder;
  }

  performAction($event: any, follower$: FollowerResponse) {
    // successfull unfollowed
    if ($event.status === FollowButtonState.UNFOLLOW) {

      // publish event to listeners

      if (this.lookupUser._id === this.user._id) {
        // find index from temp follower array
        let indexOfTempUser = this.tempUsersHolder.findIndex((follower) => follower._id == follower$._id)
        this.tempUsersHolder.splice(indexOfTempUser, 1)

        // only publish event if its the current user's profile
        this.pubSub.publishEvent('UNFOLLOWED_USER_EVENT', {
          friendId: follower$._id
        })
      }
    } else if ($event.status === FollowButtonState.FOLLOW) {
      // publish event to listeners
      // only publish event if its the current user's profile
      if (this.lookupUser._id === this.user._id) {
        this.pubSub.publishEvent('FOLLOWED_USER_EVENT', {
          friendId: follower$._id
        })
      }
    }
    this.loadUsers();
  }
}

