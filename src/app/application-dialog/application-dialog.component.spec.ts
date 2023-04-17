import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDialogComponent } from './application-dialog.component';

describe('ApplicationDialogComponent', () => {
  let component: ApplicationDialogComponent;
  let fixture: ComponentFixture<ApplicationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
