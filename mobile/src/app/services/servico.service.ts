import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Servico } from '../models';

/**
 * Serviço para gestão de serviços oferecidos.
 * Herda CRUD completo de BaseApiService — zero duplicação.
 */
@Injectable({ providedIn: 'root' })
export class ServicoService extends BaseApiService<Servico> {
  constructor() { super('/servicos'); }
}
