import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../app/pages/login/login.component';
import { HomeComponent } from '../app/pages/home/home.component';
import { ProfileComponent } from '../app/pages/profile/profile.component';
import { FollowersComponent } from './pages/ui-components/followers/followers.component'
import { PostsComponent } from './pages/ui-components/posts/posts.component';


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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
