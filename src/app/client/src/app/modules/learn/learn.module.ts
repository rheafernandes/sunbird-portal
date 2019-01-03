import { TelemetryModule } from '@sunbird/telemetry';
import { LearnRoutingModule } from './learn-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { NgInviewModule } from 'angular-inport';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LearnPageComponent, CoursePlayerComponent, CourseConsumptionHeaderComponent,
  CourseConsumptionPageComponent, BatchDetailsComponent, EnrollBatchComponent, CreateBatchComponent,
  UpdateCourseBatchComponent, CarriculumCardComponent, PreviewCourseComponent, TestAllBatchesComponent,
  DialogOverviewExampleDialog
} from './components';
import { CourseConsumptionService, CourseBatchService, CourseProgressService, } from './services';
import { CoreModule } from '@sunbird/core';
import { NotesModule } from '@sunbird/notes';
import { DashboardModule } from '@sunbird/dashboard';
import { PlayContent } from '../shared';
import { CreateBatchDialogComponent } from './components/test-all-batches/create-batch-dialog/create-batch-dialog.component';
import { UpdateBatchDialogComponent } from './components/test-all-batches/update-batch-dialog/update-batch-dialog.component';
import { ListSessionsComponent } from './components/list-sessions/list-sessions.component';
import { WorkspaceModule } from '../workspace';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SuiModule,
    DashboardModule,
    SlickModule,
    FormsModule,
    LearnRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    NotesModule,
    TelemetryModule,
    NgInviewModule,
    WorkspaceModule
  ],
  providers: [CourseConsumptionService, CourseBatchService, CourseProgressService, PlayContent],
  exports: [UpdateBatchDialogComponent, CreateBatchDialogComponent],
  declarations: [LearnPageComponent, CoursePlayerComponent, CourseConsumptionHeaderComponent,
    CourseConsumptionPageComponent, BatchDetailsComponent, EnrollBatchComponent, CreateBatchComponent,
    UpdateCourseBatchComponent, CarriculumCardComponent, PreviewCourseComponent, TestAllBatchesComponent,
    DialogOverviewExampleDialog, CreateBatchDialogComponent, UpdateBatchDialogComponent, ListSessionsComponent],
  entryComponents: [DialogOverviewExampleDialog, CreateBatchDialogComponent, UpdateBatchDialogComponent, ListSessionsComponent],
})
export class LearnModule { }
