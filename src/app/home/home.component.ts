import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ApplicationDialogComponent } from '../application-dialog/application-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    this.dialog.open(ApplicationDialogComponent, {
      data: {},
      minWidth: '400px',
    });
  }
}
