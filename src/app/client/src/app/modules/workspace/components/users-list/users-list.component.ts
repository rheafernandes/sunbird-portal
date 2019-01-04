import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '@sunbird/shared';
import { UserService, LearnerService } from '@sunbird/core';
import { pluck } from 'rxjs/operators';
import { Key } from 'protractor';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { PaginationService } from '@sunbird/shared';
export interface UserData {
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
export class UsersListComponent implements OnInit {
userIds = [] ;
  participantsDetails = [];
  pageLimit;
  pageNumber = 1;
  pager;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loginTime: any;
displayedColumns: string[] = ['profile', 'name', 'lastseen', 'progress', 'Status' ];
// tslint:disable-next-line:member-ordering
// tslint:disable-next-line:no-unused-expression
dataSource: MatTableDataSource<UserData>;
  totalCount: number;
  result: any[];
  key: any;
  constructor(private route: ActivatedRoute , private userService: UserService,
     public learnerService: LearnerService, public config: ConfigService ,
     private paginationService: PaginationService) {
   }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const keys = Object.keys(params);
      this.userIds.push(keys);
    console.log('id' , keys);
    for (const userId of keys) {
      console.log('in for loop', userId);
      this.getParticipantsDetails(userId);
    }
  });
}


getParticipantsDetails(userId ) {
  console.log('inside function');
  const option = {
    url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${userId}`,
    param: this.config.urlConFig.params.userReadParam
  };
  const response = this.learnerService.get(option).pipe(pluck('result', 'response'));
  response.subscribe(data => {
    console.log('user info' , data);
    this.participantsDetails.push(data);
    // this.result = this.participantsDetails;
    // this.totalCount = this.participantsDetails.length;
    this.dataSource = new MatTableDataSource(this.participantsDetails);
    // this.pager = this.paginationService.getPager(this.participantsDetails.length, this.pageNumber, this.pageLimit);
    // this.dataSource.paginator = this.paginator;
    for ( const item of this.participantsDetails) {
      this.loginTime = new Date ( item.lastLoginTime );
     }
  },
  ); // this.dataSource.paginator = this.paginator;
}
applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
}

