import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { MonthlyCalcComponent } from './monthly-calc.component';

describe('MonthlyCalcComponent', () => {
  let component: MonthlyCalcComponent;
  let fixture: ComponentFixture<MonthlyCalcComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlyCalcComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlyCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    form = component.monthlyForm;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
