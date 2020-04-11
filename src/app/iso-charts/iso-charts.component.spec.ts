import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsoChartsComponent } from './iso-charts.component';

describe('IsoChartsComponent', () => {
  let component: IsoChartsComponent;
  let fixture: ComponentFixture<IsoChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsoChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsoChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
