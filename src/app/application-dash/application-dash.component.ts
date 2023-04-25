import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {
  ApplicationDashDataSource,
  ApplicationDashItem,
} from './application-dash-datasource';

@Component({
  selector: 'app-application-dash',
  templateUrl: './application-dash.component.html',
  styleUrls: ['./application-dash.component.scss'],
})
export class ApplicationDashComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ApplicationDashItem>;
  dataSource: ApplicationDashDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'info', 'status', 'actions'];

  constructor() {
    this.dataSource = new ApplicationDashDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  approve() {
    throw new Error('Method not implemented.');
  }
  decline() {
    throw new Error('Method not implemented.');
  }
  postpone() {
    throw new Error('Method not implemented.');
  }
}
