import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { BloqueioService, BloqueioAgenda, CreateBloqueioRequest } from '../../services/bloqueio.service';
import { ModalService } from '../../services/modal.service';

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
  private modalService = inject(ModalService);

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
        this.modalService.alert('Erro', 'Não foi possível carregar os bloqueios da agenda.');
      },
    });
  }

  salvarBloqueio() {
    if (!this.form.dataInicio || !this.form.horaInicio || !this.form.dataFim || !this.form.horaFim) {
      this.modalService.alert('Atenção', 'Preencha todos os campos de data e hora.');
      return;
    }

    const inicio = this.toIsoLocal(this.form.dataInicio, this.form.horaInicio);
    const fim = this.toIsoLocal(this.form.dataFim, this.form.horaFim);

    if (new Date(fim) <= new Date(inicio)) {
      this.modalService.alert('Atenção', 'A data/hora de fim deve ser posterior ao início.');
      return;
    }

    const payload: CreateBloqueioRequest = { inicio, fim, motivo: this.form.motivo || null };
    this.isSaving = true;

    this.bloqueioService.criar(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.limparForm();
        this.carregarBloqueios();
        this.modalService.success('Agenda bloqueada', 'O período foi bloqueado com sucesso.');
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        this.modalService.alert('Erro', 'Erro ao salvar bloqueio. Tente novamente.');
      },
    });
  }

  bloquearAlmocoDiasUteis() {
    const dataInicio = this.form.dataInicio || this.dataHoje();
    const dataFim = this.form.dataFim || dataInicio;
    const horaInicio = this.form.horaInicio || '12:00';
    const horaFim = this.form.horaFim || '13:00';

    if (new Date(`${dataFim}T00:00:00`) < new Date(`${dataInicio}T00:00:00`)) {
      this.modalService.alert('Atenção', 'A data final do almoço não pode ser anterior à data inicial.');
      return;
    }

    if (new Date(`2000-01-01T${horaFim}:00`) <= new Date(`2000-01-01T${horaInicio}:00`)) {
      this.modalService.alert('Atenção', 'O horário final do almoço deve ser posterior ao horário inicial.');
      return;
    }

    const bloqueios = this.gerarBloqueiosAlmoco(dataInicio, dataFim, horaInicio, horaFim);
    if (bloqueios.length === 0) {
      this.modalService.alert('Atenção', 'O período selecionado não possui dias úteis para bloquear.');
      return;
    }

    this.isSaving = true;
    this.bloqueioService.criarLote(bloqueios).subscribe({
      next: () => {
        this.isSaving = false;
        this.aplicarPreset('almoco');
        this.carregarBloqueios();
        this.modalService.success('Almoço bloqueado', `${bloqueios.length} horário(s) de almoço foram bloqueados.`);
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        this.modalService.alert('Erro', 'Erro ao bloquear almoços. Tente novamente.');
      },
    });
  }

  deletarBloqueio(id: string) {
    this.modalService.confirm(
      'Remover bloqueio',
      'Tem certeza que deseja remover este bloqueio da agenda?',
      () => {
        this.bloqueioService.deletar(id).subscribe({
          next: () => this.carregarBloqueios(),
          error: (err) => {
            console.error(err);
            this.modalService.alert('Erro', 'Erro ao deletar bloqueio.');
          },
        });
      },
      'Remover'
    );
  }

  aplicarPreset(tipo: 'ferias' | 'almoco') {
    const hoje = this.dataHoje();
    if (tipo === 'ferias') {
      this.form.motivo = 'Férias';
      this.form.dataInicio ||= hoje;
      this.form.dataFim ||= this.form.dataInicio;
      this.form.horaInicio = '00:00';
      this.form.horaFim = '23:59';
      return;
    }

    this.form.motivo = 'Almoço';
    this.form.dataInicio ||= hoje;
    this.form.dataFim ||= this.form.dataInicio;
    this.form.horaInicio = '12:00';
    this.form.horaFim = '13:00';
  }

  limparForm() {
    this.form = { dataInicio: '', horaInicio: '', dataFim: '', horaFim: '', motivo: 'Férias' };
  }

  formatarPeriodo(inicio: string, fim: string): string {
    const i = new Date(inicio);
    const f = new Date(fim);
    const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return `${i.toLocaleString('pt-BR', opts)} até ${f.toLocaleString('pt-BR', opts)}`;
  }

  get proximoBloqueio(): BloqueioAgenda | null {
    const agora = new Date();
    return this.bloqueios.find((b) => new Date(b.fim) > agora) ?? null;
  }

  get totalBloqueios(): number {
    return this.bloqueios.length;
  }

  get bloqueiosFuturos(): number {
    const agora = new Date();
    return this.bloqueios.filter((b) => new Date(b.inicio) > agora).length;
  }

  private gerarBloqueiosAlmoco(dataInicio: string, dataFim: string, horaInicio: string, horaFim: string): CreateBloqueioRequest[] {
    const bloqueios: CreateBloqueioRequest[] = [];
    const cursor = new Date(`${dataInicio}T00:00:00`);
    const fim = new Date(`${dataFim}T00:00:00`);

    while (cursor <= fim) {
      const diaSemana = cursor.getDay();
      if (diaSemana >= 1 && diaSemana <= 5) {
        const data = this.formatarDataInput(cursor);
        bloqueios.push({
          inicio: this.toIsoLocal(data, horaInicio),
          fim: this.toIsoLocal(data, horaFim),
          motivo: 'Almoço',
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return bloqueios;
  }

  private toIsoLocal(data: string, hora: string): string {
    return new Date(`${data}T${hora}:00`).toISOString();
  }

  private dataHoje(): string {
    return this.formatarDataInput(new Date());
  }

  private formatarDataInput(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
