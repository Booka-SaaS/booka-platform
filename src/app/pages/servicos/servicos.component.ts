import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ServicoService, CreateServicoRequest } from '../../services/servico.service';
import { Servico } from '../../models';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './servicos.component.html',
  styleUrl: './servicos.component.css'
})
export class ServicosComponent implements OnInit {
  servicos: Servico[] = [];
  isLoading = true;
  isSaving = false;
  showModal = false;

  novoServico: CreateServicoRequest = {
    nome: '',
    preco: 0,
    duracaoMinutos: 0
  };

  private servicoService = inject(ServicoService);

  ngOnInit() {
    this.carregarServicos();
  }

  carregarServicos() {
    this.isLoading = true;
    this.servicoService.listar().subscribe({
      next: (dados) => {
        this.servicos = dados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar serviços', err);
        this.isLoading = false;
      }
    });
  }

  abrirModal() {
    this.showModal = true;
  }

  fecharModal() {
    this.showModal = false;
    this.novoServico = { nome: '', preco: 0, duracaoMinutos: 0 };
  }

  salvarServico() {
    if (!this.novoServico.nome || !this.novoServico.preco) return;

    this.isSaving = true;
    this.servicoService.criar(this.novoServico).subscribe({
      next: () => {
        this.isSaving = false;
        this.fecharModal();
        this.carregarServicos();
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        alert('Erro ao salvar serviço. Tente novamente.');
      }
    });
  }
}