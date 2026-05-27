import { Component, OnInit, inject } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MeResponse } from '../../models';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, NavbarComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  private authService = inject(AuthService);
  isLoading = true;

  usuario = {
    nome: '',
    email: '',
    telefone: '',
    iniciais: ''
  };

  ngOnInit() {
    this.carregarPerfil();
  }

  carregarPerfil() {
    this.isLoading = true;
    this.authService.getMe().subscribe({
      next: (dados: MeResponse) => {
        this.usuario = {
          nome: dados.user.nome,
          email: dados.user.email,
          telefone: '',
          iniciais: this.gerarIniciais(dados.user.nome)
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar perfil:', err);
        this.isLoading = false;
      }
    });
  }

  get isProfissional(): boolean {
    return this.authService.getRole() === 'PROFISSIONAL';
  }

  private gerarIniciais(nome: string): string {
    const partes = nome.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  }
}