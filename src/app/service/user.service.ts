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

  // followUser(userId) {
  //   const user = JSON.parse(localStorage.getItem('active_user'))._id;
  //   const url: string = getServerURL('users/follow');
  //   return this.http.post(url, { _id: userId });
  // }

  // unFollowUser(userId) {
  //   const url: string = getServerURL('users/unfollow');
  //   return this.http.post(url, { _id: userId });
  // }

}
