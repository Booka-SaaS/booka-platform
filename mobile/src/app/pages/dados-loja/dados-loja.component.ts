import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, storefrontOutline } from 'ionicons/icons';
import { LojaService } from '../../services/loja.service';
import { Loja } from '../../models';

@Component({
  selector: 'app-dados-loja',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dados-loja.component.html',
  styleUrl: './dados-loja.component.css'
})
export class DadosLojaComponent implements OnInit {
  loja: Partial<Loja> = { nome: '', telefone: '', endereco: '' };
  isLoading = true;
  isSaving = false;
  private lojaService = inject(LojaService);

  constructor() { addIcons({ saveOutline, storefrontOutline }); }

  ngOnInit() { this.carregarDados(); }

  carregarDados() {
    this.isLoading = true;
    this.lojaService.buscarDados().subscribe({
      next: (dados) => { if (dados) { this.loja = dados; } this.isLoading = false; },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  salvarDados() {
    this.isSaving = true;
    this.lojaService.atualizarDados(this.loja).subscribe({
      next: (dados) => { this.loja = dados; this.isSaving = false; alert('Dados salvos!'); },
      error: (err) => { console.error(err); this.isSaving = false; alert('Erro ao salvar.'); }
    });
  }
}
