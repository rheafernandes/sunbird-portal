import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBatchCardComponent } from './create-batch-card.component';

describe('CreateBatchCardComponent', () => {
  let component: CreateBatchCardComponent;
  let fixture: ComponentFixture<CreateBatchCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBatchCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBatchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
