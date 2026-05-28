import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DashboardService, DashboardResumo } from '../../services/dashboard.service';
import { AgendamentoService } from '../../services/agendamento.service';
import { Agendamento } from '../../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, NavbarComponent, CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  resumo: DashboardResumo | null = null;
  agendamentosHoje: Agendamento[] = [];
  isLoading = true;
  errorMessage = '';

  private dashboardService = inject(DashboardService);
  private agendamentoService = inject(AgendamentoService);

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.isLoading = true;
    const dataHoje = this.dashboardService.dataHojeISO;

    forkJoin({
      resumo: this.dashboardService.obterResumo(),
      agendamentos: this.agendamentoService.listar({ data: dataHoje }),
    }).subscribe({
      next: ({ resumo, agendamentos }) => {
        this.resumo = resumo;
        this.agendamentosHoje = agendamentos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard:', err);
        this.errorMessage = 'Erro ao carregar dados do dashboard.';
        this.isLoading = false;
      }
    });
  }

  atualizarStatus(id: string, status: 'CONCLUIDO' | 'CANCELADO') {
    this.agendamentoService.atualizarStatus(id, status).subscribe({
      next: (updated) => {
        const idx = this.agendamentosHoje.findIndex(a => a.id === id);
        if (idx !== -1) this.agendamentosHoje[idx] = updated;
      },
      error: (err) => {
        console.error('Erro ao atualizar status:', err);
        alert('Não foi possível atualizar o agendamento.');
      }
    });
  }

  get nomeLoja(): string {
    return this.resumo?.loja?.nome || 'Minha Loja';
  }

  get totalClientes(): number {
    return this.resumo?.metricas?.clientes || 0;
  }

  get totalServicos(): number {
    return this.resumo?.metricas?.servicosAtivos || 0;
  }

  get agendamentosHojeCount(): number {
    return this.resumo?.metricas?.agendamentosHoje || 0;
  }

  get proximoAgendamento() {
    return this.resumo?.proximoAgendamento || null;
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      CONFIRMADO: 'bg-emerald-100 text-emerald-700',
      PENDENTE: 'bg-blue-100 text-blue-700',
      CANCELADO: 'bg-red-100 text-red-600',
      CONCLUIDO: 'bg-slate-100 text-slate-600',
    };
    return map[status] ?? 'bg-blue-100 text-blue-700';
  }

  podeAtualizar(status: string): boolean {
    return status === 'PENDENTE' || status === 'CONFIRMADO';
  }
}
