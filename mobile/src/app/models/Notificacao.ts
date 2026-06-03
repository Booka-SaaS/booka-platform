import { BaseEntity } from './BaseEntity';

export type TipoNotificacao = 'AGENDAMENTO' | 'SISTEMA' | 'LEMBRETE';

export interface Notificacao {
  id: string;
  usuarioId: string;
  titulo: string;
  mensagem: string;
  tipo: TipoNotificacao;
  lida: boolean;
  createdAt: string;
}
