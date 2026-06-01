import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AgendamentoService } from '../../services/agendamento.service';
import { Agendamento } from '../../models';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, NavbarComponent, CommonModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  isLoading = true;
  readonly hoje = new Date();
  readonly dataHojeFiltro = this.formatarDataFiltro(this.hoje);
  readonly dataHojeLabel = this.formatarDataLabel(this.hoje);
  private agendamentoService = inject(AgendamentoService);

  ngOnInit() {
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    this.isLoading = true;
    this.agendamentoService.listar({ data: this.dataHojeFiltro }).subscribe({
      next: (dados: Agendamento[]) => {
        this.agendamentos = dados;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  private formatarDataFiltro(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }

  private formatarDataLabel(data: Date): string {
    const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    }).format(data);

    return dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
  }
}
