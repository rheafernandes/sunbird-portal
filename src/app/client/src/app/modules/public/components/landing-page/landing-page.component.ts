
import { filter } from 'rxjs/operators';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ResourceService, ConfigService, ServerResponse } from '@sunbird/shared';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { SearchService, ContentService } from '@sunbird/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit  {
  private route: Router;
  public content: ContentService;
  key: string;
  search: object;
  selectedOption: string;
  queryParam: any = {};
  filters: any;
  pageNumber: number;
  constructor(private config: ConfigService , private searchService: SearchService ,
    route: Router, activatedRoute: ActivatedRoute) {
      this.route = route;
    }
ngOnInit() {
  this.filters = {
    objectType: ['Content']
  };
  const __self = this;
  observableCombineLatest(
    (params: any, queryParams: any) => {
      return {
        params: params,
        queryParams: queryParams
      };
    })
    .subscribe(bothParams => {
      if (bothParams.params.pageNumber) {
        this.pageNumber = Number(bothParams.params.pageNumber);
      }
      this.queryParam = { ...bothParams.queryParams };
      // load search filters from queryparams if any
      this.filters = {};
      _.forOwn(this.queryParam, (queryValue, queryParam) => {
        if (queryParam !== 'key' && queryParam !== 'sort_by' && queryParam !== 'sortType') {
          this.filters[queryParam] = queryValue;
        }
      });
      if (this.queryParam.sort_by && this.queryParam.sortType) {
        this.queryParam.sortType = this.queryParam.sortType.toString();
      }
    });
  this.searchService.courseSearchTrending().subscribe((datas) => {
    console.log('data', datas);
  });
}
onEnter(key) {
  this.populateCourseSearch(key);
}
populateCourseSearch(key) {
  this.key = key;
  // this.pageNumber = pageNumber;
  // this.pageLimit = this.config.appConfig.SEARCH.PAGE_LIMIT;
  const requestParams = {
    filters:  _.pickBy(this.filters, value => value.length > 0),
    limit: 10,
    pageNumber: 1,
    query: this.key,
    sort_by: {}
  };

  this.searchService.courseSearch(requestParams).subscribe(
    (apiResponse: ServerResponse) => {
      console.log('data' , apiResponse);
      // if (apiResponse.result.count && apiResponse.result.course) {
      //   this.showLoader = false;
      //   this.noResult = false;
      //   this.totalCount = apiResponse.result.count;
      //   this.result = apiResponse.result.course;
      //   this.pager = this.paginationService.getPager(apiResponse.result.count, this.pageNumber, this.pageLimit);
      //   this.dataSource = new MatTableDataSource(this.result);
      //   this.dataSource.sort = this.sort;
      // } else {
      //   this.noResult = true;
      //   this.showLoader = false;
      // }
    },
    err => {
   console.log('error');
    }
  );
}
}
