import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertComponentComponent } from './advert-component.component';

describe('AdvertComponentComponent', () => {
  let component: AdvertComponentComponent;
  let fixture: ComponentFixture<AdvertComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
