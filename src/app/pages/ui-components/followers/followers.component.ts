import { Component, OnInit, Output } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {

  constructor(private userService: UserService) { }

  user: User;
  followers: Array<User>;
  loading = false;
  userId = JSON.parse(localStorage.getItem('active_user'))._id;

  ngOnInit() {
    this.followers = this.getFollowers();

  }

  ngOnDestroy() {
  }

  getUser() {
    this.loading = true;
    return this.userService
      .getUserById(this.user._id);
  }

  getFollowers(): Array<User> {
    this.loading = true;
    return this.userService
      .getFollowers(this.userId);
  }

  isFollowing(follower): boolean {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < follower.userId.followers.length; i++) {
      if (follower.userId.followers[i].userId === this.userId) {
        return true;
      }

    }
    return false;
  }

  followUser(person) {
    console.log(person);
    this.userService
      .followUser(person)
      .subscribe((data: User) => {
        this.followers.push(data);
      });
  }

  unFollowUser(person) {
    console.log(person);
    this.userService
      .unFollowUser(person)
      .subscribe((data: User) => {
        this.followers.splice(this.followers.indexOf(data), 1);
      });
  }

  searchFriend(friend) {
    this.userService
      .searchFriend(friend);
  }


}
