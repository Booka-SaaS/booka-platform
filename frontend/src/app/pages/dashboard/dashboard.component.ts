import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DashboardService, DashboardResumo } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, NavbarComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  resumo: DashboardResumo | null = null;
  isLoading = true;
  errorMessage = '';

  private dashboardService = inject(DashboardService);

  ngOnInit() {
    this.carregarResumo();
  }

  carregarResumo() {
    this.isLoading = true;
    this.dashboardService.obterResumo().subscribe({
      next: (dados) => {
        this.resumo = dados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard:', err);
        this.errorMessage = 'Erro ao carregar dados do dashboard.';
        this.isLoading = false;
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

  get agendamentosHoje(): number {
    return this.resumo?.metricas?.agendamentosHoje || 0;
  }

  get proximoAgendamento() {
    return this.resumo?.proximoAgendamento || null;
  }
}