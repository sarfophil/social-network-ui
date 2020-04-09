import { Component, OnInit, Input } from '@angular/core';
import { PostType } from 'src/app/model/post-type';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  @Input("pageType") pageType:PostType = PostType.HOMEPAGE_POSTS

  isSearchPage: Boolean;

  constructor() { }

  ngOnInit() {
    this.isSearchPage = this.pageType === PostType.SEARCH_POSTS;
  }

}
