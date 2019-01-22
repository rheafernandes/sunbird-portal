import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExploreContentComponent, ExploreComponent } from './components';
import { PreviewCourseComponent } from '../explore/components/preview-course/preview-course.component';
const routes: Routes = [
    {
      path: ':pageNumber', component: ExploreContentComponent, data: {
        telemetry: {
          env: 'public', pageid: 'explore', type: 'view', subtype: 'paginate'
        }
      }
    },
    {
        path: 'catalog/:pageNumber', component: ExploreComponent, data: {
          telemetry: {
            env: 'public', pageid: 'explore', type: 'view', subtype: 'paginate'
          }
        }
      },
      {
        path: 'preview/:courseId' , component: PreviewCourseComponent
      },
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ExploreRoutingModule { }
