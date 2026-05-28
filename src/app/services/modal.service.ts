import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  /**
   * Exibe um alerta simples para o usuário.
   */
  alert(titulo: string, mensagem: string): void {
    window.alert(`${titulo}\n\n${mensagem}`);
  }

  /**
   * Exibe uma mensagem de sucesso e executa um callback opcional ao confirmar.
   */
  success(titulo: string, mensagem: string, textoBotao?: string, callback?: () => void): void {
    // Remove tags HTML para exibição em alert nativo
    const mensagemLimpa = mensagem.replace(/<[^>]*>/g, '');
    window.alert(`${titulo}\n\n${mensagemLimpa}`);
    if (callback) {
      callback();
    }
  }

  /**
   * Exibe um diálogo de confirmação e retorna true/false.
   */
  confirm(titulo: string, mensagem: string): boolean {
    return window.confirm(`${titulo}\n\n${mensagem}`);
  }
}
