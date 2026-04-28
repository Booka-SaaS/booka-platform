import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-home-marketplace',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FooterComponent, NavbarComponent],
  templateUrl: './home-marketplace.component.html',
  styles: [`
    .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    .text-editorial-hero {
        letter-spacing: -0.02em;
    }
    .glass-nav {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }
  `]
})
export class HomeMarketplaceComponent {
  termoBusca: string = '';
  cidadeBusca: string = '';

  constructor(private router: Router, private authService: AuthService, private modalService: ModalService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isProfissional(): boolean {
    return this.authService.getRole() === 'PROFISSIONAL';
  }

  logout() {
    this.modalService.confirm(
      'Sair da Conta', 
      'Tem certeza que deseja sair?', 
      () => {
        this.authService.logout();
        this.router.navigate(['/']);
      },
      'Sair'
    );
  }

  buscarServico() {
    this.router.navigate(['/explorar'], { queryParams: { q: this.termoBusca, local: this.cidadeBusca } });
  }
}
