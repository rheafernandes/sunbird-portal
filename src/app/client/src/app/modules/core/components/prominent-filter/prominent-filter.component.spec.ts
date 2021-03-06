import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ConfigService, ToasterService, BrowserCacheTtlService } from '@sunbird/shared';
import {
  FrameworkService, FormService, ContentService, UserService, LearnerService,
  ConceptPickerService, SearchService, PermissionService
} from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProminentFilterComponent } from './prominent-filter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
import { Response } from './prominent-filter.component.spec.data';
import * as _ from 'lodash';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
describe('ProminentFilterComponent', () => {
  let component: ProminentFilterComponent;
  let fixture: ComponentFixture<ProminentFilterComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  const resourceBundle = {
    'messages': {
      'emsg': {
        'm0005': 'api failed, please try again'
      },
      'stmsg': {
        'm0018': 'We are fetching content...',
        'm0008': 'no-results',
        'm0033': 'You dont have any content'
      }
    }
  };
  const fakeActivatedRoute = {
    'params': observableOf({ pageNumber: '1' }),
    'queryParams': observableOf({ subject: ['English'] })
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SharedModule.forRoot()],
      declarations: [ProminentFilterComponent],
      providers: [FrameworkService, FormService, UserService, ContentService,
        LearnerService, SearchService,
        CacheService, ResourceService, ConceptPickerService, PermissionService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProminentFilterComponent);
    component = fixture.componentInstance;
  });
  it('should apply filters and key should have concepts', () => {
    const router = TestBed.get(Router);
    const activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.parent = 'ap/explore';
    component.formInputData = {
      'subject': ['English'], 'medium': ['English'],
      'concepts': [{
        identifier: 'AI31',
        name: '(Artificial) Neural Network'
      }]
    };
    const queryParams = { 'subject': ['English'], 'medium': ['English'], 'concepts': ['AI31'] };
    component.applyFilters();
    expect(router.navigate).toHaveBeenCalledWith([], {relativeTo: 'ap/explore', queryParams: queryParams });
  });

  it('Filter results should not change on call of  apply filters for same params', () => {
    const router = TestBed.get(Router);
    const activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.parent = 'ap/explore';
    const queryParams = component.formInputData = { 'gradeLevel': ['Grade 1', 'Grade 2'], 'medium': ['English'] };
    component.applyFilters();
    expect(component.isFiltered).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith([], { relativeTo: 'ap/explore', queryParams: queryParams });
  });

  it('should get meta data from framework service and call formconfig service if cache not exists', () => {
    const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    const cacheService = TestBed.get(CacheService);
    component.formFieldProperties = Response.formConfigData;
    spyOn(component.prominentFilter, 'emit').and.returnValue(Response.formConfigData);
    spyOn(cacheService, 'exists').and.returnValue(false);
    spyOn(component, 'getFormConfig').and.returnValue(component.formFieldProperties);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(Response.formConfigData));
    frameworkService._frameworkData$.next({ frameworkdata: Response.frameworkData });
    component.fetchFilterMetaData();
    fixture.detectChanges();
    expect(component.formService.getFormConfig).toHaveBeenCalled();
    expect(component.prominentFilter.emit).toHaveBeenCalledWith(Response.formConfigData);
  });
  it('should call isObject ', () => {
    const value = { id: 'AI113', name: 'artificial inteligence' };
    component.isObject(value);
    const check = typeof value;
    expect(check).toEqual('object');
  });
  it('should call selectedValue ', () => {
    const event = Response.inputData;
    const code = 'board';
    component.selectedValue(event, code);
    expect(component.formInputData[code]).toEqual(event);
  });
  it('should frame form config data', () => {
    component.categoryMasterList = _.cloneDeep(Response.frameworkData);
    component.getFormConfig();
    fixture.detectChanges();
    expect(component.formFieldProperties).toBeDefined();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    const cacheService = TestBed.get(CacheService);
    component.formFieldProperties = Response.formConfigData;
    spyOn(cacheService, 'exists').and.returnValue(false);
    spyOn(component, 'getFormConfig').and.returnValue(component.formFieldProperties);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(Response.formConfigData));
    frameworkService._frameworkData$.next({ frameworkdata: Response.frameworkData });
    component.fetchFilterMetaData();
    fixture.detectChanges();
    spyOn(component.frameworkDataSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.frameworkDataSubscription.unsubscribe).toHaveBeenCalled();
  });
  it('should call resetFilters method', () => {
    component.ignoreQuery = ['key', 'language'];
    component.resetFilters();
    expect(component.refresh).toBeTruthy();
  });
  it('should not call permission service if allowedRoles are present', () => {
    const permissionService = TestBed.get(PermissionService);
    const allowedRoles = ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION'];
    spyOn(permissionService, 'checkRolesPermissions').and.returnValue('');
    component.showField(allowedRoles);
    expect(permissionService.checkRolesPermissions).toHaveBeenCalled();
  });
  it('should not call permission service if allowedRoles are empty', () => {
    const permissionService = TestBed.get(PermissionService);
    const allowedRoles = undefined;
    spyOn(permissionService, 'checkRolesPermissions').and.returnValue('');
    component.showField(allowedRoles);
    expect(permissionService.checkRolesPermissions).not.toHaveBeenCalled();
  });
  it('should call ngOninit to get telemetry Interact Data', () => {
    const frameworkService = TestBed.get(FrameworkService);
    component.pageId = 'explore-page';
    component.hashTagId = '0123166367624478721';
    const submitIntractEdata = {
      id: 'submit',
      type: 'click',
      pageid: 'explore-page',
      extra: { filter: { 'subject': ['English'] } }
    };
     spyOn(frameworkService, 'initialize').and.callThrough();
    spyOn(component, 'getQueryParams').and.callThrough();
    spyOn(component, 'fetchFilterMetaData').and.callThrough();
    component.ngOnInit();
    expect(frameworkService.initialize).toHaveBeenCalled();
    expect(component.getQueryParams).toHaveBeenCalled();
    expect(component.fetchFilterMetaData).toHaveBeenCalled();
    expect(component.submitIntractEdata).toEqual(submitIntractEdata);
  });
});
