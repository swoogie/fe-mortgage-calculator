import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSubmitDialogComponent } from './application-submit-dialog.component';

describe('ApplicationSubmitDialogComponent', () => {
  let component: ApplicationSubmitDialogComponent;
  let fixture: ComponentFixture<ApplicationSubmitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationSubmitDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationSubmitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
