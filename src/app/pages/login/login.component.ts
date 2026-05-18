import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.errorMessage = '';
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos!';
      return;
    }

    // Interceptar login de teste
    if (this.email === 'cliente@booka.com' && this.password === 'teste123') {
      this.loginTeste('CLIENTE');
      return;
    }
    if (this.email === 'profissional@booka.com' && this.password === 'teste123') {
      this.loginTeste('PROFISSIONAL');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        const role = this.authService.getRole();
        if (role === 'PROFISSIONAL') {
          this.router.navigate(['/dashboard']);
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

  loginTeste(tipo: 'CLIENTE' | 'PROFISSIONAL') {
    this.isLoading = true;
    this.authService.loginTeste(tipo);
    setTimeout(() => {
      this.isLoading = false;
      if (tipo === 'PROFISSIONAL') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/explorar']);
      }
    }, 500);
  }
}