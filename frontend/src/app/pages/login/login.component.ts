import { Component, NgZone, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { switchMap } from 'rxjs/operators';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.initializeGoogleLogin();
    setTimeout(() => this.renderGoogleButton(), 100);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private initializeGoogleLogin() {
    if (!environment.googleClientId || typeof google === 'undefined') return;

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleGoogleLogin(response),
    });
  }

  private renderGoogleButton() {
    const container = document.getElementById('google-btn-container');
    if (!environment.googleClientId || !container) return;

    if (typeof google === 'undefined') {
      setTimeout(() => this.renderGoogleButton(), 500);
      return;
    }

    google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width: container.offsetWidth > 0 ? container.offsetWidth : 240,
    });
  }

  handleGoogleLogin(response: any) {
    if (!response?.credential) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.authService.loginWithGoogle(response.credential).pipe(
      switchMap(() => this.authService.getMe())
    ).subscribe({
      next: (meResponse) => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.redirectAfterLogin(meResponse);
        });
      },
      error: (err: any) => {
        this.ngZone.run(() => {
          this.isLoading = false;
          console.error('Erro Google Login:', err);
          this.errorMessage = err?.error?.message || 'Falha na autenticacao com Google.';
        });
      }
    });
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos!';
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).pipe(
      switchMap(() => this.authService.getMe())
    ).subscribe({
      next: (meResponse) => {
        this.isLoading = false;
        this.redirectAfterLogin(meResponse);
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Erro ao fazer login:', err);
        this.errorMessage = 'Email ou senha incorretos. Tente novamente.';
      }
    });
  }

  private redirectAfterLogin(meResponse: any) {
    const role = meResponse.user.role;

    if (role === 'PROFISSIONAL') {
      if (meResponse.loja && !meResponse.loja.onboardingConcluido) {
        this.router.navigate(['/onboarding']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.router.navigate(['/explorar']);
    }
  }
}
