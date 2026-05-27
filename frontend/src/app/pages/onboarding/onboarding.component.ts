import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { OnboardingService, FinalizeOnboardingRequest } from '../../services/onboarding.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})
export class OnboardingComponent {
  step: number = 1;
  isLoading = false;
  errorMessage = '';
  
  // Dados de Categoria e Gramática
  selectedCategory: string = '';
  categoryName: string = '';
  categoryArticle: string = 'sua'; // Guarda se é "seu" ou "sua"
  
  // Dados do Estabelecimento
  storeName: string = '';
  storePhone: string = '';
  storeAddress: string = '';
  storeCity: string = '';
  storeProfissao: string = '';
  storeModalidade: 'ONLINE' | 'PRESENCIAL' | 'HIBRIDO' = 'PRESENCIAL';
  storeTipoVendedor: 'AUTONOMO' | 'EMPRESA' = 'AUTONOMO';

  private router = inject(Router);
  private onboardingService = inject(OnboardingService);

  // Agora recebe o artigo correto para não errar o português!
  selectCategory(id: string, name: string, article: string) {
    this.selectedCategory = id;
    this.categoryName = name;
    this.categoryArticle = article;
  }

  nextStep() {
    if (this.step === 1 && this.selectedCategory) {
      this.step = 2;
    } else if (this.step === 2 && this.storeName && this.storeAddress && this.storePhone) {
      this.finalizarOnboarding();
    }
  }

  prevStep() {
    if (this.step === 2) {
      this.step = 1;
    }
  }

  private finalizarOnboarding() {
    this.isLoading = true;
    this.errorMessage = '';

    const dados: FinalizeOnboardingRequest = {
      nome: this.storeName,
      telefone: this.storePhone,
      endereco: this.storeAddress,
      cidade: this.storeCity || undefined,
      profissao: this.storeProfissao || this.categoryName || 'Profissional',
      categoriaPrincipal: this.selectedCategory,
      modalidadePrincipal: this.storeModalidade,
      tipoVendedor: this.storeTipoVendedor,
    };

    this.onboardingService.finalizar(dados).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao finalizar onboarding:', err);
        this.errorMessage = 'Erro ao salvar dados. Tente novamente.';
      }
    });
  }
}