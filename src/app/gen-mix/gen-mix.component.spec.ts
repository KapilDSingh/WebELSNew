import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenMixComponent } from './gen-mix.component';

describe('GenMixComponent', () => {
  let component: GenMixComponent;
  let fixture: ComponentFixture<GenMixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenMixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenMixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
