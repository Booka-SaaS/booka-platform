import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { BloqueiosComponent } from './bloqueios.component';
import { BloqueioService } from '../../services/bloqueio.service';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';

describe('BloqueiosComponent', () => {
  let component: BloqueiosComponent;
  let fixture: ComponentFixture<BloqueiosComponent>;
  let bloqueioService: jasmine.SpyObj<BloqueioService>;
  let modalService: jasmine.SpyObj<ModalService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    bloqueioService = jasmine.createSpyObj<BloqueioService>('BloqueioService', [
      'listar',
      'criar',
      'criarLote',
      'deletar',
    ]);
    modalService = jasmine.createSpyObj<ModalService>('ModalService', ['alert', 'success', 'confirm']);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn', 'getRole', 'logout']);

    bloqueioService.listar.and.returnValue(of([]));
    bloqueioService.criarLote.and.returnValue(of([]));
    authService.isLoggedIn.and.returnValue(true);
    authService.getRole.and.returnValue('PROFISSIONAL');

    await TestBed.configureTestingModule({
      imports: [BloqueiosComponent],
      providers: [
        provideRouter([]),
        { provide: BloqueioService, useValue: bloqueioService },
        { provide: ModalService, useValue: modalService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BloqueiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create lunch blocks for weekdays only', () => {
    component.form = {
      dataInicio: '2026-06-01',
      dataFim: '2026-06-07',
      horaInicio: '12:00',
      horaFim: '13:00',
      motivo: 'Almoço',
    };

    component.bloquearAlmocoDiasUteis();

    const payload = bloqueioService.criarLote.calls.mostRecent().args[0];
    expect(payload.length).toBe(5);
    expect(payload.every((bloqueio) => bloqueio.motivo === 'Almoço')).toBeTrue();
    expect(modalService.success).toHaveBeenCalled();
  });

  it('should reject lunch preset when end time is not after start time', () => {
    component.form = {
      dataInicio: '2026-06-01',
      dataFim: '2026-06-05',
      horaInicio: '13:00',
      horaFim: '12:00',
      motivo: 'Almoço',
    };

    component.bloquearAlmocoDiasUteis();

    expect(bloqueioService.criarLote).not.toHaveBeenCalled();
    expect(modalService.alert).toHaveBeenCalledWith(
      'Atenção',
      'O horário final do almoço deve ser posterior ao horário inicial.'
    );
  });
});
