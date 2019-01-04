import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { ContentBadgeComponent, AssignBadgesContentComponent } from './components';
import { ContentBadgeService } from './services';
import { TelemetryModule } from '@sunbird/telemetry';
import { CreateBadgeComponent } from './components/create-badge/create-badge.component';
import { FormsModule } from '@angular/forms';
@NgModule({
    imports: [
        CommonModule,
        SuiModule,
        FormsModule,
        SharedModule.forRoot(),
        TelemetryModule
    ],
    declarations: [ContentBadgeComponent, AssignBadgesContentComponent, CreateBadgeComponent],
    exports: [ContentBadgeComponent, AssignBadgesContentComponent, CreateBadgeComponent],
    providers: [ContentBadgeService],
    entryComponents: [CreateBadgeComponent]
})
export class BadgingModule {

}
