import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-application-submit-dialog',
  templateUrl: './application-submit-dialog.component.html',
  styleUrls: ['./application-submit-dialog.component.scss']
})
export class ApplicationSubmitDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ApplicationSubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
