import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyCalcComponent } from './monthly-calc.component';

describe('MonthlyCalcComponent', () => {
  let component: MonthlyCalcComponent;
  let fixture: ComponentFixture<MonthlyCalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyCalcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
