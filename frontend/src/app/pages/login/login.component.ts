import { Component, NgZone, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
    this.renderGoogleButton();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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
        const role = meResponse.user.role;
        
        if (role === 'PROFISSIONAL') {
          // Verificar se onboarding foi concluído
          if (meResponse.loja && !meResponse.loja.onboardingConcluido) {
            this.router.navigate(['/onboarding']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.router.navigate(['/explorar']);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Erro ao fazer login:', err);
        this.errorMessage = 'Email ou senha incorretos. Tente novamente.';
      }
    });
  }

  private initializeGoogleLogin() {
    if (!environment.googleClientId || typeof google === 'undefined') {
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: { credential?: string }) => this.handleGoogleLogin(response),
    });
  }

  private renderGoogleButton(attempt = 0) {
    const container = document.getElementById('google-btn-container');

    if (!environment.googleClientId || typeof google === 'undefined') {
      if (attempt < 6) {
        setTimeout(() => this.renderGoogleButton(attempt + 1), 250);
      }
      return;
    }

    if (!container) {
      return;
    }

    this.initializeGoogleLogin();
    google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width: container.offsetWidth > 0 ? container.offsetWidth : 200,
    });
  }

  private handleGoogleLogin(response: { credential?: string }) {
    this.errorMessage = '';

    if (!response.credential) {
      this.errorMessage = 'Não foi possível autenticar com Google.';
      return;
    }

    this.isLoading = true;
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
          console.error('Erro ao fazer login com Google:', err);
          this.errorMessage = 'Não foi possível autenticar com Google. Tente novamente.';
        });
      }
    });
  }

  private redirectAfterLogin(meResponse: { user: { role: string }; loja: { onboardingConcluido: boolean } | null }) {
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
