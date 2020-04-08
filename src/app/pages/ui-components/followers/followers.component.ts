import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {

  followers:any = []

  constructor() { }

  ngOnInit() {
     this.followers = [
        {id: 1, name: 'James Azim',followers:4},
        {id: 2, name: 'Philip Sarfo',followers:3},
        {id: 3, name: 'Yome Fisseha',followers: 10},
        {id: 4, name: 'Yared Beyene',followers: 8},
        {id:5,  name: 'Tesfai Gebrekidan', followers: 20}
     ]
  }

}
