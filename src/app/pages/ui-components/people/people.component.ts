import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  constructor(private userService: UserService) { }

  user: User;
  people: Array<User>;
  loading = false;
  userId = JSON.parse(localStorage.getItem('active_user'))._id;

  ngOnInit(): void {
    this.people = this.getPeople();

  }

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

  isFollowing(person): boolean {
    const id = this.userId;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < person.followers.length; i++) {
      if (person.followers[i].userId === id) {
        return true;
      }

    }
    return false;

  }

  followUser(person) {
    this.userService
      .followUser(person);
  }

  unFollowUser(person) {
    this.userService
      .unFollowUser(person);
  }

  searchFriend(friend) {
    this.userService
      .searchFriend(friend);
  }

}
