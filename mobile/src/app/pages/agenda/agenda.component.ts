import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline, calendarOutline, timeOutline, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { AgendamentoService } from '../../services/agendamento.service';
import { Agendamento } from '../../models';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [RouterModule, CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonRefresher, IonRefresherContent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  isLoading = true;
  private agendamentoService = inject(AgendamentoService);

  constructor() {
    addIcons({ refreshOutline, calendarOutline, timeOutline, checkmarkCircleOutline, closeCircleOutline });
  }

  ngOnInit() { this.carregarAgendamentos(); }

  carregarAgendamentos() {
    this.isLoading = true;
    this.agendamentoService.listar().subscribe({
      next: (dados) => { this.agendamentos = dados; this.isLoading = false; },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  handleRefresh(event: any) {
    this.agendamentoService.listar().subscribe({
      next: (dados) => { this.agendamentos = dados; event.target.complete(); },
      error: () => event.target.complete()
    });
  }

  cancelar(id: string) {
    this.agendamentoService.deletar(id).subscribe({
      next: () => {
        this.agendamentos = this.agendamentos.filter(a => a.id !== id);
        alert('Cancelado com sucesso!');
      },
      error: (err: any) => console.error(err)
    });
  }
}
