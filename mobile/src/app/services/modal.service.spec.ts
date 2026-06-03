import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
    
    // Mock window methods
    spyOn(window, 'alert');
    spyOn(window, 'confirm').and.returnValue(true);
  });

  it('deve mostrar alert', () => {
    service.alert('Titulo', 'Mensagem');
    expect(window.alert).toHaveBeenCalledWith('Titulo\n\nMensagem');
  });

  it('deve mostrar success (removendo tags HTML se houver)', () => {
    service.success('Sucesso', '<b>Deu certo</b>', 'OK', () => {});
    expect(window.alert).toHaveBeenCalledWith('Sucesso\n\nDeu certo');
  });

  it('deve retornar booleano no confirm', () => {
    const res = service.confirm('Tem certeza?', 'Aviso');
    expect(window.confirm).toHaveBeenCalledWith('Tem certeza?\n\nAviso');
    expect(res).toBeTrue();
  });
});
