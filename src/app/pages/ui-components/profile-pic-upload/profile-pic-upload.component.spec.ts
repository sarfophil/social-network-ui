import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePicUploadComponent } from './profile-pic-upload.component';

describe('ProfilePicUploadComponent', () => {
  let component: ProfilePicUploadComponent;
  let fixture: ComponentFixture<ProfilePicUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePicUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePicUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
