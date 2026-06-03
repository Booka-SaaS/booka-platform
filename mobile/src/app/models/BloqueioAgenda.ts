import { BaseEntity } from './BaseEntity';

export interface BloqueioAgenda extends BaseEntity {
  lojaId: string;
  inicio: string;     // ISO 8601 DateTime
  fim: string;        // ISO 8601 DateTime
  motivo?: string | null;
}
