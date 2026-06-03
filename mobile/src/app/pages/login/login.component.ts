import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, IonContent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    if (!this.email || !this.password) {
      alert('Por favor, preencha todos os campos!');
      return;
    }
    this.authService.login(this.email, this.password).subscribe({
      next: async () => {
        const role = await this.authService.getRole();
        if (role === 'PROFISSIONAL') {
          this.router.navigate(['/painel/dashboard']);
        } else {
          this.router.navigate(['/explorar']);
        }
      },
      error: (err) => {
        alert('Erro ao fazer login. Verifique suas credenciais.');
        console.error(err);
      }
    });
  }
}
