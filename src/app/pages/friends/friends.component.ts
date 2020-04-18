import {Component, OnInit} from '@angular/core';
import {state, style, trigger} from "@angular/animations";
import {ProviderService} from "../../service/provider-service/provider.service";
import {API_TYPE} from "../../model/apiType";
import {User} from "../../model/user";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FollowerResponse} from "../../model/follower-response";
import {filter, map} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
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
export class FriendsComponent implements OnInit {

  isLoading: Boolean = true;
  friendsList: Array<User> = [];
  private readonly activeUser : User = JSON.parse(localStorage.getItem("active_user"));
  private limit: number = 10;
  private skip: number = 0
  constructor(private providerService: ProviderService,private snackBar: MatSnackBar,private router: Router) { }

  ngOnInit() {
    this.loadFriends()
  }


  loadFriends(){
    let path = `all-users`
    this.providerService.get(API_TYPE.USER, path, `?limit=${this.limit}&skip=${this.skip}`)
      .pipe(
        map((res: Array<User>) => {
          return res.filter((user: User) => {
             return user._id !== this.activeUser._id
          })
        })
      )
      .subscribe(
        (res: Array<User>) => {
          this.friendsList = this.friendsList.concat(res)
        },
        (error => {
          this.snackBar.open(`Connection Problems. Please try again later`)
        }),
        () => {
          this.isLoading = false
        }
      )
  }

  // ts:ignore
  getFollowerData(user : User) : FollowerResponse{
    // @ts-ignore
    return {_id: user._id,username: String(user.username),followers: user.followers,following: user.following,profilePicture: user.profilePicture,isFollowing:false}
  }

  performAction($event: any, user: any) {

  }

  loadMore() {
    this.isLoading = true
    this.skip += 1;
    this.loadFriends()
  }

  next() {
    this.router.navigateByUrl('/home')
  }
}
