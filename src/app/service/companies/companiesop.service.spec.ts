import { TestBed } from '@angular/core/testing';

import { CompaniesopService } from './companiesop.service';

describe('CompaniesopService', () => {
  let service: CompaniesopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompaniesopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
