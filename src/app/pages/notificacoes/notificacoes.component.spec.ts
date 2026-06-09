import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { NotificacoesComponent } from './notificacoes.component';
import { NotificacaoService } from '../../services/notificacao.service';
import { AuthService } from '../../services/auth.service';

describe('NotificacoesComponent', () => {
  let component: NotificacoesComponent;
  let fixture: ComponentFixture<NotificacoesComponent>;
  const notificacaoServiceMock = {
    listar: () => of([]),
    marcarComoLida: () => of({}),
    contarNaoLidas: () => of({ unread: 0 }),
  };
  const authServiceMock = {
    isLoggedIn: () => true,
    getRole: () => 'PROFISSIONAL',
    logout: () => undefined,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacoesComponent, RouterTestingModule],
      providers: [
        { provide: NotificacaoService, useValue: notificacaoServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
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
