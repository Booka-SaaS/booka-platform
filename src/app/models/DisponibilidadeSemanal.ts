import { BaseEntity } from './BaseEntity';

export interface DisponibilidadeSemanal extends BaseEntity {
  lojaId: string;
  diaSemana: number;         // 0=Dom, 1=Seg, ..., 6=Sáb
  horaInicio: string;        // Formato HH:mm
  horaFim: string;           // Formato HH:mm
  intervaloMinutos: number;
  ativo: boolean;
}
