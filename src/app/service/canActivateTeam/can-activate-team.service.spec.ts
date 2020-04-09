import { TestBed } from '@angular/core/testing';

import { CanActivateTeamService } from './can-activate-team.service';

describe('CanActivateTeamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanActivateTeamService = TestBed.get(CanActivateTeamService);
    expect(service).toBeTruthy();
  });
});
