import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { BloqueioAgenda } from '../models';

/**
 * Serviço para gestão de bloqueios de agenda (férias, almoço, etc.).
 * Herda CRUD completo de BaseApiService — zero duplicação.
 */
@Injectable({ providedIn: 'root' })
export class BloqueioService extends BaseApiService<BloqueioAgenda> {
  constructor() { super('/bloqueios'); }
}
