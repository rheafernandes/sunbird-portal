import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { WorkSpaceService, EditorService , BatchService} from './services';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, UploadedComponent,
  CollectionEditorComponent, ContentEditorComponent, GenericEditorComponent,
  WorkspacesidebarComponent, DataDrivenComponent, DefaultTemplateComponent,
  FlaggedComponent, UpForReviewComponent, UpforReviewFilterComponent,
  BatchListComponent, BatchCardComponent, UpdateBatchComponent,
  UpforreviewContentplayerComponent, FlagConentplayerComponent, ReviewsubmissionsContentplayerComponent,
  PublishedPopupComponent, RequestChangesPopupComponent, LimitedPublishedComponent,
  AllContentComponent, FlagReviewerComponent, AllMyContentFilterComponent
} from './components';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { SessionListComponent } from './components/session-list/session-list.component';
import { CreateSessionComponent } from './components/create-session/create-session.component';
import {CourseConsumptionService, CourseProgressService, CourseBatchService} from '../learn/services';
import { SessionDetailsComponent } from './components/session-details/session-details.component';
import { SessionService } from './services/session/session.service';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { FilterSessionPipe } from './pipes/filter-session.pipe';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { LearnMaterialComponent } from './components/learn-material/learn-material.component';

@NgModule({
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    SharedModule,
    SuiModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    NgInviewModule,
    TelemetryModule,
    NgxMaterialTimepickerModule.forRoot()
  ],
  declarations: [WorkspaceComponent, WorkspacesidebarComponent,
    CreateContentComponent, DraftComponent, ReviewSubmissionsComponent,
    PublishedComponent, UploadedComponent, CollectionEditorComponent,
    ContentEditorComponent, GenericEditorComponent, UpForReviewComponent, UpforReviewFilterComponent,
    DataDrivenComponent, UpForReviewComponent, UpforReviewFilterComponent, DefaultTemplateComponent,
    FlaggedComponent, BatchListComponent, BatchCardComponent, UpdateBatchComponent, UpforreviewContentplayerComponent,
    FlagConentplayerComponent,
    ReviewsubmissionsContentplayerComponent,
    PublishedPopupComponent,
    RequestChangesPopupComponent,
    LimitedPublishedComponent,
    AllContentComponent,
    FlagReviewerComponent,
    AllMyContentFilterComponent,
    SessionListComponent,
    CreateSessionComponent,
    SessionDetailsComponent,
    FilterSessionPipe,
    AttendanceComponent,
    LearnMaterialComponent
  ],
  exports: [SessionDetailsComponent],
  providers: [WorkSpaceService, EditorService, BatchService, CourseConsumptionService,
    CourseProgressService, CourseBatchService , SessionService],
  entryComponents: [CreateSessionComponent, SessionDetailsComponent, AttendanceComponent],
})
export class WorkspaceModule { }
