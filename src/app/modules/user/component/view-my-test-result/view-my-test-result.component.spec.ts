import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyTestResultComponent } from './view-my-test-result.component';

describe('ViewMyTestResultComponent', () => {
  let component: ViewMyTestResultComponent;
  let fixture: ComponentFixture<ViewMyTestResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMyTestResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMyTestResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
