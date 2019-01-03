import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBatchDialogComponent } from './update-batch-dialog.component';

describe('UpdateBatchDialogComponent', () => {
  let component: UpdateBatchDialogComponent;
  let fixture: ComponentFixture<UpdateBatchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateBatchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
