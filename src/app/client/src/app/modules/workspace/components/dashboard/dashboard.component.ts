import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canva.min.js';
import { UserService, SearchService } from '@sunbird/core';
import { WorkSpace } from '../../classes/workspace';
import { WorkSpaceService, BatchService } from '../../services';
import { ServerResponse } from '../../../shared/interfaces';
import { ConfigService } from '@sunbird/shared';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends WorkSpace implements OnInit {
  ongoing = 0;
  upcomming = 1;
  previous = 2;
  public config: ConfigService;
  showLoader: boolean;
  pageLimit: any;
  pageNumber = 1;
  noResult: boolean;
  ongoingBatchCount: any;
  upcommingBatchCount: any;
  previousBatchCount: any;
  batchCount: any;
  count = 0;
  enrolledUserCount: number;
  // tslint:disable-next-line:max-line-length
  constructor(
    public userService: UserService,
    public searchService: SearchService,
    public workSpaceService: WorkSpaceService,
    public batchService: BatchService,
    config: ConfigService
  ) {
    super(searchService, workSpaceService);
    this.userService = userService;
    this.config = config;
  }

  ngOnInit() {
    console.log('user id ', this.userService.userid);
    this.fetchOngoingBatchList();
  }

  fetchOngoingBatchList() {
    this.showLoader = true;
    this.pageLimit = this.config.appConfig.WORKSPACE.PAGE_LIMIT;
    const searchParams = {
      filters: {
        status: this.ongoing.toString(),
        createdFor: this.userService.RoleOrgMap['COURSE_MENTOR'],
        createdBy: this.userService.userid
      },
      limit: this.pageLimit,
      pageNumber: this.pageNumber,
      sort_by: { createdDate: this.config.appConfig.WORKSPACE.createdDate }
    };
    this.getBatches(searchParams).subscribe(
      (data: ServerResponse) => {
        console.log(
          'get all batches',
          data,
          searchParams,
          data.result.response.count
        );
        if (data.result.response.count > 0) {
          this.ongoingBatchCount = data.result.response.count;
        }
      },
      (err: ServerResponse) => {
        this.showLoader = false;
        console.log('error');
      },
      () => {
        this.fetchUpcommingBatchList();
      }
    );
  }
  fetchUpcommingBatchList() {
    this.showLoader = true;
    this.pageLimit = this.config.appConfig.WORKSPACE.PAGE_LIMIT;
    const searchParams = {
      filters: {
        status: this.upcomming.toString(),
        createdFor: this.userService.RoleOrgMap['COURSE_MENTOR'],
        createdBy: this.userService.userid
      },
      limit: this.pageLimit,
      pageNumber: this.pageNumber,
      sort_by: { createdDate: this.config.appConfig.WORKSPACE.createdDate }
    };
    this.getBatches(searchParams).subscribe(
      (data: ServerResponse) => {
        console.log(
          'get all batches',
          data,
          searchParams,
          data.result.response.count
        );
        if (data.result.response.count > 0) {
          this.upcommingBatchCount = data.result.response.count;
        }
        for ( const item of data.result.response.content) {
        if (item) {
          console.log('inside item' , item);
       this.count ++;
        }
        }
        this.enrolledUserCount = this.count ;
      },
      (err: ServerResponse) => {
        this.showLoader = false;
        console.log('error');
      },
      () => {
        this.fetchPreviousBatchList();
      }
    );
  }
  fetchPreviousBatchList() {
    this.showLoader = true;
    this.pageLimit = this.config.appConfig.WORKSPACE.PAGE_LIMIT;
    const searchParams = {
      filters: {
        status: this.previous.toString(),
        createdFor: this.userService.RoleOrgMap['COURSE_MENTOR'],
        createdBy: this.userService.userid
      },
      limit: this.pageLimit,
      pageNumber: this.pageNumber,
      sort_by: { createdDate: this.config.appConfig.WORKSPACE.createdDate }
    };
    this.getBatches(searchParams).subscribe(
      (data: ServerResponse) => {
        if (data.result.response.count > 0) {
          this.previousBatchCount = data.result.response.count;
        }
      },
      (err: ServerResponse) => {
        this.showLoader = false;
      },
      () => {
        this.chartRender();
      },
    );
  }
  chartRender() {
    this.batchCount = this.ongoingBatchCount + this.upcommingBatchCount + this.previousBatchCount;
    const chart = new CanvasJS.Chart('chartContainer', {
      theme: 'light2',
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Overall Activities'
      },
      data: [
        {
          type: 'pie',
          showInLegend: true,
          toolTipContent: '<b>{name}</b>: ${y} (#percent%)',
          indexLabel: '{name} - ',
          dataPoints: [
            {
              y: this.ongoingBatchCount,
              name: 'OngoingBatches',
              label: 'OngoingBatches'
            },
            {
              y: this.upcommingBatchCount,
              name: 'UpcommingBatches',
              label: 'UpcommingBatches'
            },
            {
              y: this.previousBatchCount,
              name: 'PreviousBatches',
              label: 'PrevoiusBatches'
            }
          ]
        }
      ]
    });
    chart.render();
  }
}
