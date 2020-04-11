import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadChartComponent } from './load-chart.component';

describe('LoadChartComponent', () => {
  let component: LoadChartComponent;
  let fixture: ComponentFixture<LoadChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
