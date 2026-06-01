import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nova-senha',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './nova-senha.component.html',
  styleUrl: './nova-senha.component.css'
})
export class NovaSenhaComponent {
  password = '';
  confirmPassword = '';
  showPassword = false;
  showRequirements = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
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

  get hasSpecialChar() {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
  }

  get passwordsMatch() {
    return this.password === this.confirmPassword && this.password.length > 0;
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.errorMessage = 'Link de redefinicao invalido ou expirado.';
      return;
    }

    if (!this.hasMinLength || !this.hasNumber || !this.hasSpecialChar || !this.passwordsMatch) {
      this.errorMessage = 'Verifique os requisitos da senha.';
      return;
    }

    this.isLoading = true;
    this.authService.redefinirSenha(token, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Senha atualizada com sucesso.';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao redefinir senha:', err);
        this.errorMessage = err?.error?.message || 'Nao foi possivel redefinir a senha. Tente novamente.';
      },
    });
  }
}
