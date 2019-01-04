import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Ibatch } from './../../interfaces';
import { WorkSpaceService, BatchService } from '../../services';
import { MatDialog } from '@angular/material';
import { CreateSessionComponent } from '../create-session/create-session.component';
import { Overlay } from '@angular/cdk/overlay';
/**
* This display a batch card
*/
@Component({
  selector: 'app-batch-card',
  templateUrl: './batch-card.component.html',
  styleUrls: ['./batch-card.component.css']
})
export class BatchCardComponent {
  /**
  * To navigate to other pages
  */
  route: Router;

  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to draft  component
  */
  public activatedRoute: ActivatedRoute;
  /**
    * Reference for WorkSpaceService
  */
  public workSpaceService: WorkSpaceService;
  /**
    * Reference for BatchService
  */
  public batchService: BatchService;
  /**
   * batch is used to render Ibatch value on the view
  */
  @Input() batch: Ibatch;
  // @Output('clickEvent')
  // clickEvent = new EventEmitter<any>();

  /**
  * Constructor to create injected service(s) object
  * Default method of batch card  Component class
  *@param {WorkSpaceService} WorkSpaceService Reference of WorkSpaceService
  *@param {BatchService} BatchService Reference of WorkSpaceService
  * @param {Router} route Reference of Router
  * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
  */
  constructor(workSpaceService: WorkSpaceService,
    batchService: BatchService,
    activatedRoute: ActivatedRoute,
    route: Router,
    public dialog: MatDialog,
    public overlay: Overlay) {
    this.batchService = batchService;
    this.route = route;
    this.activatedRoute = activatedRoute;
  }
  public onAction(batchdata) {
    this.batchService.setBatchData(batchdata);
    this.route.navigate(['update/batch', batchdata.identifier], {relativeTo: this.activatedRoute});
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateSessionComponent, {
      width: '50%',
      height: '100%',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      data: {sessionData: this.batch , create: true}
    });

    dialogRef.afterClosed().subscribe(result => {
console.log('result', result);
    });
  }
  listOfUsers(batch) {
    console.log('user list full', batch );
    console.log('user list', batch.participant);
    console.log('created for', batch.createdFor);
    console.log('status', batch.status );
    console.log('addition', batch.courseAdditionalInfo);
    console.log('addition1', batch.courseAdditionalInfo.courseName );
    this.route.navigate(['/workspace/content/userList', batch.participant ]);
  }

}
