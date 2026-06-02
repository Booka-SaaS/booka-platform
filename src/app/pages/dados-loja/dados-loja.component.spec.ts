import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { DadosLojaComponent } from './dados-loja.component';

describe('DadosLojaComponent', () => {
  let component: DadosLojaComponent;
  let fixture: ComponentFixture<DadosLojaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadosLojaComponent],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadosLojaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
