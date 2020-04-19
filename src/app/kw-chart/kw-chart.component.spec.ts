import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KwChartComponent } from './kw-chart.component';

describe('KwChartComponent', () => {
  let component: KwChartComponent;
  let fixture: ComponentFixture<KwChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KwChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KwChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
