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
  DialogOverviewExampleDialog} from './components';
import { CourseConsumptionService, CourseBatchService, CourseProgressService, } from './services';
import { CoreModule } from '@sunbird/core';
import { NotesModule } from '@sunbird/notes';
import { DashboardModule } from '@sunbird/dashboard';
import { MaterialUi } from '../../material';
import { PlayContent } from '../shared';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule, MatDrawerContainer} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import { CreateBatchDialogComponent } from './components/test-all-batches/create-batch-dialog/create-batch-dialog.component';
import { UpdateBatchDialogComponent } from './components/test-all-batches/update-batch-dialog/update-batch-dialog.component';
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
    MaterialUi
  ],
  providers: [CourseConsumptionService, CourseBatchService, CourseProgressService, PlayContent],
  exports: [MatCardModule, MatDrawerContainer, MatExpansionModule, MatDividerModule, UpdateBatchDialogComponent,
    CreateBatchDialogComponent],
  declarations: [LearnPageComponent, CoursePlayerComponent, CourseConsumptionHeaderComponent,
    CourseConsumptionPageComponent, BatchDetailsComponent, EnrollBatchComponent, CreateBatchComponent,
    UpdateCourseBatchComponent, CarriculumCardComponent, PreviewCourseComponent, TestAllBatchesComponent,
    DialogOverviewExampleDialog, CreateBatchDialogComponent, UpdateBatchDialogComponent],
    entryComponents: [DialogOverviewExampleDialog, CreateBatchDialogComponent, UpdateBatchDialogComponent],
})
export class LearnModule { }
