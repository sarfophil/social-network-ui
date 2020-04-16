import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { ProviderService } from './provider-service/provider.service';
import { API_TYPE } from '../model/apiType';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: Array<User>;
  private followers: Array<User>;
  private user: User;
  userId = JSON.parse(localStorage.getItem('active_user'))._id;
  constructor(private providerService: ProviderService) { }

  getUsers(): Array<User> {
    this.providerService.get(API_TYPE.USER, 'all', '')
      .subscribe((urs: Array<User>) => {
        this.users = urs;
        console.log(this.users);
      });
    return this.users;

  }

  getUserById(id) {
    this.providerService.get(API_TYPE.USER, `${id}`, '')
      .subscribe((ur: User) => {
        this.user = ur;
      });
    return this.user;
  }

  getFollowers(userId): Array<User> {
    this.providerService.get(API_TYPE.USER, `${userId}/followers`, '')
      .subscribe((urs: Array<User>) => {
        this.followers = urs;
      });
    return this.followers;

  }

  followUser(friend: User) {
    return this.providerService.put(API_TYPE.USER, `${this.userId}/follow/${friend._id}`, '');

  }

  unFollowUser(friend: User) {
    return this.providerService.put(API_TYPE.USER, `${this.userId}/unfollow/${friend._id}`, '');
  }
  searchFriend(friend) {
    for (let f of this.getFollowers(this.userId)) {
      if (f.username === friend) {

      }

    }
  }

}
