import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonIcon, IonFab, IonFabButton, IonModal,
  IonButtons, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, lockClosedOutline, closeOutline, trashOutline } from 'ionicons/icons';
import { BloqueioService } from '../../services/bloqueio.service';
import { ModalService } from '../../services/modal.service';
import { BloqueioAgenda } from '../../models';

@Component({
  selector: 'app-bloqueios',
  standalone: true,
  imports: [
    RouterModule, CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonIcon, IonFab, IonFabButton, IonModal,
    IonButtons, IonButton
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './bloqueios.component.html',
  styleUrl: './bloqueios.component.css'
})
export class BloqueiosComponent implements OnInit {
  bloqueios: BloqueioAgenda[] = [];
  isLoading = true;
  isSaving = false;
  showModal = false;

  novoBloqueio = this.criarBloqueioVazio();

  private bloqueioService = inject(BloqueioService);
  private modalService = inject(ModalService);

  constructor() {
    addIcons({ addOutline, lockClosedOutline, closeOutline, trashOutline });
  }

  ngOnInit() {
    this.carregarBloqueios();
  }

  // ─── CRUD ───────────────────────────────────────────────────────────
  carregarBloqueios() {
    this.isLoading = true;
    this.bloqueioService.listar().subscribe({
      next: (dados) => { this.bloqueios = dados; this.isLoading = false; },
      error: (err) => { console.error('Erro ao buscar bloqueios', err); this.isLoading = false; }
    });
  }

  salvarBloqueio() {
    if (!this.novoBloqueio.inicio || !this.novoBloqueio.fim) return;

    this.isSaving = true;
    this.bloqueioService.criar(this.novoBloqueio as BloqueioAgenda).subscribe({
      next: () => {
        this.isSaving = false;
        this.fecharModal();
        this.carregarBloqueios();
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        this.modalService.alert('Erro', 'Erro ao salvar bloqueio. Tente novamente.');
      }
    });
  }

  deletarBloqueio(id: string) {
    if (!this.modalService.confirm('Remover Bloqueio', 'Tem certeza que deseja remover este bloqueio?')) return;

    this.bloqueioService.deletar(id).subscribe({
      next: () => this.carregarBloqueios(),
      error: (err) => {
        console.error(err);
        this.modalService.alert('Erro', 'Erro ao deletar bloqueio.');
      }
    });
  }

  // ─── Modal ──────────────────────────────────────────────────────────
  abrirModal() { this.showModal = true; }

  fecharModal() {
    this.showModal = false;
    this.novoBloqueio = this.criarBloqueioVazio();
  }

  private criarBloqueioVazio(): Partial<BloqueioAgenda> {
    return { inicio: '', fim: '', motivo: 'Férias' };
  }
}
