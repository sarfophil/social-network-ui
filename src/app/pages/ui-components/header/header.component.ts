import { Component, OnInit, HostListener, Input } from '@angular/core';
import {trigger,state,style,transition, animate} from '@angular/animations';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('slideToggle',[
      state('open',style({
         display: 'block'
      })),
      state('close',style({
        display: 'none'
      })),
      transition('open => close',[
        animate('0.1s 100ms ease-out')
      ]),
      // search state
      state('openSearch', style({
        opacity: '1',
        visibility: 'visible'
      })),
      state('closeSearch',style({
         opacity: '0',
         visibility: 'none'
      })),
      // profile Dropdown
      state('openProfile',style({
        display: 'block'
      })),  
      state('closeProfile',style({
        display: 'none'
     }))
    ])
    
  ]
})
export class HeaderComponent implements OnInit {
  isOpen = false;
  isSearchInputOpen = false;
  isProfileOpen = false;

  @Input() headerType: string;

  constructor() { }

  ngOnInit() {
  }

  expandNotification(){
    this.isOpen = !this.isOpen
  }


  toggleSearch(){
    this.isSearchInputOpen = !this.isSearchInputOpen
  }

  openProfileDropdown(){
    this.isProfileOpen = !this.isProfileOpen;
  }

  @HostListener('document:click',['$event'])
  onDocumentClick(event: MouseEvent){
    console.log(event)
  }


}
