import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})
export class OnboardingComponent {
  step: number = 1;
  
  // Dados de Categoria e Gramática
  selectedCategory: string = '';
  categoryName: string = '';
  categoryArticle: string = 'sua'; // Guarda se é "seu" ou "sua"
  
  // Dados do Estabelecimento
  storeName: string = '';
  storePhone: string = '';
  storeAddress: string = ''; // Novo campo de endereço!

  constructor(private router: Router) {}

  // Agora recebe o artigo correto para não errar o português!
  selectCategory(id: string, name: string, article: string) {
    this.selectedCategory = id;
    this.categoryName = name;
    this.categoryArticle = article;
  }

  nextStep() {
    if (this.step === 1 && this.selectedCategory) {
      this.step = 2;
    } else if (this.step === 2 && this.storeName && this.storeAddress) { // Exige nome e endereço
      console.log('Dados salvos:', {
        categoria: this.selectedCategory,
        nomeLoja: this.storeName,
        telefone: this.storePhone,
        endereco: this.storeAddress
      });
      // Navega para o painel após concluir
      this.router.navigate(['/']);
    }
  }

  prevStep() {
    if (this.step === 2) {
      this.step = 1;
    }
  }
}