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
  styleUrl: './bloqueios.component.css'
})
export class BloqueiosComponent implements OnInit {
  bloqueios: BloqueioAgenda[] = [];
  isLoading = true;
  isSaving = false;
  showModal = false;

  novoBloqueio: CreateBloqueioRequest = {
    inicio: '',
    fim: '',
    motivo: 'Ferias'
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
    this.novoBloqueio = { inicio: '', fim: '', motivo: 'Ferias' };
  }

  salvarBloqueio() {
    if (!this.novoBloqueio.inicio || !this.novoBloqueio.fim) return;

    this.isSaving = true;
    this.bloqueioService.criar(this.novoBloqueio).subscribe({
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

  deletarBloqueio(id: string) {
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
