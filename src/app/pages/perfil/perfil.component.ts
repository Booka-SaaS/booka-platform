import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, NavbarComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  private authService = inject(AuthService);

  usuario = {
    nome: this.authService.getRole() === 'PROFISSIONAL' ? 'Admin Loja Centro' : 'Usuário Cliente',
    email: this.authService.getRole() === 'PROFISSIONAL' ? 'admin@booka.com' : 'cliente@exemplo.com',
    telefone: '(11) 99999-9999',
    iniciais: this.authService.getRole() === 'PROFISSIONAL' ? 'LC' : 'UC'
  };

  get isProfissional(): boolean {
    return this.authService.getRole() === 'PROFISSIONAL';
  }
}