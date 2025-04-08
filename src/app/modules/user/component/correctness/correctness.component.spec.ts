import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectnessComponent } from './correctness.component';

describe('CorrectnessComponent', () => {
  let component: CorrectnessComponent;
  let fixture: ComponentFixture<CorrectnessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorrectnessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorrectnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
