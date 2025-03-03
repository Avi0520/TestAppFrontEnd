import { TestBed } from '@angular/core/testing';

import { UserStoarageService } from './user-stoarage.service';

describe('UserStoarageService', () => {
  let service: UserStoarageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStoarageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
