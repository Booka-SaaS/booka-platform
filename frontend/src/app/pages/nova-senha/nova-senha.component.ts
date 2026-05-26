import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

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
}