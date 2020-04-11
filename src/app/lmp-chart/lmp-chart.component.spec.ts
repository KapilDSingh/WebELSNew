import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LmpChartComponent } from './lmp-chart.component';

describe('LmpChartComponent', () => {
  let component: LmpChartComponent;
  let fixture: ComponentFixture<LmpChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LmpChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LmpChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
