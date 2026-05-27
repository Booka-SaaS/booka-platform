import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { LojaService } from '../../services/loja.service';
import { DisponibilidadeService, UpdateDisponibilidadeItem } from '../../services/disponibilidade.service';
import { Loja } from '../../models';
import { forkJoin } from 'rxjs';

interface HorarioDia {
  abertura: string;
  fechamento: string;
  ativo: boolean;
}

@Component({
  selector: 'app-dados-loja',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, NavbarComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './dados-loja.component.html',
  styleUrl: './dados-loja.component.css',
})
export class DadosLojaComponent implements OnInit {
  loja: Partial<Loja> = {
    nome: '',
    telefone: '',
    endereco: '',
    email: '',
    cidade: '',
    descricao: '',
  };

  horarioSemana: HorarioDia = { abertura: '09:00', fechamento: '18:00', ativo: true };
  horarioSabado: HorarioDia = { abertura: '09:00', fechamento: '14:00', ativo: true };

  isLoading = true;
  isSaving = false;

  private lojaService = inject(LojaService);
  private disponibilidadeService = inject(DisponibilidadeService);

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.isLoading = true;
    forkJoin({
      loja: this.lojaService.obter(),
      disponibilidade: this.disponibilidadeService.listar(),
    }).subscribe({
      next: ({ loja, disponibilidade }) => {
        this.loja = loja;

        const seg = disponibilidade.find((d) => d.diaSemana === 1);
        if (seg) {
          this.horarioSemana = { abertura: seg.horaInicio, fechamento: seg.horaFim, ativo: seg.ativo };
        }

        const sab = disponibilidade.find((d) => d.diaSemana === 6);
        if (sab) {
          this.horarioSabado = { abertura: sab.horaInicio, fechamento: sab.horaFim, ativo: sab.ativo };
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  salvarDados() {
    this.isSaving = true;

    const diasUteis: UpdateDisponibilidadeItem[] = [1, 2, 3, 4, 5].map((diaSemana) => ({
      diaSemana,
      horaInicio: this.horarioSemana.abertura,
      horaFim: this.horarioSemana.fechamento,
      intervaloMinutos: 30,
      ativo: this.horarioSemana.ativo,
    }));

    const sabado: UpdateDisponibilidadeItem = {
      diaSemana: 6,
      horaInicio: this.horarioSabado.abertura,
      horaFim: this.horarioSabado.fechamento,
      intervaloMinutos: 30,
      ativo: this.horarioSabado.ativo,
    };

    const domingo: UpdateDisponibilidadeItem = {
      diaSemana: 0,
      horaInicio: '00:00',
      horaFim: '00:00',
      intervaloMinutos: 30,
      ativo: false,
    };

    forkJoin({
      loja: this.lojaService.atualizar(this.loja),
      disponibilidade: this.disponibilidadeService.atualizar([...diasUteis, sabado, domingo]),
    }).subscribe({
      next: ({ loja }) => {
        this.loja = loja;
        this.isSaving = false;
        alert('Dados salvos com sucesso!');
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;
        alert('Erro ao salvar dados.');
      },
    });
  }
}
