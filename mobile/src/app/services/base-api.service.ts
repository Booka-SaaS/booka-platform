import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Serviço base genérico para operações CRUD.
 *
 * Princípio DRY: todos os serviços de recurso (clientes, serviços, agendamentos, etc.)
 * estendem esta classe e herdam os métodos CRUD sem duplicação.
 *
 * @example
 * ```ts
 * export class ClienteService extends BaseApiService<Cliente> {
 *   constructor() { super('/clientes'); }
 * }
 * ```
 */
export abstract class BaseApiService<T> {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl: string;

  constructor(resourcePath: string) {
    this.baseUrl = `${environment.apiUrl}${resourcePath}`;
  }

  /** Lista todos os recursos. Aceita query params opcionais. */
  listar(params?: Record<string, string>): Observable<T[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value);
        }
      });
    }
    return this.http.get<T[]>(this.baseUrl, { params: httpParams });
  }

  /** Obtém um recurso por ID. */
  obterPorId(id: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  /** Cria um novo recurso. */
  criar(dados: Partial<T>): Observable<T> {
    return this.http.post<T>(this.baseUrl, dados);
  }

  /** Atualiza um recurso existente por ID. */
  atualizar(id: string, dados: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, dados);
  }

  /** Remove um recurso por ID. */
  deletar(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/${id}`);
  }
}
