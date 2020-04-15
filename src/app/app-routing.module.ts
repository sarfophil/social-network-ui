import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FollowersComponent } from './pages/ui-components/followers/followers.component'
import { PostsComponent } from './pages/ui-components/posts/posts.component';
import { AdminComponent } from './pages/admin/admin.component';
import { KeywordComponent } from './pages/admin-ui-components/keyword/keyword.component';
import { PostReviewComponent } from './pages/admin-ui-components/post-review/post-review.component';
import { AdvertComponent } from './pages/admin-ui-components/advert/advert.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component'
import { CanActivateTeamService } from './service/canActivateTeam/can-activate-team.service';
import { SearchComponent } from './pages/search/search.component';
import { PeopleComponent } from './pages/ui-components/people/people.component';

import { NotfoundComponent } from './pages/404/notfound/notfound.component';

import {TimelineComponent} from "./pages/ui-components/timeline/timeline.component";
import {UserResolverService} from "./service/user-resolver/user-resolver.service";
import {AuthguardService} from "./service/auth-guard/authguard.service";
import {FollowingComponent} from "./pages/ui-components/following/following.component";


const routes: Routes = [
  {
    path: '',
    redirectTo:'/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthguardService]
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
        // path: 'people',
        // component: PeopleComponent,
        path: 'following',
        component: FollowingComponent,
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
        path: 'keywords',
        component: KeywordComponent
      },
      {
        path: 'posts/reviews',
        component: PostReviewComponent
      },
      {
        path: 'accounts/reviews',
        component: PostReviewComponent //TODO: Add a new Component
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
    component: NotfoundComponent,
    canActivate: [CanActivateTeamService],
    data: {role: ['USER_ROLE','USER_ADMIN']}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
