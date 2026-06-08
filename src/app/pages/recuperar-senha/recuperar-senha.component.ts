import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.css'
})
export class RecuperarSenhaComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  email = '';
  loading = false;
  enviado = false;

  onSubmit() {
    if (!this.email.trim()) return;
    this.loading = true;
    this.authService.recuperarSenha(this.email.trim()).subscribe({
      next: () => {
        this.enviado = true;
        this.loading = false;
      },
      error: () => {
        // Por segurança, mostramos a mesma mensagem independente do resultado
        this.enviado = true;
        this.loading = false;
      }
    });
  }
}
