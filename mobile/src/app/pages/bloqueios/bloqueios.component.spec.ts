import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { BloqueiosComponent } from './bloqueios.component';

describe('BloqueiosComponent', () => {
  let component: BloqueiosComponent;
  let fixture: ComponentFixture<BloqueiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloqueiosComponent],
      providers: [provideHttpClient(), provideRouter([])]
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
