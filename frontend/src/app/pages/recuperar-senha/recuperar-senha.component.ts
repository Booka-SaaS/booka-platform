import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.css'
})
export class RecuperarSenhaComponent {
  email = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  private authService = inject(AuthService);

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.email) {
      this.errorMessage = 'Informe seu e-mail.';
      return;
    }

    this.isLoading = true;
    this.authService.solicitarRecuperacaoSenha(this.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Se o e-mail estiver cadastrado, enviaremos as instrucoes.';
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao solicitar recuperacao de senha:', err);
        this.errorMessage = err?.error?.message || 'Nao foi possivel solicitar a recuperacao. Tente novamente.';
      },
    });
  }
}
