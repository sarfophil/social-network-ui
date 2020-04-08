import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../app/pages/login/login.component';
import { HomeComponent } from '../app/pages/home/home.component';
import { ProfileComponent } from '../app/pages/profile/profile.component';
import { FollowersComponent } from './pages/ui-components/followers/followers.component'
import { PostsComponent } from './pages/ui-components/posts/posts.component';
import { AdminComponent } from './pages/admin/admin.component';
import { KeywordComponent } from './pages/admin-ui-components/keyword/keyword.component';
import { PostReviewComponent } from './pages/admin-ui-components/post-review/post-review.component';
import { AccountReviewComponent } from './pages/admin-ui-components/account-review/account-review.component';
import { AdvertComponent } from './pages/admin-ui-components/advert/advert.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component'

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
    component: HomeComponent
  },
  {
    path: 'profile/:userId',
    component: ProfileComponent,
    children: [
      {
        path: '',
        redirectTo:'/timeline',
        pathMatch:'full'
      },
      {
        path: 'timeline',
        component: PostsComponent
      },
      {
        path: 'followers',
        component: FollowersComponent
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
        component: AccountReviewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
