import { ExploreRoutingModule } from './explore-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreContentComponent} from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgInviewModule } from 'angular-inport';
import { ExploreComponent } from './components/explore/explore.component';
import { CatalogFiltersComponent } from '../../../search/components/catalog-filters/catalog-filters.component';
import { PreviewCourseComponent} from './components/preview-course/preview-course.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgInviewModule,
    ExploreRoutingModule
  ],
  declarations: [ ExploreContentComponent, ExploreComponent, CatalogFiltersComponent, PreviewCourseComponent]
,
exports: [ExploreComponent]})
export class ExploreModule { }
