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
  private agendamentoService = inject(AgendamentoService);

  ngOnInit() {
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    this.isLoading = true;
    this.agendamentoService.listar().subscribe({
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
}