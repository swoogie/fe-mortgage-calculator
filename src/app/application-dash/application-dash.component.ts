import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export interface Application {
  id: number;
  info: string;
  status: string;
}

const APPLICATION_DATA = [
  {
    id: 1,
    info: 'application 1',
    status: 'active',
  },
  {
    id: 2,
    info: 'application 2',
    status: 'active',
  },
  {
    id: 3,
    info: 'application 3',
    status: 'active',
  },
  {
    id: 4,
    info: 'application 4',
    status: 'active',
  },
  {
    id: 5,
    info: 'application 5',
    status: 'active',
  },
];

@Component({
  selector: 'app-application-dash',
  templateUrl: './application-dash.component.html',
  styleUrls: ['./application-dash.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ApplicationDashComponent {
  dataSource = APPLICATION_DATA;
  displayedColumns = ['id', 'info', 'status', 'actions'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: Application | null;

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
