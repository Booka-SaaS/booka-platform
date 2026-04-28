import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  isLoading = true;
  isSaving = false;
  showModal = false;

  novoCliente: Partial<Cliente> = {
    nome: '',
    email: '',
    telefone: ''
  };

  private clienteService = inject(ClienteService);

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.isLoading = true;
    this.clienteService.listar().subscribe({
      next: (dados) => {
        this.clientes = dados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar clientes', err);
        this.isLoading = false;
      }
    });
  }

  abrirModal() {
    this.showModal = true;
  }

  fecharModal() {
    this.showModal = false;
    this.novoCliente = { nome: '', email: '', telefone: '' };
  }

  salvarCliente() {
    if (!this.novoCliente.nome) return;

    this.isSaving = true;
    this.clienteService.criar(this.novoCliente as Cliente).subscribe({
      next: () => {
        this.isSaving = false;
        this.fecharModal();
        this.carregarClientes();
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        alert('Erro ao salvar cliente. Tente novamente.');
      }
    });
  }
}