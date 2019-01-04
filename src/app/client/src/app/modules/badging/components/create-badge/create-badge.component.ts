import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrgDetailsService } from '@sunbird/core';

@Component({
  selector: 'app-create-badge',
  templateUrl: './create-badge.component.html',
  styleUrls: ['./create-badge.component.css']
})
export class CreateBadgeComponent implements OnInit {

  issuerId = 'issuerslug-39';
  rootOrgId = '';
  organisation;


  constructor(private dialogRef: MatDialogRef<CreateBadgeComponent>,
    @Inject(MAT_DIALOG_DATA) private data, private organisationService: OrgDetailsService) { }

  ngOnInit() {
    this.organisationService.getOrgDetails().subscribe((orgDetails: any) => {
      this.organisation = orgDetails;
      this.rootOrgId = orgDetails.rootOrgId;
      this.issuerId = '';
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  submit(form) {
    console.log(form);
  }
}
