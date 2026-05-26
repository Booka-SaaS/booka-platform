import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloqueiosComponent } from './bloqueios.component';

describe('BloqueiosComponent', () => {
  let component: BloqueiosComponent;
  let fixture: ComponentFixture<BloqueiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloqueiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloqueiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
