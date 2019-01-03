import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, DoCheck } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';


export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
}
@Component({
  selector: 'app-home-calendar-card',
  templateUrl: './home-calendar-card.component.html',
  styleUrls: ['./home-calendar-card.component.css'],
  providers: [DatePipe]

})
/**
 *  HomeCalendarCardComponent
 */
export class HomeCalendarCardComponent implements OnInit, OnChanges {
  currentDate = moment();
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];
  flag = true;

  @Input() selectedDates: CalendarDate[] = [];
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSelectDate = new EventEmitter<CalendarDate>();

  constructor() {}
sessionDates = [{
'sessionEndDate' : 'Wed Jan 02 2019 00:00:00 GMT+0530 (India Standard Time)',
'sessionStartDate': 'Wed Dec 29 2018 00:00:00 GMT+0530 (India Standard Time)',
'sessionTime': '01:00 am',
'sessionTitle': 'java',
},
{
'sessionEndDate' : 'Wed Jan 02 2019 00:00:00 GMT+0530 (India Standard Time)',
'sessionStartDate': 'Wed Jan 01 2019 00:00:00 GMT+0530 (India Standard Time)',
'sessionTime': '01:00 am',
'sessionTitle': 'java',
'sessionUrl': 'http://www.niit',
'status': 'published'},
{
  'sessionEndDate' : 'Wed Jan 02 2019 00:00:00 GMT+0530 (India Standard Time)',
'sessionStartDate': 'Wed Jan 08 2019 00:00:00 GMT+0530 (India Standard Time)',
'sessionTime': '01:00 am',
'sessionTitle': 'java',
}];
  ngOnInit(): void {
    this.generateCalendar();
    console.log('length', this.sessionDates.length);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDates &&
        changes.selectedDates.currentValue &&
        changes.selectedDates.currentValue.length  > 1) {
      // sort on date changes for better performance when range checking
      this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: CalendarDate) => m.mDate.valueOf());
      this.generateCalendar();
    }
  }
  // ngDoCheck() {
  //   this.isSesstion();
  // }

  // date checkers
show() {
  this.flag = false;
}
  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.Moment): boolean {
    return _.findIndex(this.selectedDates, (selectedDate) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }

  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }

  selectDate(date: CalendarDate): void {
    this.onSelectDate.emit(date);
  }

  prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  firstMonth(): void {
    this.currentDate = moment(this.currentDate).startOf('year');
    this.generateCalendar();
  }

  lastMonth(): void {
    this.currentDate = moment(this.currentDate).endOf('year');
    this.generateCalendar();
  }

  prevYear(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'year');
    this.generateCalendar();
  }

  nextYear(): void {
    this.currentDate = moment(this.currentDate).add(1, 'year');
    this.generateCalendar();
  }

  // generate the calendar gridconsole.log('thia dates', dates);

  generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
    console.log('thia dates', dates);
    const weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
    console.log('weeks', this.weeks);
  }

  fillDates(currentMoment: moment.Moment): CalendarDate[] {
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42)
            .map((date: number): CalendarDate => {
              const d = moment(firstDayOfGrid).date(date);
              return {
                today: this.isToday(d),
                selected: this.isSelected(d),
                mDate: d,
              };
            });
  }

}
