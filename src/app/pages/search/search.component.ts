import { Component, OnInit } from '@angular/core';
import { PostType } from 'src/app/model/post-type';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // Loading strategy for posts
  postState: PostType = PostType.SEARCH_POSTS

  searchQuery: String;

  constructor(private activeRoute:ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params
        .subscribe((keyword) => {
           this.searchQuery = keyword.username;
    })
  }



}
