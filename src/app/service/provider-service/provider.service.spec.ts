import { TestBed } from '@angular/core/testing';

import { ProviderService } from './provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { HttpParams } from '@angular/common/http';

describe('AdminServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProviderService = TestBed.get(ProviderService);
    expect(service).toBeTruthy();
  });

  it('should return data',() => {
    const service: ProviderService = TestBed.get(ProviderService);
    const params = new HttpParams();
    params.set('limit','5');
    service.get(API_TYPE.USER,'posts',params)
      .subscribe(res => {
          expect(res).toBeFalsy()
      })
  })
});
