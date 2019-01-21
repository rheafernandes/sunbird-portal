import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchCardComponent } from './batch-card.component';

describe('BatchCardComponent', () => {
  let component: BatchCardComponent;
  let fixture: ComponentFixture<BatchCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
