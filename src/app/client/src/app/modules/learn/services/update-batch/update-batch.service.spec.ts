import { TestBed, inject } from '@angular/core/testing';

import { UpdateBatchService } from './update-batch.service';

describe('UpdateBatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateBatchService]
    });
  });

  it('should be created', inject([UpdateBatchService], (service: UpdateBatchService) => {
    expect(service).toBeTruthy();
  }));
});
