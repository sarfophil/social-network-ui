import { Component, OnInit, HostListener, Input, ElementRef } from '@angular/core';
import {trigger,state,style,transition, animate} from '@angular/animations';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { map, filter, debounce, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { User } from 'src/app/model/user';



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
  search$: Observable<any>;
  private searchText$ = new Subject<string>()
  currentuser: User = JSON.parse(localStorage.getItem('active_user'))

  // View All Link
  viewAllRoute:string = ''
  constructor(private router:Router,private _eref: ElementRef,private provider : ProviderService) { }

  ngOnInit() {
    this.search$ = this.searchText$.pipe(
        filter(text => text.length > 2),
        debounceTime(10),
        distinctUntilChanged(),
        switchMap((value) => this.provider.get(API_TYPE.POST,'search',`?query=${value}&limit=5&skip=0`))
    )
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
    if (!this._eref.nativeElement.contains(event.target)) {
      this.isSearchInputOpen = false
      this.isProfileOpen = false;
      this.isOpen = false;
    }
  }

  signout(){
    localStorage.clear()
    this.router.navigateByUrl('/login')
  }

  search(keyword:string){
    this.viewAllRoute = '/search/'.concat(keyword)
    keyword.length == 0 ? this.isOpen = false : this.isOpen = true;
    this.searchText$.next(keyword)
  }

  seeAll(){
    this.router.navigateByUrl(this.viewAllRoute)
  }


}
