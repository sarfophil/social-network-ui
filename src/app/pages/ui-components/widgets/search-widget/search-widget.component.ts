import { Component, OnInit } from '@angular/core';
import lottie from "lottie-web"

@Component({
  selector: 'app-search-widget',
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.css']
})
export class SearchWidgetComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.searchAnimie()
  }

  searchAnimie(){
    lottie.loadAnimation({
      container: document.getElementById('searchBox'),
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: '../../../../../assets/lottie/3882-joindetail.json'
    })
  }

}
