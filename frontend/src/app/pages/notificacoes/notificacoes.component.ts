import { Component, OnInit, inject } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Notificacao, NotificacaoService } from '../../services/notificacao.service';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, NavbarComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './notificacoes.component.html',
  styleUrl: './notificacoes.component.css',
})
export class NotificacoesComponent implements OnInit {
  private readonly notificacaoService = inject(NotificacaoService);

  notificacoes: Notificacao[] = [];
  loading = true;
  errorMessage = '';
  actionId: string | null = null;

  canais = {
    sms: true,
    email: true,
    whatsapp: false,
  };

  saved = false;

  ngOnInit() {
    this.carregar();
  }

  get naoLidas() {
    return this.notificacoes.filter(notificacao => !notificacao.lida).length;
  }

  carregar() {
    this.loading = true;
    this.errorMessage = '';

    this.notificacaoService.listar()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: notificacoes => {
          this.notificacoes = notificacoes;
        },
        error: () => {
          this.errorMessage = 'Nao foi possivel carregar as notificacoes.';
        },
      });
  }

  marcarComoLida(notificacao: Notificacao) {
    if (notificacao.lida) {
      return;
    }

    this.actionId = notificacao.id;
    this.notificacaoService.marcarComoLida(notificacao.id)
      .pipe(finalize(() => (this.actionId = null)))
      .subscribe({
        next: atualizada => {
          this.notificacoes = this.notificacoes.map(item => item.id === atualizada.id ? atualizada : item);
        },
        error: () => {
          this.errorMessage = 'Nao foi possivel marcar a notificacao como lida.';
        },
      });
  }

  salvar() {
    this.saved = true;
    setTimeout(() => (this.saved = false), 3000);
  }

  cancelar() {
    this.canais = { sms: true, email: true, whatsapp: false };
  }
}
