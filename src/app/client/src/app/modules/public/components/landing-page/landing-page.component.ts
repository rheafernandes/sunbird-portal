import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as _ from 'lodash';
import {
  ResourceService, ToasterService, INoResultMessage,
  ConfigService, UtilService, NavigationHelperService
} from '@sunbird/shared';
import { PageApiService } from '@sunbird/core';
import { ICaraouselData } from '@sunbird/shared';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { PublicPlayerService } from '../../../public/services';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit , OnDestroy {
   /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  private pageSectionService: PageApiService;
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
  constructor(public router: Router, public activatedRoute: ActivatedRoute
    , private publicPlayerService: PublicPlayerService,  public utilService: UtilService,
    config: ConfigService , pageSectionService: PageApiService, toasterService: ToasterService , resourceService: ResourceService ) {
      this.pageSectionService = pageSectionService;
      this.config = config;
      this.toasterService = toasterService;
      this.resourceService = resourceService;
    }

    populatePageData() {
      this.showLoader = true;
      this.noResult = false;
      const filters = _.pickBy(this.filters, value => value.length > 0);
          filters.channel = this.hashTagId;
          filters.board = _.get(this.filters, 'board') ? this.filters.board : this.prominentFilters['board'];
      const option = {
        source: 'web',
        name: 'Explore',
        filters: filters,
        softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 },
        mode: 'soft',
        exists: []
      };
      this.pageSectionService.getPageData(option).pipe(
        takeUntil(this.unsubscribe$))
        .subscribe(
          (apiResponse) => {
            if (apiResponse && apiResponse.sections) {
              let noResultCounter = 0;
              this.showLoader = false;
              this.caraouselData = apiResponse.sections;
              _.forEach(this.caraouselData, (value, index) => {
                if (this.caraouselData[index].contents && this.caraouselData[index].contents.length > 0) {
                  const constantData = this.config.appConfig.ExplorePage.constantData;
                  const metaData = this.config.appConfig.ExplorePage.metaData;
                  const dynamicFields = this.config.appConfig.ExplorePage.dynamicFields;
                  this.caraouselData[index].contents = this.utilService.getDataForCard(this.caraouselData[index].contents,
                    constantData, dynamicFields, metaData);
                }
              });
              if (this.caraouselData.length > 0) {
                _.forIn(this.caraouselData, (value, key) => {
                  if (this.caraouselData[key].contents === null) {
                    noResultCounter++;
                  } else if (this.caraouselData[key].contents === undefined) {
                    noResultCounter++;
                  }
                });
              }
              if (noResultCounter === this.caraouselData.length) {
                this.noResult = true;
                this.noResultMessage = {
                  'message': this.resourceService.messages.stmsg.m0007,
                  'messageText': this.resourceService.messages.stmsg.m0006
                };
              }
            }
          },
          err => {
            this.noResult = true;
            this.noResultMessage = {
              'message': this.resourceService.messages.stmsg.m0007,
              'messageText': this.resourceService.messages.stmsg.m0006
            };
            this.showLoader = false;
            this.toasterService.error(this.resourceService.messages.fmsg.m0004);
          }
        );
    }

  ngOnInit() {
    this.getUrl();
    this.activatedRoute.queryParams.subscribe(queryParams => {
      console.log('query', queryParams);
      this.queryParam = { ...queryParams };
      this.key = this.queryParam['key'];
    });
  }
  onEnter(key) {
    this.key = key;
    this.queryParam = {};
    this.queryParam['key'] = this.key;
    if (this.key && this.key.length > 0) {
      console.log('inside if' , this.key);
      this.queryParam['key'] = this.key;
    } else {
      delete this.queryParam['key'];
    }
    this.router.navigate([this.exploreRoutingUrl, 1], {
      queryParams: this.queryParam
    });
  }
  getUrl() {
    console.log('inside url');
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((urlAfterRedirects: NavigationEnd) => {
      if (_.includes(urlAfterRedirects.url, '/explore')) {
        console.log('if one');
        this.showExploreHeader = true;
        const url  = urlAfterRedirects.url.split('/');
        if (url.indexOf('explore') === 2) {
          console.log('if 2');
          this.exploreRoutingUrl = url[1] + '/' + url[2];
        } else {
          console.log('else 1');
          this.exploreRoutingUrl = url[1];
        }
      } else {
        console.log('else 2');
        this.showExploreHeader = false;
      }
    });
  }
  prepareVisits(event) {
    console.log('prepare visit');
    _.forEach(event, (inview, index) => {
      if (inview.metaData.identifier) {
        this.inviewLogs.push({
          objid: inview.metaData.identifier,
          objtype: inview.metaData.contentType,
          index: index,
          section: inview.section,
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }

  public playContent(event) {
    console.log('pal content');
    this.publicPlayerService.playContent(event);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
