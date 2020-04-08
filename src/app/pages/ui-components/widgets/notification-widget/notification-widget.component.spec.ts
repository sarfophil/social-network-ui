import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationWidgetComponent } from './notification-widget.component';

describe('NotificationWidgetComponent', () => {
  let component: NotificationWidgetComponent;
  let fixture: ComponentFixture<NotificationWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
