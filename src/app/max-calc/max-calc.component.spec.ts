import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxCalcComponent } from './max-calc.component';

describe('MaxCalcComponent', () => {
  let component: MaxCalcComponent;
  let fixture: ComponentFixture<MaxCalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaxCalcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaxCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
