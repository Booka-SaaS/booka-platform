import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, IonContent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showRequirements = false;
  role: string = 'CLIENTE';

  private authService = inject(AuthService);
  private router = inject(Router);

  togglePasswordVisibility() { this.showPassword = !this.showPassword; }
  onPasswordFocus() { this.showRequirements = true; }
  onPasswordBlur() { setTimeout(() => { this.showRequirements = false; }, 150); }

  get hasMinLength() { return this.password.length >= 8; }
  get hasNumber() { return /[0-9]/.test(this.password); }
  get hasSpecialChar() { return /[!@#$%^&*(),.?":{}|<>]/.test(this.password); }
  get passwordsMatch() { return this.password === this.confirmPassword && this.password.length > 0; }

  onSubmit() {
    if (!this.fullName || !this.email || !this.password) {
      alert('Preencha os campos obrigatórios!'); return;
    }
    if (!this.passwordsMatch || !this.hasMinLength) {
      alert('Verifique os requisitos da senha!'); return;
    }
    this.authService.register(this.fullName, this.email, this.password, this.role).subscribe({
      next: () => {
        if (this.role === 'PROFISSIONAL') { this.router.navigate(['/onboarding']); }
        else { this.router.navigate(['/explorar']); }
      },
      error: (err) => { alert('Erro ao realizar cadastro.'); console.error(err); }
    });
  }
}
