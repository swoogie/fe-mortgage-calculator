import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ApplicationService } from '../services/application.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adminpage-applications',
  templateUrl: './adminpage-applications.component.html',
  styleUrls: ['./adminpage-applications.component.scss'],
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
export class AdminpageApplicationsComponent implements OnInit {
  constructor(
    private applicationService: ApplicationService,
    private http: HttpClient
  ) {}

  dataSource;
  ngOnInit(): void {
    this.applicationService.getAllApplications().subscribe({
      next: console.log,
      error: (err) => (this.dataSource = FALLBACK_DATA),
    });
  }

  columnsToDisplay = ['id', 'user', 'status'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'actions', 'expand'];
  expandedApplication: Application | null;

  reject(application: any) {
    application.status = 'rejected';
  }
  approve(application: any) {
    application.status = 'approved';
  }
  postpone(application: any) {
    application.status = 'postponed';
  }
}

export interface Application {
  id: number;
  user: string;
  status: string;
  description: string;
}

const FALLBACK_DATA: Application[] = [
  {
    id: 1,
    user: 'billyjimbob@mail.com',
    status: 'active',
    description:
      'Name: Billy, Surname: Jimbob, LoanTerm: 20 years, LoanAmount: 50000',
  },
  {
    id: 2,
    user: 'bobjim@mail.lt',
    status: 'active',
    description:
      'Name: Bob, Surname: Jim, LoanTerm: 15 years, LoanAmount: 80000',
  },
  {
    id: 3,
    user: 'joebob@mail.co.uk',
    status: 'active',
    description:
      'Name: Joe, Surname: Bob, LoanTerm: 25 years, LoanAmount: 100000',
  },
  {
    id: 4,
    user: 'jondoe@mail.com',
    status: 'active',
    description:
      'Name: Jon, Surname: Doe, LoanTerm: 25 years, LoanAmount: 75000',
  },
];
