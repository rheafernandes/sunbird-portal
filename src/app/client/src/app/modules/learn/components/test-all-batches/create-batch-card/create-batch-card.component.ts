import { Component, OnInit } from '@angular/core';
import { PermissionService } from '@sunbird/core';
import { ToasterService } from '@sunbird/shared';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-create-batch-card',
  templateUrl: './create-batch-card.component.html',
  styleUrls: ['./create-batch-card.component.css']
})
export class CreateBatchCardComponent implements OnInit {
public courseMentor;
  constructor(
    public permissionService: PermissionService,
    public toasterService: ToasterService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  checkRoles() {
    if (this.permissionService.checkRolesPermissions(['COURSE_MENTOR'])) {
      this.courseMentor = true;
      this.toasterService.success('A mentor, go ahead');
      this.router.navigate(['create/batch'], { relativeTo: this.activatedRoute });
    } else {
      this.courseMentor = false;
      this.toasterService.error('Not a mentor');
    }
  }

}
