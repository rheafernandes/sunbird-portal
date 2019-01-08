
import { filter } from 'rxjs/operators';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { Component, OnInit, Input, Output } from '@angular/core';
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
  slideConfig = {
    'slidesToShow': 4,
    'slidesToScroll': 4,
    'responsive': [
      {
        'breakpoint': 2800,
        'settings': {
          'slidesToShow': 8,
          'slidesToScroll': 4,
        }
      },
      {
        'breakpoint': 2200,
        'settings': {
          'slidesToShow': 6,
          'slidesToScroll': 4,
        }
      },
      {
        'breakpoint': 2000,
        'settings': {
          'slidesToShow': 5,
          'slidesToScroll': 4,
        }
      },
      {
        'breakpoint': 1400,
        'settings': {
          'slidesToShow': 4,
          'slidesToScroll': 4,
        }
      },
      {
        'breakpoint': 1200,
        'settings': {
          'slidesToShow': 4,
          'slidesToScroll': 4,
        }
      },
      {
        'breakpoint': 800,
        'settings': {
          'slidesToShow': 3,
          'slidesToScroll': 3,
        }
      },
      {
        'breakpoint': 600,
        'settings': {
          'slidesToShow': 2,
          'slidesToScroll': 2
        }
      },
      {
        'breakpoint': 425,
        'settings': {
          'slidesToShow': 1,
          'slidesToScroll': 1
        }
      }
    ],
    infinite: false,
  };
  private route: Router;
  public content: ContentService;
  key: string;
  search: object;
  selectedOption: string;
  queryParam: any = {};
  filters: any;
  pageNumber: number;
  trendingCourse = [];
  trendingCount: number;
  // @Input() section: ICaraouselData;
  // @Output() visits = new EventEmitter<any>();
  constructor(private config: ConfigService , private searchService: SearchService ,
    route: Router, activatedRoute: ActivatedRoute , ) {
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
    this.searchService.courseSearchTrending().subscribe((data) => {
        console.log('jhsdjk', data);
        this.trendingCount = data.result.count;
        for (const trending of data.result.course) {
             this.trendingCourse.push(trending);
        }
    });
    console.log('trending', this.trendingCourse);
}
onEnter(key) {
  this.populateCourseSearch(key);
  this.route.navigate(['/catalog', key]);
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
preview(courseId) {
  this.route.navigate(['/preview', courseId]);
}
}

