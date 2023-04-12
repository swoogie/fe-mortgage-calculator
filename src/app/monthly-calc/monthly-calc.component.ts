import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';

const fb = new FormBuilder().nonNullable;

@Component({
  selector: 'app-monthly-calc',
  templateUrl: './monthly-calc.component.html',
  styleUrls: ['./monthly-calc.component.scss'],
})
export class MonthlyCalcComponent implements OnInit {
  montlhlyForm = fb.group(
    {
      applicants: ['', Validators.required],
      amountOfKids: ['', Validators.required],
      income: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      obligations: ['', Validators.pattern('[0-9]*')],
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
