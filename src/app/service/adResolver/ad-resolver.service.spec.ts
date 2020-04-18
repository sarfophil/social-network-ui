import { TestBed } from '@angular/core/testing';

import { AdResolverService } from './ad-resolver.service';

describe('AdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdResolverService = TestBed.get(AdResolverService);
    expect(service).toBeTruthy();
  });
});
