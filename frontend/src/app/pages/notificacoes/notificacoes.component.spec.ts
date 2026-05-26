import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { NotificacoesComponent } from './notificacoes.component';

describe('NotificacoesComponent', () => {
  let component: NotificacoesComponent;
  let fixture: ComponentFixture<NotificacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacoesComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
