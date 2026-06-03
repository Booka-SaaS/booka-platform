import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, checkmarkCircleOutline,
  chevronBackOutline, chevronForwardOutline,
  timeOutline, cashOutline
} from 'ionicons/icons';
import { ProfissionalService } from '../../services/profissional.service';
import { AgendamentoService } from '../../services/agendamento.service';
import { ModalService } from '../../services/modal.service';
import { Profissional, Servico } from '../../models';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonButton, IonIcon
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css'
})
export class AgendarComponent implements OnInit {
  profissionalId: string | null = null;
  profissional: Profissional | null = null;
  isLoading = true;
  isSaving = false;

  servicoSelecionado: Servico | null = null;
  dataSelecionada: Date | null = null;
  horarioSelecionado: string | null = null;
  horariosDisponiveis: string[] = [];

  // Calendário
  mesAtualNome = '';
  diasDoMes: (number | null)[] = [];
  dataAtual = new Date();
  diaSelecionado: number | null = null;

  private profissionalService = inject(ProfissionalService);
  private agendamentoService = inject(AgendamentoService);
  private modalService = inject(ModalService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    addIcons({
      arrowBackOutline, checkmarkCircleOutline,
      chevronBackOutline, chevronForwardOutline,
      timeOutline, cashOutline
    });
  }

  ngOnInit() {
    this.gerarCalendario(this.dataAtual);
    this.carregarProfissional();
  }

  // ─── Dados do Profissional ──────────────────────────────────────────
  carregarProfissional() {
    this.route.paramMap.subscribe(params => {
      // Aceita tanto :id quanto :slug para compatibilidade de rota
      this.profissionalId = params.get('id') || params.get('slug');
      if (!this.profissionalId) return;

      this.isLoading = true;
      this.profissionalService.obterPorId(this.profissionalId).subscribe({
        next: (res) => {
          this.profissional = res;
          if (res?.servicos?.length) {
            this.servicoSelecionado = res.servicos[0];
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar profissional:', err);
          this.isLoading = false;
        }
      });
    });
  }

  // ─── Calendário ─────────────────────────────────────────────────────
  gerarCalendario(data: Date) {
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const nomes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    this.mesAtualNome = `${nomes[mes]} ${ano}`;

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    this.diasDoMes = [...Array(primeiroDia).fill(null), ...Array.from({ length: ultimoDia }, (_, i) => i + 1)];
  }

  mudarMes(delta: number) {
    this.dataAtual.setMonth(this.dataAtual.getMonth() + delta);
    this.gerarCalendario(this.dataAtual);
    this.resetSelecao();
  }

  // ─── Seleções ───────────────────────────────────────────────────────
  selecionarServico(servico: Servico) {
    this.servicoSelecionado = servico;
  }

  selecionarData(dia: number) {
    this.diaSelecionado = dia;
    this.dataSelecionada = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth(), dia);
    this.horarioSelecionado = null;
    this.buscarHorarios();
  }

  selecionarHorario(hora: string) {
    this.horarioSelecionado = hora;
  }

  // ─── Horários da API ───────────────────────────────────────────────
  private buscarHorarios() {
    if (!this.profissionalId || !this.dataSelecionada) return;

    const dataFormatada = this.dataSelecionada.toISOString().split('T')[0];
    this.profissionalService.obterDisponibilidade(this.profissionalId, dataFormatada).subscribe({
      next: (res) => this.horariosDisponiveis = res.slots || [],
      error: () => this.horariosDisponiveis = []
    });
  }

  // ─── Finalizar ──────────────────────────────────────────────────────
  get podeFinalizar(): boolean {
    return !!(this.servicoSelecionado && this.dataSelecionada && this.horarioSelecionado);
  }

  finalizarAgendamento() {
    if (!this.podeFinalizar || !this.dataSelecionada) return;

    this.isSaving = true;
    const dataFormatada = this.dataSelecionada.toISOString().split('T')[0];

    const dados = {
      servicoId: this.servicoSelecionado!.id,
      profissionalId: this.profissional?.id,
      inicio: `${dataFormatada}T${this.horarioSelecionado}:00`,
    };

    this.agendamentoService.criarPublico(dados).subscribe({
      next: () => {
        this.isSaving = false;
        this.modalService.success(
          'Agendamento Confirmado!',
          'Seu agendamento foi registrado com sucesso! Enviamos uma confirmação para seu e-mail e WhatsApp.',
          'OK', () => this.router.navigate(['/explorar'])
        );
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Erro ao criar agendamento:', err);
        this.modalService.alert('Erro', 'Erro ao confirmar agendamento. Tente novamente.');
      }
    });
  }

  voltar() {
    this.router.navigate(['/explorar']);
  }

  private resetSelecao() {
    this.diaSelecionado = null;
    this.dataSelecionada = null;
    this.horarioSelecionado = null;
    this.horariosDisponiveis = [];
  }
}
