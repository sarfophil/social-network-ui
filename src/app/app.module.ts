import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

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
import { SearchWidgetComponent } from './pages/ui-components/widgets/search-widget/search-widget.component';
import { AdminComponent } from './pages/admin/admin.component';
import { MenuComponent } from './pages/admin-ui-components/menu/menu.component';
import { AdvertComponent } from './pages/admin-ui-components/advert/advert.component';
import { KeywordComponent } from './pages/admin-ui-components/keyword/keyword.component';
import { PostReviewComponent } from './pages/admin-ui-components/post-review/post-review.component';
import { AccountReviewComponent } from './pages/admin-ui-components/account-review/account-review.component';
import { SocketIoModule,SocketIoConfig } from 'ngx-socket-io'
import { environment } from 'src/environments/environment';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { LoginWidgetComponent } from './pages/ui-components/login-widget/login-widget.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ShortenPipe } from './pipe/shorten/shorten.pipe';
import { MomentPipe } from './pipe/moment/moment.pipe';
import { SearchComponent } from './pages/search/search.component';
import { CreatePostComponent } from './pages/ui-components/widgets/create-post/create-post.component';
import { ProfilePhotoComponent } from './pages/ui-components/profile-photo/profile-photo.component';
import { DateAgoPipe } from './pipe/dateAgoPipe';
import { EditPostComponent } from './pages/ui-components/widgets/edit-post/edit-post.component';


// socket config
const socketConfig: SocketIoConfig = {url: environment.socketEndpoint,options: {}}


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
    FollowersComponent,
    SearchWidgetComponent,
    AdminComponent,
    MenuComponent,
    AdvertComponent,
    KeywordComponent,
    PostReviewComponent,
    AccountReviewComponent,
    AdminLoginComponent,
    LoginWidgetComponent,
    ShortenPipe,
    MomentPipe,
    SearchComponent,
    CreatePostComponent,
    ProfilePhotoComponent,
    DateAgoPipe,
    EditPostComponent,
  ],
  imports: [
    BrowserModule,  
    HttpClientModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(socketConfig),
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [LoginWidgetComponent]
})
export class AppModule { }
