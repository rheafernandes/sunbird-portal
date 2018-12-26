import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSession',
})
export class FilterSessionPipe implements PipeTransform {

  filterByCourseData(sessionList, parameter, value) {
    return sessionList.filter((session) => {
      if (session[parameter] === value) {
        return true;
      } else {
        return false;
      }
    });

  }

  filterBySessionData(sessionList, parameter, value) {
    return sessionList.filter((session) => {
      if (session.sessionDetails[parameter] === value) {
        return true;
      } else {
        return false;
      }
    });
  }

  transform(sessionList: any, title?: any, course?: any, batch?: any, status?: any, completion?: any): any {
    // let resultantSessions = sessionList;
    // if (!batch) {
    //   return resultantSessions;
    // }
    // if (batch) {
    //   console.log("batch info" , batch)
    //   // resultantSessions = this.filterByCourseData(resultantSessions, 'id', batch);
    //   return resultantSessions;
    // }
    console.log("batch ", batch , title , status , completion , course);
    return sessionList;

  }
}

