import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminpageApplicationsComponent } from './adminpage-applications.component';

describe('AdminpageApplicationsComponent', () => {
  let component: AdminpageApplicationsComponent;
  let fixture: ComponentFixture<AdminpageApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminpageApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminpageApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
