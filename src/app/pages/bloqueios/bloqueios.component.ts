import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { BloqueioService } from '../../services/bloqueio.service';

interface Bloqueio {
  id: number;
  data_inicio: string;
  data_fim: string;
  motivo: string;
}

@Component({
  selector: 'app-bloqueios',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, NavbarComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './bloqueios.component.html',
  styleUrl: './bloqueios.component.css'
})
export class BloqueiosComponent implements OnInit {
  bloqueios: Bloqueio[] = [];
  isLoading = true;
  isSaving = false;
  showModal = false;

  novoBloqueio: Partial<Bloqueio> = {
    data_inicio: '',
    data_fim: '',
    motivo: 'Férias'
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
      }
    });
  }

  abrirModal() {
    this.showModal = true;
  }

  fecharModal() {
    this.showModal = false;
    this.novoBloqueio = { data_inicio: '', data_fim: '', motivo: 'Férias' };
  }

  salvarBloqueio() {
    if (!this.novoBloqueio.data_inicio || !this.novoBloqueio.data_fim) return;

    this.isSaving = true;
    this.bloqueioService.criar(this.novoBloqueio as Bloqueio).subscribe({
      next: () => {
        this.isSaving = false;
        this.fecharModal();
        this.carregarBloqueios();
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        alert('Erro ao salvar bloqueio. Tente novamente.');
      }
    });
  }

  deletarBloqueio(id: number) {
    if (confirm('Tem certeza que deseja remover este bloqueio?')) {
      this.bloqueioService.deletar(id).subscribe({
        next: () => {
          this.carregarBloqueios();
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao deletar bloqueio.');
        }
      });
    }
  }
}