import { TestBed } from '@angular/core/testing';

import { MaxcalculationsService } from './maxcalculations.service';

describe('MaxcalculationsService', () => {
  let service: MaxcalculationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaxcalculationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
