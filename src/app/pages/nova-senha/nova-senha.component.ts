import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-nova-senha',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './nova-senha.component.html',
  styleUrl: './nova-senha.component.css'
})
export class NovaSenhaComponent implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  password = '';
  confirmPassword = '';
  showPassword = false;
  showRequirements = false;
  loading = false;
  tokenInvalido = false;

  private token = '';

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.tokenInvalido = true;
    }
  }

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

  get formValido() {
    return this.hasMinLength && this.hasNumber && this.hasSpecialChar && this.passwordsMatch;
  }

  onSubmit() {
    if (!this.formValido || this.loading || !this.token) return;
    this.loading = true;
    this.authService.novaSenha(this.token, this.password).subscribe({
      next: () => {
        this.toastService.success('Senha redefinida com sucesso! Faça login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Token inválido ou expirado. Solicite um novo link.';
        this.toastService.error(msg);
        this.loading = false;
      }
    });
  }
}
