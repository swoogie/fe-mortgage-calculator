import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger,} from '@angular/animations';
import {ApplicationService} from '../services/application.service';
import {HttpClient} from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from "@angular/material/table";


@Component({
  selector: 'app-adminpage-applications',
  templateUrl: './adminpage-applications.component.html',
  styleUrls: ['./adminpage-applications.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
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
  ) {
  }
  // dataSource: Application[] = [];

  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Application>();
  applicationData: Application[] = [];
  selectedStatus = 'RECEIVED';

  ngOnInit(): void {
    this.applicationService.getAllApplications().subscribe({
      next: (res: any) => {
        res.forEach((appl) => {
          console.log(appl);
          this.applicationData.push({
            id: appl.applicationId,
            user: appl.email,
            status: appl.applicationStatus,
            firstName: appl.firstName,
            lastName: appl.lastName,
            loanTerm: appl.loanTerm,
            loanAmount: appl.loanAmount,
            realEstateAddress: appl.realEstateAddress,
            realEstatePrice: appl.realEstatePrice,
            totalHouseholdIncome: appl.totalHouseholdIncome,
            phoneNumber: appl.phoneNumber,
            personalNumber: appl.personalNumber,
            email: appl.email,
            monthlyPayment: appl.monthlyPayment,
            euriborTerm: appl.euriborTerm,
            euriborRate: appl.interestRateEuribor /100,
            interestRate: appl.interestRateMargin,
            coApplicantEmail: appl.coApplicantEmail,
            paymentScheduleType: appl.paymentScheduleType
          });
        });
        this.dataSource.data = this.applicationData;
        this.dataSource.sort = this.sort;
      },
      error: (err) => (this.dataSource.data = FALLBACK_DATA),
    });

    this.dataSource.filterPredicate = (data: Application, filter: string) => {
      const searchString = filter.toLowerCase();
      return (
        data.id.toString().includes(searchString) ||
        data.user.toLowerCase().includes(searchString) ||
        data.status.toLowerCase().includes(searchString)
      );
    };
    this.applyFilter();
  }



  columnsToDisplay = ['id', 'user', 'status'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'actions', 'expand'];
  expandedApplication: Application | null;

  reject(application: any) {
    application.status = 'REJECTED';
    this.applicationService.setApplicationStatus(application.id, 'REJECTED');
  }

  approve(application: any) {
    application.status = 'APPROVED';
    this.applicationService.setApplicationStatus(application.id, 'APPROVED');
  }

  postpone(application: any) {
    application.status = 'IN_PROGRESS';
    this.applicationService.setApplicationStatus(application.id, 'IN_PROGRESS');
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: Application, filter: string) => {
      const filterValue = filter.toLowerCase();
      return (
        data.status.toLowerCase().includes(filterValue) ||
        data.user.toLowerCase().includes(filterValue)
      );
    };
    this.dataSource.filter = this.selectedStatus.toLowerCase();
  }

}

export interface Application {
  id: number;
  user: string;
  status: string;
  description?: string;
  firstName?: string;
  lastName?: string;
  loanTerm?: number;
  loanAmount?: number;
  realEstateAddress?: string;
  realEstatePrice?: number;
  totalHouseholdIncome?: number;
  phoneNumber?: number;
  personalNumber?: number;
  email?: string;
  monthlyPayment?: number;
  euriborTerm?: number;
  euriborRate?: number;
  interestRate?: number;
  coApplicantEmail?: string;
  paymentScheduleType?: string;
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
