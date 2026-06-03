import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home-marketplace',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FooterComponent],
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

  constructor(private router: Router) {}

  buscarServico() {
    this.router.navigate(['/explorar'], { queryParams: { q: this.termoBusca, local: this.cidadeBusca } });
  }
}
