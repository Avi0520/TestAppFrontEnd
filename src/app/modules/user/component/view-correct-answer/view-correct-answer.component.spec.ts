import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCorrectAnswerComponent } from './view-correct-answer.component';

describe('ViewCorrectAnswerComponent', () => {
  let component: ViewCorrectAnswerComponent;
  let fixture: ComponentFixture<ViewCorrectAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCorrectAnswerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCorrectAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
