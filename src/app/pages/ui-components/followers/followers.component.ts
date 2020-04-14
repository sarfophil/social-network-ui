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

  pp: boolean;
  user: User;
  people: Array<User>;
  followers: Array<User>;
  loading = false;
  userId = JSON.parse(localStorage.getItem('active_user'))._id;

  ngOnInit(): void {
    this.people = this.getPeople();
    this.followers = this.followUser();

  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
  }

  getUser() {
    this.loading = true;
    return this.userService
      .getUserById(this.user._id);
  }
  getPeople() {
    this.loading = true;
    return this.userService
      .getUsers();
  }

  followUser() {
    this.loading = true;
    return this.userService
      .getFollowers(this.userId);
  }
  isFollowing(person): boolean {
    if (!person || !person.followers) {
      return false;
    }
    const id = this.user._id;
    return person.followers.indexOf(id) > -1;
  }

  // unFollowUser(personId, index) {
  //   this.userService
  //     .unFollowUser(personId)
  //     .subscribe((data: IUser) => this.people.splice(index, 1, data));
  // }

  // searchPeople() {
  //   let type = this.getFeedType();
  //   this.userService
  //     .searchPeople(this.query.value, type)
  //     .finally(() => (this.loading = false))
  //     .subscribe(
  //       (data: Array<IUser>) => (this.people = data),
  //       (err) => console.error(err)
  //     );
  // }


}
