import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentRoute:String = 'profile';

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.renderPage()
  }

  renderPage(){
    console.log(this.route.pathFromRoot)
  }

}
