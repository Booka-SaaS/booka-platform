import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { LojaService } from '../../services/loja.service';
import { Loja } from '../../models';

@Component({
  selector: 'app-dados-loja',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, NavbarComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './dados-loja.component.html',
  styleUrl: './dados-loja.component.css'
})
export class DadosLojaComponent implements OnInit {
  loja: Partial<Loja> = {
    nome: '',
    telefone: '',
    endereco: '',
    email: '',
    cidade: '',
    descricao: ''
  };
  isLoading = true;
  isSaving = false;
  private lojaService = inject(LojaService);

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.isLoading = true;
    this.lojaService.obter().subscribe({
      next: (dados) => {
        if (dados) {
          this.loja = dados;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  salvarDados() {
    this.isSaving = true;
    this.lojaService.atualizar(this.loja).subscribe({
      next: (dados) => {
        this.loja = dados;
        this.isSaving = false;
        alert('Dados salvos com sucesso!');
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;
        alert('Erro ao salvar dados.');
      }
    });
  }
}