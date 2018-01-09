import {Injectable} from '@angular/core';


export type YearMonthObj<T> = {
  [year: number]: {
    [month: number]: T
  }
}


@Injectable()
export class CalendarService {

  private cache: YearMonthObj<number[][]> = {};

  constructor() {}

  public getCalendar(year: number, month: number): (number | '')[][] {
    if (this.cache[year] && this.cache[year][month]) {
      return this.cache[year][month];
    }

    let calendar = [];

    let day = 1;
    const firstDay = new Date(year, month, day);
    // week starts on Monday
    let startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const daysInMonth = CalendarService.getMonthDays(year);

    let haveDays = true;
    let i = 0;
    while (haveDays) {
      calendar[i] = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0) {
          if (j === startDay) {
            calendar[i][j] = day++;
            startDay++;
          }
        } else if (day <= daysInMonth[month]) {
          calendar[i][j] = day++;
        } else {
          calendar[i][j] = '';
          haveDays = false;
        }
        if (day > daysInMonth[month]) {
          haveDays = false;
        }
      }
      i++;
    }

    if (!this.cache[year])
      this.cache[year] = {};
    this.cache[year][month] = calendar;
    return this.cache[year][month];
  }

  public static getMonthDays(year: number): number[] {
    return [31, (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) ? 29 : 28,
      31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
  }

}
