import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FooterComponent],
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
    'Saúde': false
  };

  tiposVendedor: { [key: string]: boolean } = {
    'Autônomo': true,
    'Empresa': true,
  };

  // Dummy data test list 
  profissionais = [
    { id: 1, nome: 'João Silva', profissao: 'Consultor de TI', preco: 80, rating: 4.9, categoria: 'Consultoria', modalidade: 'Online', vendedor: 'Autônomo', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlmfgo6Kxn_z7ZBiZT9Uto-k4k3Bcl-sC1AqA11Vk2PtEXhgebXNzPFDh-q_EgrLXT7GTDah5udAwMFct_ZRi6beBAB4tfcfGfGp7s-4tpkxZVzOY-BtNwWaPwhaz6wCNowAWlzV3xWJOYZ6-zKlFicEAYJvby83AkBqkGBSOCEBspaif1uv_W1ZutG05Wr5AO3Mj1Q6H0_8Slh2QUPGSWtcYQb3nxBlsJSmyJQHrU3VigeNrcu6Db8zI27Q1EX8X6xK4pXudIfhI' },
    { id: 2, nome: 'Maria Oliveira', profissao: 'Professora de Inglês', preco: 120, rating: 5.0, categoria: 'Educação', modalidade: 'Online', vendedor: 'Autônomo', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw5qUrR6xy_y0L6qNbCdcNSP844riBNyfDx_n3EXjAeWOj2jL30UUZnG4j9L8JMEjjg41TOvcqybo3ibQgF5MS618nSNyMX8b7Ah3-_UZh6ndnMmI_VjUepvsQTJzH2lBZk2q0RVijJDdHmnAsqUb80SlKRUBhwh14qisDdB8e_SqtSPfc1sL86d8avzMFnYPJAcaZR4Ze_kA9oGQQ2IED73o_Ncvgb62qyEqtCnIfO6eggbnO4hSCSSV5gDb0Lb2EuXEPaTQjPco' },
    { id: 3, nome: 'Ricardo Alves', profissao: 'Eletricista Residencial', preco: 95, rating: 4.8, categoria: 'Casa', modalidade: 'Presencial', vendedor: 'Empresa', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZWy57Dkx_S9Y_fnfixVeaBiBWw9Zo745BZrmFkYW2xhHTrk7K1MMcLJ7JVyMHOK3GvicXf4EuBNMidxRzFo27kqbiS-dIrJVn0IYQUo1iHXqXEzqPREe_kC58D5iNv6fGobGGsMb9Qz5JDjVh7hw4D0CtP6CouRU-4_vkJCxqMTBWITGn4i7Ceg-x6vco2RWl4Q1iJRfelHO3MYLbJE7fD1z-rEVza5Q6SDUKu50lbCU459IBrnVb_T_sGptLzyNBK8PyCRcf2OE' },
    { id: 4, nome: 'Clínica Bem-Estar', profissao: 'Dermatologista Estética', preco: 250, rating: 4.5, categoria: 'Saúde', modalidade: 'Presencial', vendedor: 'Empresa', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw5qUrR6xy_y0L6qNbCdcNSP844riBNyfDx_n3EXjAeWOj2jL30UUZnG4j9L8JMEjjg41TOvcqybo3ibQgF5MS618nSNyMX8b7Ah3-_UZh6ndnMmI_VjUepvsQTJzH2lBZk2q0RVijJDdHmnAsqUb80SlKRUBhwh14qisDdB8e_SqtSPfc1sL86d8avzMFnYPJAcaZR4Ze_kA9oGQQ2IED73o_Ncvgb62qyEqtCnIfO6eggbnO4hSCSSV5gDb0Lb2EuXEPaTQjPco' }
  ];

  get profissionaisFiltrados() {
    return this.profissionais.filter(p => {
      // 1. Busca textual
      const termo = this.termoBusca.toLowerCase();
      const bateTermo = !termo || p.nome.toLowerCase().includes(termo) || p.profissao.toLowerCase().includes(termo);
      
      // 2. Preço Máximo
      const batePreco = p.preco <= this.precomax;

      // 3. Avaliação
      const bateAvaliacao = p.rating >= this.avaliacaoMinima;

      // 4. Modalidade
      const bateModalidade = this.modalidade === 'todas' || this.modalidade === p.modalidade;

      // 5. Categorias (se nenhuma selecionada, ignora filtro de categoria)
      const catsAtivas = Object.keys(this.categorias).filter(k => this.categorias[k]);
      const bateCategoria = catsAtivas.length === 0 || catsAtivas.includes(p.categoria);

      // 6. Vendedor
      const bateVendedor = this.tiposVendedor[p.vendedor];

      return bateTermo && batePreco && bateAvaliacao && bateModalidade && bateCategoria && bateVendedor;
    });
  }

  setAvaliacao(val: number) {
    this.avaliacaoMinima = this.avaliacaoMinima === val ? 0 : val;
  }

  setModalidade(val: string) {
    this.modalidade = this.modalidade === val ? 'todas' : val;
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) this.termoBusca = params['q'];
      if (params['local']) this.cidadeBusca = params['local'];
    });
  }
}
