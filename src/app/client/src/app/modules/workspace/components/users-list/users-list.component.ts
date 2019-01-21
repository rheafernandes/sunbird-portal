import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '@sunbird/shared';
import { UserService, LearnerService, SearchService } from '@sunbird/core';
import { pluck } from 'rxjs/operators';
import { Key } from 'protractor';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { PaginationService } from '@sunbird/shared';
import { WorkSpace } from '../../classes/workspace';
import { WorkSpaceService, BatchService } from '../../services';
import { ServerResponse } from '../../../shared/interfaces';
export interface UserData {
  identifier: string;
  firstName: string;
  lastName: string;
  email: string;
  lastLoginTime: string;
  avatar: string;
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent extends WorkSpace implements OnInit {
  userIds = [];
  participantsDetails = [];
  pageLimit;
  pageNumber = 1;
  pager;
  ongoing = 0;
  upcomming = 1;
  previous = 2;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loginTime: any;
  displayedColumns: string[] = [
    'profile',
    'name',
    'lastseen',
    'progress',
    'Status'
  ];
  dataSource: MatTableDataSource<UserData>;
  totalCount: number;
  result: any[];
  key: any;
  batchId: any;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public learnerService: LearnerService,
    public config: ConfigService,
    private paginationService: PaginationService,
    public workSpaceService: WorkSpaceService,
    public searchService: SearchService,
    public batchService: BatchService,
    public router: Router,
  ) {
    super(searchService, workSpaceService);
    this.userService = userService;
    this.config = config;
  }

  ngOnInit() {
    this.route.params.subscribe((data) => {
      this.batchId = data.batchId;
    });
    this.batchService.getBatchDetails(this.batchId).subscribe((batchDetails) => {
      if (batchDetails.hasOwnProperty('participant')) {
        const participantsId = Object.keys(batchDetails.participant);
        for (const participant of participantsId) {
          this.getParticipantsDetails(participant);
        }
      }
    });
  }
  getParticipantsDetails(userId) {
    console.log('inside function');
    const option = {
      url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${userId}`,
      param: this.config.urlConFig.params.userReadParam
    };
    const response = this.learnerService
      .get(option)
      .pipe(pluck('result', 'response'));
    response.subscribe(data => {
      console.log('user info', data);
      this.participantsDetails.push(data);
      this.dataSource = new MatTableDataSource(this.participantsDetails);
      for (const item of this.participantsDetails) {
        this.loginTime = new Date(item.lastLoginTime);
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  showUserStats(userId) {
    this.router.navigate(['/workspace/content/user-stats', userId]);
   }
}
