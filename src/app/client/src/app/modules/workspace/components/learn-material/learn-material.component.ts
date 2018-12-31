import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ConfigService, ServerResponse, ToasterService, PaginationService } from '@sunbird/shared';
import { SearchService } from '@sunbird/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session/session.service';
import { SelectionModel } from '@angular/cdk/collections';

export interface UserData {
  id: string;
  name: string;
  creator: string;
  description: string;
}

@Component({
  selector: 'app-learn-material',
  templateUrl: './learn-material.component.html',
  styleUrls: ['./learn-material.component.css']
})
export class LearnMaterialComponent implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'progress', 'name', 'color'];
  value = 'Clear me';
  inputValue = new FormControl();
  dataSource: MatTableDataSource<UserData>;
  pageLimit;
  pageNumber = 1;
  showLoader;
  noResult;
  totalCount;
  result;
  key;
  pager;
  sessionId;
  session;
  selectedCourses = new Set();
  checked;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel(true, []);
  constructor(private activatedRoute: ActivatedRoute, private sessionService: SessionService,
     private paginationService: PaginationService, private config: ConfigService,
     private searchService: SearchService, private toasterService: ToasterService) {
  }

  ngOnInit() {
    this.inputValue.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.showLoader = true;
        this.populateCourseSearch(value, 1);
      });
    const sessionId = this.activatedRoute.params.subscribe(params => this.sessionId = params.sessionId);
    this.sessionService.getSessionById(this.sessionId).subscribe((session: any) => {
      this.session = session;
    });

    this.selection.onChange.subscribe((selection: any) => {
      for (const course of this.selection.selected) {
        this.selectedCourses.add(course);
      }
    });
  }

  addMaterial() {
    this.session.sessionDetails['study_material'] = this.selection.selected;
    this.sessionService.updateSession(this.session);
    this.toasterService.info(`study material added for ${this.session.name}`);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  populateCourseSearch(key, pageNumber) {
    this.key = key;
    this.pageNumber = pageNumber;
    this.pageLimit = this.config.appConfig.SEARCH.PAGE_LIMIT;
    const requestParams = {
      filters: {},
      limit: this.pageLimit,
      pageNumber: pageNumber,
      query: this.key,
      sort_by: {}
    };

    this.searchService.courseSearch(requestParams).subscribe(
      (apiResponse: ServerResponse) => {
        if (apiResponse.result.count && apiResponse.result.course) {
          this.showLoader = false;
          this.noResult = false;
          this.totalCount = apiResponse.result.count;
          this.result = apiResponse.result.course;
          this.pager = this.paginationService.getPager(apiResponse.result.count, this.pageNumber, this.pageLimit);
          this.dataSource = new MatTableDataSource(this.result);
          this.dataSource.sort = this.sort;
        } else {
          this.noResult = true;
          this.showLoader = false;
        }
      },
      err => {
        this.showLoader = false;
        this.noResult = true;
        this.toasterService.error('no results found');
      }
    );
  }
}
