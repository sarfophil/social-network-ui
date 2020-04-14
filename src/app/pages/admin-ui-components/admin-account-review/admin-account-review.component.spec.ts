import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountReviewComponent } from './admin-account-review.component';

describe('AdminAccountReviewComponent', () => {
  let component: AdminAccountReviewComponent;
  let fixture: ComponentFixture<AdminAccountReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccountReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
