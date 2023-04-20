import { TestBed } from '@angular/core/testing';

import { EuriborValuesServiceService } from './euribor-values-service.service';

describe('EuriborValuesServiceService', () => {
  let service: EuriborValuesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EuriborValuesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
