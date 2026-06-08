import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { ViaCepService } from '../../services/viacep.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  showRequirements = false;
  role: 'CLIENTE' | 'PROFISSIONAL' = 'CLIENTE';

  cep = '';
  logradouro = '';
  numero = '';
  bairro = '';
  complemento = '';
  cidade = '';
  estado = '';
  isBuscandoCep = false;
  cepNaoEncontrado = false;
  cepPreenchido = false;

  private authService = inject(AuthService);
  private modalService = inject(ModalService);
  private viaCepService = inject(ViaCepService);
  private router = inject(Router);

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onPasswordFocus() {
    this.showRequirements = true;
  }

  onPasswordBlur() {
    setTimeout(() => {
      this.showRequirements = false;
    }, 150);
  }

  get hasMinLength() {
    return this.password.length >= 8;
  }

  get hasNumber() {
    return /[0-9]/.test(this.password);
  }

  get hasUpperCase() {
    return /[A-Z]/.test(this.password);
  }

  get hasLowerCase() {
    return /[a-z]/.test(this.password);
  }

  get hasSpecialChar() {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
  }

  get passwordsMatch() {
    return this.password === this.confirmPassword && this.password.length > 0;
  }

  get enderecoValido() {
    if (this.role !== 'PROFISSIONAL') {
      return true;
    }

    return (
      this.cep.length === 8 &&
      this.logradouro.trim().length >= 2 &&
      this.numero.trim().length >= 1 &&
      this.bairro.trim().length >= 2 &&
      this.cidade.trim().length >= 2 &&
      this.estado.trim().length === 2
    );
  }

  onCepInput(valor: string) {
    const cepLimpo = valor.replace(/\D/g, '');
    this.cep = cepLimpo;
    this.cepNaoEncontrado = false;

    if (cepLimpo.length === 8) {
      this.buscarCep(cepLimpo);
    } else {
      this.cepPreenchido = false;
    }
  }

  private buscarCep(cep: string) {
    this.isBuscandoCep = true;
    this.cepPreenchido = false;

    this.viaCepService.buscarPorCep(cep).subscribe({
      next: (endereco) => {
        this.logradouro = endereco.logradouro;
        this.bairro = endereco.bairro;
        this.cidade = endereco.cidade;
        this.estado = endereco.estado;
        this.isBuscandoCep = false;
        this.cepPreenchido = true;
      },
      error: () => {
        this.isBuscandoCep = false;
        this.cepNaoEncontrado = true;
        this.cepPreenchido = false;
      },
    });
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Preencha os campos obrigatorios!';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'E-mail invalido. Use um formato valido (ex: user@domain.com)';
      return;
    }

    if (!this.passwordsMatch || !this.hasMinLength) {
      this.errorMessage = 'Verifique os requisitos da senha!';
      return;
    }

    if (!this.hasNumber || !this.hasUpperCase || !this.hasLowerCase) {
      this.errorMessage = 'A senha nao atende os requisitos de seguranca';
      return;
    }

    if (!this.enderecoValido) {
      this.errorMessage = 'Preencha o endereco do estabelecimento antes de continuar.';
      return;
    }

    const endereco =
      this.role === 'PROFISSIONAL'
        ? {
            cep: this.cep,
            logradouro: this.logradouro,
            numero: this.numero,
            bairro: this.bairro,
            complemento: this.complemento || undefined,
            cidade: this.cidade,
            estado: this.estado.toUpperCase(),
          }
        : undefined;

    this.isLoading = true;
    this.authService.register(this.fullName, this.email, this.password, this.role, endereco).subscribe({
      next: () => {
        this.isLoading = false;
        if (this.role === 'PROFISSIONAL') {
          this.router.navigate(['/onboarding']);
        } else {
          this.router.navigate(['/explorar']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao realizar cadastro:', err);
        if (err?.status === 409) {
          this.modalService.alert(
            'E-mail ja cadastrado',
            'Ja existe uma conta usando este e-mail. Entre com sua senha ou use outro endereco para criar uma nova conta.',
            'Entendi'
          );
          return;
        }

        this.errorMessage = 'Erro ao realizar cadastro. Verifique os dados e tente novamente.';
      }
    });
  }

  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
