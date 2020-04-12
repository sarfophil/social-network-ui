import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPostModalComponent } from './view-post-modal.component';

describe('ViewPostModalComponent', () => {
  let component: ViewPostModalComponent;
  let fixture: ComponentFixture<ViewPostModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPostModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
