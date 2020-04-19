import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterChartsComponent } from './meter-charts.component';

describe('MeterChartsComponent', () => {
  let component: MeterChartsComponent;
  let fixture: ComponentFixture<MeterChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
