import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { User } from 'src/app/model/user';
import { Post } from 'src/app/model/post';
import { PostType } from 'src/app/model/post-type';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  animations: [
    trigger('loadingPlaceholder', [
      state('open', style({
        display: 'show',
        animation: 'fadeIn ease-in 0.2s'
      })),
      state('close', style({
        display: 'none'
      })),
      transition('open => close', [
        animate('0s 1s ease-out')
      ])
    ])
  ]
})
export class PostsComponent implements OnInit {
  /** Useful when making a request to the server */
  showPlaceholder: Boolean = false;
  page = 0;
  limit = 4;

  /**
   * @description loadPosts method will depend on this decorator to load contents
   * Default value will home
   *
   */
  @Input('postState') postState: PostType = PostType.HOMEPAGE_POSTS

  /**
   * @description postData will recieve data from any parent component
   */
  @Input('postData') postData: any = '';

  post: Array<any> = []

  private currentUser: User = JSON.parse(localStorage.getItem('active_user'))
  private userId = JSON.parse(localStorage.getItem('active_user'))._id;
  private postId: {} = null;

  constructor(private provider: ProviderService) { }

  ngOnInit() {
    this.loadPosts(this.postState)
  }

  /**
   * @description Depends on postState to load data from the webservice
   * @param postType
   */
  loadPosts(postType: PostType) {

    let apiType: API_TYPE;
    let path = '';
    let queryParam = `?user=${this.currentUser._id}&page=0&limit=5`


    // Homepage posts
    if (postType === PostType.HOMEPAGE_POSTS) {
      apiType = API_TYPE.POST;
      path = ''
      queryParam = '?page=' + this.page + '&limit=' + this.limit + '';
    }

    // User posts
    if (postType === PostType.USER_POSTS) {
      apiType = API_TYPE.USER
      path = `${this.currentUser._id}/posts`
      queryParam = `?limit=5&skip=5`
    }

    // Search posts
    if (postType === PostType.SEARCH_POSTS) {
      apiType = API_TYPE.USER;
      path = 'search'
      queryParam = `?query=${this.postData}&limit=5`
    }

    this.load(path, queryParam);
    this.page += 1;

  }

  likeFilter(likes, id) {
    return likes.indexOf(id) !== -1;
  }

  loadMore() {
    let query = '?page=' + this.page + '&limit=' + this.limit + '';
    this.load('', query);
    this.page += 1;
  }


  load(path, query) {
    console.log('loading');
    this.provider.get(API_TYPE.POST, `${path}`, query == '' ? '' : query).subscribe(
      (res: Array<any>) => {
        console.log(res)
        this.post = this.post.concat(res);

        // const sortedActivities = this.post.sort((a, b) => b.createdDate - a.createdDate)
      },
      (error) => {
        console.log('Success' + error)

        this.showPlaceholder = false;
        this.provider.onTokenExpired(error.responseMessage, error.statusCode)
      },
      () => {
        console.log(`Complete {}`)
        console.log(this.post)

        this.showPlaceholder = true
      }
    )
  }

  loadNewData() {
    this.post=[];
    this.page = 0;
    this.limit = 4;
    let apiType = API_TYPE.POST;
    let path = ''
    let queryParam = '?page=' + this.page + '&limit=' + this.limit + '';
    this.load(path, queryParam);
    this.page += 1;
  }

  setPostId(pid){
    this.postId= {pid:pid,rand:Math.random()}
  }

  deletePost(pid){
    this.provider.delete(API_TYPE.POST,pid,'').subscribe(
      (res: Array<any>) => {
        console.log('Success' + res)
        this.loadNewData()
      },
      (error) => {
        console.log('Success' + error)

        this.showPlaceholder = false;
        this.provider.onTokenExpired(error.responseMessage, error.statusCode)
      },
      () => {
        console.log(`Complete {}`)
        this.showPlaceholder = true
      }
    )

  }
}
