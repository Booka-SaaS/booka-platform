import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonModal, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, closeOutline, cutOutline, timeOutline, cashOutline } from 'ionicons/icons';
import { ServicoService } from '../../services/servico.service';
import { Servico } from '../../models';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonModal, IonFab, IonFabButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './servicos.component.html',
  styleUrl: './servicos.component.css'
})
export class ServicosComponent implements OnInit {
  servicos: Servico[] = [];
  isLoading = true;
  isSaving = false;
  showModal = false;
  novoServico: Partial<Servico> = { nome: '', preco: 0, duracaoMinutos: 0 };
  private servicoService = inject(ServicoService);

  constructor() { addIcons({ addOutline, closeOutline, cutOutline, timeOutline, cashOutline }); }

  ngOnInit() { this.carregarServicos(); }

  carregarServicos() {
    this.isLoading = true;
    this.servicoService.listar().subscribe({
      next: (dados) => { this.servicos = dados; this.isLoading = false; },
      error: (err) => { console.error('Erro ao buscar serviços', err); this.isLoading = false; }
    });
  }

  abrirModal() { this.showModal = true; }
  fecharModal() { this.showModal = false; this.novoServico = { nome: '', preco: 0, duracaoMinutos: 0 }; }

  salvarServico() {
    if (!this.novoServico.nome || !this.novoServico.preco) return;
    this.isSaving = true;
    this.servicoService.criar(this.novoServico as Servico).subscribe({
      next: () => { this.isSaving = false; this.fecharModal(); this.carregarServicos(); },
      error: (err) => { this.isSaving = false; console.error(err); alert('Erro ao salvar serviço.'); }
    });
  }
}
