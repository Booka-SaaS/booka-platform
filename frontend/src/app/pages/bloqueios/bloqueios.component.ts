import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { BloqueioAgenda, BloqueioService, CreateBloqueioRequest } from '../../services/bloqueio.service';

@Component({
  selector: 'app-bloqueios',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, NavbarComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './bloqueios.component.html',
  styleUrl: './bloqueios.component.css',
})
export class BloqueiosComponent implements OnInit {
  bloqueios: BloqueioAgenda[] = [];
  isLoading = true;
  isSaving = false;

  form = {
    dataInicio: '',
    horaInicio: '',
    dataFim: '',
    horaFim: '',
    motivo: 'Férias',
  };

  private bloqueioService = inject(BloqueioService);

  ngOnInit() {
    this.carregarBloqueios();
  }

  carregarBloqueios() {
    this.isLoading = true;
    this.bloqueioService.listar().subscribe({
      next: (dados) => {
        this.bloqueios = dados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar bloqueios', err);
        this.isLoading = false;
      },
    });
  }

  salvarBloqueio() {
    if (!this.form.dataInicio || !this.form.horaInicio || !this.form.dataFim || !this.form.horaFim) {
      alert('Preencha todos os campos de data e hora.');
      return;
    }

    const inicio = `${this.form.dataInicio}T${this.form.horaInicio}:00`;
    const fim = `${this.form.dataFim}T${this.form.horaFim}:00`;

    if (new Date(fim) <= new Date(inicio)) {
      alert('A data/hora de fim deve ser posterior ao início.');
      return;
    }

    const payload: CreateBloqueioRequest = { inicio, fim, motivo: this.form.motivo || null };
    this.isSaving = true;

    this.bloqueioService.criar(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.limparForm();
        this.carregarBloqueios();
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        alert('Erro ao salvar bloqueio. Tente novamente.');
      },
    });
  }

  deletarBloqueio(id: string) {
    if (!confirm('Tem certeza que deseja remover este bloqueio?')) return;

    this.bloqueioService.deletar(id).subscribe({
      next: () => this.carregarBloqueios(),
      error: (err) => {
        console.error(err);
        alert('Erro ao deletar bloqueio.');
      },
    });
  }

  limparForm() {
    this.form = { dataInicio: '', horaInicio: '', dataFim: '', horaFim: '', motivo: 'Férias' };
  }

  formatarPeriodo(inicio: string, fim: string): string {
    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    return `${inicioDate.toLocaleString('pt-BR', options)} até ${fimDate.toLocaleString('pt-BR', options)}`;
  }

  get proximoBloqueio(): BloqueioAgenda | null {
    const agora = new Date();
    return this.bloqueios.find((bloqueio) => new Date(bloqueio.fim) > agora) ?? null;
  }

  get totalBloqueios(): number {
    return this.bloqueios.length;
  }

  get bloqueiosFuturos(): number {
    const agora = new Date();
    return this.bloqueios.filter((bloqueio) => new Date(bloqueio.inicio) > agora).length;
  }
}
