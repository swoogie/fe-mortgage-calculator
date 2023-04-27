import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminpageConstantsComponent } from './adminpage-constants.component';

describe('AdminpageConstantsComponent', () => {
  let component: AdminpageConstantsComponent;
  let fixture: ComponentFixture<AdminpageConstantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminpageConstantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminpageConstantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
