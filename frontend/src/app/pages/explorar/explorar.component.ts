import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { ProfissionalService } from '../../services/profissional.service';
import { Profissional } from '../../models';

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FooterComponent, NavbarComponent],
  templateUrl: './explorar.component.html'
})
export class ExplorarComponent implements OnInit {
  termoBusca: string = '';
  cidadeBusca: string = '';
  
  // Filtros
  precomax: number = 500;
  avaliacaoMinima: number = 0;
  modalidade: string = 'todas';
  
  categorias: { [key: string]: boolean } = {
    'Consultoria': false,
    'Educação': false,
    'Casa': false,
    'Saúde': false,
    'Espaços': false
  };

  tiposVendedor: { [key: string]: boolean } = {
    'Autônomo': true,
    'Empresa': true,
  };

  profissionais: Profissional[] = [];
  isLoading = true;
  errorMessage = '';
  
  private profissionalService = inject(ProfissionalService);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);

  get profissionaisFiltrados() {
    return this.profissionais.filter(p => {
      // 1. Busca textual
      const normalizar = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const termo = normalizar(this.termoBusca);
      const bateTermo = !termo || normalizar(p.nome || '').includes(termo) || normalizar(p.especialidade || '').includes(termo);
      
      // 2. Preço Máximo
      const precoMedio = p.preco_medio || 0;
      const batePreco = precoMedio <= this.precomax;

      // 3. Avaliação
      const rating = p.rating || 0;
      const bateAvaliacao = rating >= this.avaliacaoMinima;

      // 4. Modalidade
      const modalidades = p.modalidades || [];
      const bateModalidade = this.modalidade === 'todas' || modalidades.includes(this.modalidade);

      // 5. Categorias (se nenhuma selecionada, ignora filtro de categoria)
      const catsAtivas = Object.keys(this.categorias).filter(k => this.categorias[k]);
      const bateCategoria = catsAtivas.length === 0 || catsAtivas.includes(p.categoria || '');

      // 6. Vendedor
      const tipoVendedor = p.tipo_vendedor || 'AUTONOMO';
      const vendedorDisplay = tipoVendedor === 'AUTONOMO' ? 'Autônomo' : 'Empresa';
      const bateVendedor = this.tiposVendedor[vendedorDisplay];

      return bateTermo && batePreco && bateAvaliacao && bateModalidade && bateCategoria && bateVendedor;
    });
  }

  onFilterChange() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setAvaliacao(val: number) {
    this.avaliacaoMinima = this.avaliacaoMinima === val ? 0 : val;
    this.onFilterChange();
  }

  setModalidade(val: string) {
    this.modalidade = this.modalidade === val ? 'todas' : val;
    this.onFilterChange();
  }

  private route = inject(ActivatedRoute);
  private router = inject(Router);

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

  ngOnInit() {
    this.carregarProfissionais();
    this.route.queryParams.subscribe(params => {
      if (params['q']) this.termoBusca = params['q'];
      if (params['local']) this.cidadeBusca = params['local'];
    });
  }

  carregarProfissionais() {
    this.isLoading = true;
    this.errorMessage = '';
    const params = {
      q: this.termoBusca || undefined,
      cidade: this.cidadeBusca || undefined
    };
    this.profissionalService.listar(params).subscribe({
      next: (response) => {
        this.profissionais = response || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar profissionais:', err);
        this.errorMessage = 'Erro ao carregar profissionais. Tente novamente.';
        this.profissionais = [];
        this.isLoading = false;
      }
    });
  }
}
