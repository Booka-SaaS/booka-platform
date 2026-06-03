import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonSearchbar, IonModal, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, chatbubbleOutline, closeOutline, logoWhatsapp } from 'ionicons/icons';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonSearchbar, IonModal, IonFab, IonFabButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  isLoading = true;
  isSaving = false;
  showModal = false;
  novoCliente: Partial<Cliente> = { nome: '', email: '', telefone: '' };
  private clienteService = inject(ClienteService);

  constructor() { addIcons({ addOutline, chatbubbleOutline, closeOutline, logoWhatsapp }); }

  ngOnInit() { this.carregarClientes(); }

  carregarClientes() {
    this.isLoading = true;
    this.clienteService.listar().subscribe({
      next: (dados) => { this.clientes = dados; this.isLoading = false; },
      error: (err) => { console.error('Erro ao buscar clientes', err); this.isLoading = false; }
    });
  }

  abrirModal() { this.showModal = true; }
  fecharModal() { this.showModal = false; this.novoCliente = { nome: '', email: '', telefone: '' }; }

  salvarCliente() {
    if (!this.novoCliente.nome) return;
    this.isSaving = true;
    this.clienteService.criar(this.novoCliente as Cliente).subscribe({
      next: () => { this.isSaving = false; this.fecharModal(); this.carregarClientes(); },
      error: (err) => { this.isSaving = false; console.error(err); alert('Erro ao salvar cliente.'); }
    });
  }
}
