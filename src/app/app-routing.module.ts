import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FollowersComponent } from './pages/ui-components/followers/followers.component'
import { AdminComponent } from './pages/admin/admin.component';
import { KeywordComponent } from './pages/admin-ui-components/keyword/keyword.component';
import { PostReviewComponent } from './pages/admin-ui-components/post-review/post-review.component';
import { AdvertComponent } from './pages/admin-ui-components/advert/advert.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component'
import { CanActivateTeamService } from './service/canActivateTeam/can-activate-team.service';
import { SearchComponent } from './pages/search/search.component';
import { AdminAccountReviewComponent } from './pages/admin-ui-components/admin-account-review/admin-account-review.component';

import { NotfoundComponent } from './pages/notfound/notfound.component';

import {TimelineComponent} from "./pages/ui-components/timeline/timeline.component";
import {UserResolverService} from "./service/user-resolver/user-resolver.service";
import {FollowingComponent} from "./pages/ui-components/following/following.component";
import { AllUsersComponent } from './pages/ui-components/all-users/all-users.component';
import {AdBannerComponent} from "./pages/ui-components/ad-banner/ad-banner.component";
import {AdResolverService} from "./service/adResolver/ad-resolver.service";
import {FriendsComponent} from "./pages/friends/friends.component";


const routes: Routes = [
  {
    path: '',
    redirectTo:'/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [CanActivateTeamService],
    data:{role: ['USER_ROLE']}
  },
  {
    path: 'profile/:userId',
    component: ProfileComponent,
    data: {role: ['USER_ROLE']},
    canActivate: [CanActivateTeamService],
    resolve: {
      user: UserResolverService
    },
    children: [
      {
        path: '',
        redirectTo:'/timeline',
        pathMatch:'full'
      },
      {
        path: 'timeline',
        component: TimelineComponent,
        data: {role: ['USER_ROLE']},
        canActivateChild: [CanActivateTeamService]
      },
      {
        path: 'followers',
        component: FollowersComponent,
        data: {role: ['USER_ROLE']},
        canActivateChild: [CanActivateTeamService]
      },
      {
        path: 'following',
        component: FollowingComponent,
        data: {role: ['USER_ROLE']},
        canActivateChild: [CanActivateTeamService]
      },
      {
        path: 'all-users',
        component: AllUsersComponent,
        data: {role: ['USER_ROLE']},
        canActivateChild: [CanActivateTeamService]
      }
    ]
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent
  },
  {
    path: 'admin/dashboard',
    component: AdminComponent,
    canActivate: [CanActivateTeamService],
    children: [
      {
        path: '',
        redirectTo: '/admin/dashboard/ads',
        pathMatch: 'full'
      },
      {
        path: 'ads',
        component: AdvertComponent
      },
      {
        path: '/ads/:adId',
        component: AdvertComponent
      },
      {
        path: 'keywords',
        component: KeywordComponent
      },
      {
        path: 'keywords/:wordId',
        component: KeywordComponent
      },
      {
        path: 'posts/reviews',
        component: PostReviewComponent
      },
      {
        path: 'accounts/reviews',
        component: AdminAccountReviewComponent
      }
    ]
  },
  {
    path: 'search/:username',
    component: SearchComponent,
    canActivate: [CanActivateTeamService],
    data: {role: ['USER_ROLE']}
  },
  {
    path: '404',
    component: NotfoundComponent
  },
  {
    path: 'ads/:adId',
    component: AdBannerComponent,
    resolve: {
      user: AdResolverService
    }
  },
  {
    path: 'friends',
    component: FriendsComponent,
    canActivate: [CanActivateTeamService],
    data: {role: ['USER_ROLE']}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
