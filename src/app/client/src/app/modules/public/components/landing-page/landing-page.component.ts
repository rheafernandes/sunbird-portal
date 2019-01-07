import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as _ from 'lodash';
import {
  ResourceService, ToasterService, INoResultMessage,
  ConfigService, UtilService, ICaraouselData
} from '@sunbird/shared';
import { PageApiService } from '@sunbird/core';
import { Subject } from 'rxjs';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { PublicPlayerService } from '../../../public/services';
import {SearchService} from '@sunbird/core';



@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
   /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  public searchService: SearchService;
  caraouselData: Array<ICaraouselData> = [];
  public config: ConfigService;
  noResultMessage: INoResultMessage;
  public unsubscribe$ = new Subject<void>();
  key: string;
  queryParam: any = {};
  exploreRoutingUrl: string;
  showExploreHeader = false;
  inviewLogs = [];
  public filters: any;
  showLoader = true;
  hashTagId: string;
  prominentFilters: object;
  noResult = false;
  telemetryImpression: IImpressionEventInput;
  trendingCourse = [];
  trendingCount: number;
  @Input() section: ICaraouselData;
  @Output() visits = new EventEmitter<any>();

  constructor(public router: Router, public activatedRoute: ActivatedRoute
    , private publicPlayerService: PublicPlayerService,  public utilService: UtilService,
    // tslint:disable-next-line:max-line-length
    config: ConfigService , pageSectionService: PageApiService, toasterService: ToasterService , resourceService: ResourceService, searchService: SearchService ) {
      this.config = config;
      this.toasterService = toasterService;
      this.resourceService = resourceService;
      this.searchService = searchService;
    }

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


  ngOnInit() {

   this.searchService.courseSearchTrending().subscribe((data) => {
     console.log('jhsdjk', data);
     this.trendingCount = data.result.count;
     for (const trending of data.result.course) {
          this.trendingCourse.push(trending);
     }
 });
 console.log('tranding', this.trendingCourse);
}


    inview(event) {
      // const visitsLength = this.inviewLogs.length;
      // const visits = [];
      // _.forEach(event.inview, (inview, key) => {
      //   const content = _.find(this.inviewLogs, (eachContent) => {
      //     if (inview) {
      //       return eachContent.metaData = 'jm';
      //        }
      //   });
      //   if (content === undefined) {
      //     inview.data.section = 'trending';
      //     this.inviewLogs.push(inview.data);
      //     visits.push(inview.data);
      //   }
      // });
      // if (visits.length > 0) {
      //   this.visits.emit(visits);
      // }
    }
    /**
     * get inviewChange
    */
    inviewChange(contentList, event) {
      // const visits = [];
      // const slideData = contentList.slice(event.currentSlide + 1, event.currentSlide + 5);
      // _.forEach(slideData, (slide, key) => {
      //   const content = _.find(this.inviewLogs, (eachContent) => {
          // if (slide.metaData.courseId) {
          //   return eachContent.metaData.courseId === slide.metaData.courseId;
          // } else if (slide.metaData.identifier) {
          //   return eachContent.metaData.identifier === slide.metaData.identifier;
          // }
    //     });
    //     if (content === undefined) {
    //       // slide.section = this.section.name;
    //       this.inviewLogs.push(slide);
    //       visits.push(slide);
    //     }
    //   });
    //   if (visits.length > 0) {
    //     this.visits.emit(visits);
    //   }
    // }
  }


  preview() {

  }
}
