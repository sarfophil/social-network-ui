import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../../model/user";
import {FollowerResponse} from "../../../model/follower-response";
import {API_TYPE} from "../../../model/apiType";
import {ProviderService} from "../../../service/provider-service/provider.service";
import {NgxPubSubService} from "@pscoped/ngx-pub-sub";

export enum FollowButtonState {
  FOLLOW,UNFOLLOW,UNDEFINED
}

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.css']
})
export class FollowButtonComponent implements OnInit {

  private readonly user : User = JSON.parse(localStorage.getItem('active_user'))

  @Input("followData") followData: FollowerResponse;

  // Default button state
  buttonState: FollowButtonState = FollowButtonState.UNDEFINED;

  // action
  @Output("action") action = new EventEmitter()

  constructor(private providerService: ProviderService,private pubSubService: NgxPubSubService) { }

  ngOnInit() {
    this.isFollowing(this.followData)
    this.subscribeUserFollowedEvent()
    this.subscribeUserUnFollowedEvent()
  }


  subscribeUserFollowedEvent() {
    this.pubSubService.subscribe('FOLLOWED_USER_EVENT', (res) => {
      this.buttonState = FollowButtonState.UNFOLLOW
    })
  }

  subscribeUserUnFollowedEvent() {
    this.pubSubService.subscribe('UNFOLLOWED_USER_EVENT', (res) => {
      this.buttonState = FollowButtonState.FOLLOW
    })
  }

  /**
   * Method performs a checkup if current user follows a specific user.
   * @param follower$
   */
  isFollowing(follower$: FollowerResponse): void{

    if(follower$){

      // check if user is not current user
      if(follower$._id === this.user._id){
        this.buttonState = FollowButtonState.UNDEFINED
      }else{
        let findCurrentUser = follower$.followers.find((follower) => {
          return follower.userId == this.user._id
        })

        if(findCurrentUser){
          // user is following
          this.buttonState = FollowButtonState.UNFOLLOW
        }else{
          // user is not following
          this.buttonState = FollowButtonState.FOLLOW
        }
      }

    }


  }

  unfollow() {
    // find index from the follower array
    let indexOfFollower = this.followData.following.findIndex((follower) => follower._id == this.followData._id)

    // remove from array
    this.followData.following.splice(indexOfFollower,1)

    let path = `${this.user._id}/unfollow/${this.followData._id}`;
    this.providerService.put(API_TYPE.USER,path,{})
    .subscribe((res) => {
        this.buttonState = FollowButtonState.FOLLOW
        this.action.emit({status: FollowButtonState.UNFOLLOW})
      },
      (error => this.action.emit({status: null}))
    )
  }

  follow() {
    let path = `${this.user._id}/follow/${this.followData._id}`;

    this.providerService.put(API_TYPE.USER, path, {})
      .subscribe((res) => {
        this.buttonState = FollowButtonState.UNFOLLOW
        this.action.emit({status: FollowButtonState.FOLLOW})
      },
      (error => this.action.emit({status: null})))
  }
}
