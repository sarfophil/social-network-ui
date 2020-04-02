import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './pages/ui-components/header/header.component';
import { AdWidgetComponent } from './pages/ui-components/widgets/ad-widget/ad-widget.component';
import { NotificationWidgetComponent } from './pages/ui-components/widgets/notification-widget/notification-widget.component';
import { ProfileWidgetComponent } from './pages/ui-components/widgets/profile-widget/profile-widget.component';
import { NearbyComponent } from './pages/ui-components/widgets/nearby/nearby.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PostsComponent } from './pages/ui-components/posts/posts.component';
import { FollowersComponent } from './pages/ui-components/followers/followers.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    AdWidgetComponent,
    NotificationWidgetComponent,
    ProfileWidgetComponent,
    NearbyComponent,
    ProfileComponent,
    PostsComponent,
    FollowersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
