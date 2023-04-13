import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';

const fb = new FormBuilder().nonNullable;

@Component({
  selector: 'app-max-calc',
  templateUrl: './max-calc.component.html',
  styleUrls: ['./max-calc.component.scss'],
})
export class MaxCalcComponent {
  maxCalcForm = fb.group(
    {
      realEstatePrice: [
        '',
        [Validators.required, Validators.pattern('[0-9]*')],
      ],
      downpayment: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      loanAmount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      loanTerm: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      interestRate: ['', [Validators.required]],
      paymentScheduleType: ['', [Validators.required]],
    },
    { updateOn: 'change' }
  );

  constructor() {
    this.maxCalcForm.valueChanges.subscribe((value) => {
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

  get realEstatePrice() {
    return this.maxCalcForm.get('realEstatePrice');
  }

  get downpayment() {
    return this.maxCalcForm.get('downpayment');
  }

  get loanAmount() {
    return this.maxCalcForm.get('loanAmount');
  }
  get loanTerm() {
    return this.maxCalcForm.get('loanTerm');
  }

  get interestRate() {
    return this.maxCalcForm.get('interestRate');
  }

  get paymentScheduleType() {
    return this.maxCalcForm.get('paymentScheduleType');
  }
}
