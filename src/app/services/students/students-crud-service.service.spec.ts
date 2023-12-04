import { TestBed } from '@angular/core/testing';

import { StudentsCrudServiceService } from './students-crud-service.service';

describe('StudentsCrudServiceService', () => {
  let service: StudentsCrudServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentsCrudServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
