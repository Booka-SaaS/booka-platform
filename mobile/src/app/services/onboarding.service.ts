import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Serviço para o fluxo de onboarding do profissional.
 */
@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/onboarding`;

  /** Finaliza o onboarding: salva dados da loja e cria disponibilidade padrão. */
  finalizar(dados: {
    nomeLoja: string;
    endereco?: string;
    cidade?: string;
    telefone?: string;
    profissao?: string;
    categoriaPrincipal?: string;
    modalidadePrincipal?: string;
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/finalizar`, dados);
  }
}
