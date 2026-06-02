import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Cliente } from '../models';

/**
 * Serviço para gestão de clientes.
 * Herda CRUD completo de BaseApiService — zero duplicação.
 */
@Injectable({ providedIn: 'root' })
export class ClienteService extends BaseApiService<Cliente> {
  constructor() { super('/clientes'); }
}
