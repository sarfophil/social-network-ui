import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReviewComponent } from './account-review.component';

describe('AccountReviewComponent', () => {
  let component: AccountReviewComponent;
  let fixture: ComponentFixture<AccountReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
