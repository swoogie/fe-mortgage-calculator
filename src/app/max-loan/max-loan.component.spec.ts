import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxLoanComponent } from './max-loan.component';

describe('MaxLoanComponent', () => {
  let component: MaxLoanComponent;
  let fixture: ComponentFixture<MaxLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaxLoanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaxLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
