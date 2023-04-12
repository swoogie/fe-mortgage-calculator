import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';

const fb = new FormBuilder().nonNullable;

@Component({
  selector: 'app-monthly-calc',
  templateUrl: './monthly-calc.component.html',
  styleUrls: ['./monthly-calc.component.scss'],
})
export class MonthlyCalcComponent implements OnInit {
  public kidsAmount = 10;
  public applicantAmount = 2;

  montlhlyForm = fb.group(
    {
      applicants: [
        '',
        [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.max(this.applicantAmount),
        ],
      ],
      amountOfKids: [
        '',
        [
          Validators.required,
          Validators.max(this.kidsAmount),
          Validators.pattern('[0-9]*'),
        ],
      ],
      income: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      obligations: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    },
    { updateOn: 'change' }
  );

  constructor() {
    this.montlhlyForm.valueChanges.subscribe((value) => {
      console.log('form changed', value);
    });
  }

  ngOnInit() {}
  positionOptions: TooltipPosition[] = [
    'after',
    'before',
    'above',
    'below',
    'left',
    'right',
  ];
  position = this.positionOptions[2];

  get applicants() {
    return this.montlhlyForm.get('applicants');
  }

  get amountOfKids() {
    return this.montlhlyForm.get('amountOfKids');
  }

  get income() {
    return this.montlhlyForm.get('income');
  }
  get obligations() {
    return this.montlhlyForm.get('obligations');
  }
}
