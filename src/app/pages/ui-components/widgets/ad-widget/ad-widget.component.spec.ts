import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdWidgetComponent } from './ad-widget.component';

describe('AdWidgetComponent', () => {
  let component: AdWidgetComponent;
  let fixture: ComponentFixture<AdWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
