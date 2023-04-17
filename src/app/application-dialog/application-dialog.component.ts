import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface ApplicationDialogData {
  animal?: string;
  name: string;
}
@Component({
  selector: 'app-application-dialog',
  templateUrl: './application-dialog.component.html',
  styleUrls: ['./application-dialog.component.scss']
})
export class ApplicationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationDialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
