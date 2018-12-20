import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseBatchService } from '../../../services';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import {  UserService } from '@sunbird/core';
import { Subject,  of as observableOf, Observable } from 'rxjs';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-update-batch-dialog',
  templateUrl: './update-batch-dialog.component.html',
  styleUrls: ['./update-batch-dialog.component.css']
})
export class UpdateBatchDialogComponent implements OnInit {

  courseId = this.route.snapshot.paramMap.get('courseId');
  shouldSizeUpdate: boolean;
  breakpoint: number;
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private route: ActivatedRoute,
    courseBatchService: CourseBatchService,
    public userService: UserService,
    public configService: ConfigService,
    public dialogRef: MatDialogRef<UpdateBatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.shouldSizeUpdate = data.shouldSizeUpdate;
      this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
    }
     onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 550) ? 1 : 1;
    if (this.shouldSizeUpdate) { this.updateSize(); }
    const orddata = {
      filters: {
      courseId: this.courseId
    }
  };

}
  updateSize() {
    this.dialogRef.updateSize('600px', '300px');
}
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 550) ? 1 : 1;
  }
  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.fruits.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.fruitCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }
}
