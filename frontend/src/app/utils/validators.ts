import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export class CustomValidators {
  // Validar email
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(control.value) ? null : { invalidEmail: true };
    };
  }

  // Validar força de senha
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value = control.value;
      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*-_=+]/.test(value);
      const isLengthValid = value.length >= 8;

      const isStrong = hasUppercase && hasLowercase && hasNumeric && hasSpecial && isLengthValid;

      return isStrong ? null : { weakPassword: true };
    };
  }

  // Validar comprimento máximo
  static maxLength(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return control.value.length <= max ? null : { maxLength: { max } };
    };
  }

  // Validar comprimento mínimo
  static minLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return control.value.length >= min ? null : { minLength: { min } };
    };
  }

  // Validar telefone brasileiro
  static brazilianPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const phoneRegex = /^\(?[1-9]{2}\)?\s?(?:9\d{4}-?\d{4}|\d{4}-?\d{4})$/;
      return phoneRegex.test(control.value.replace(/\s/g, '')) ? null : { invalidPhone: true };
    };
  }

  // Validar CPF (básico)
  static cpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      let cpf = control.value.replace(/\D/g, '');
      if (cpf.length !== 11) return { invalidCPF: true };

      // Verificação básica (sem cálculo de dígito verificador)
      if (/^(\d)\1{10}$/.test(cpf)) return { invalidCPF: true };

      return null;
    };
  }

  // Validar data (não pode ser no passado)
  static dateNotInPast(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selectedDate >= today ? null : { dateInPast: true };
    };
  }

  // Validar que a data fim é depois da data início
  static dateRangeValidator(beginDateField: string, endDateField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const beginDate = control.get(beginDateField)?.value;
      const endDate = control.get(endDateField)?.value;

      if (!beginDate || !endDate) return null;

      const begin = new Date(beginDate);
      const end = new Date(endDate);

      return begin < end ? null : { invalidDateRange: true };
    };
  }
}

// Mensagens de erro amigáveis
export const errorMessages: { [key: string]: (params?: any) => string } = {
  required: () => 'Este campo é obrigatório',
  invalidEmail: () => 'E-mail inválido',
  weakPassword: () => 'Senha fraca. Use maiúsculas, minúsculas, números e caracteres especiais',
  maxLength: (params) => `Máximo de ${params.max} caracteres permitido`,
  minLength: (params) => `Mínimo de ${params.min} caracteres requerido`,
  invalidPhone: () => 'Telefone inválido',
  invalidCPF: () => 'CPF inválido',
  dateInPast: () => 'A data não pode ser no passado',
  invalidDateRange: () => 'A data final deve ser maior que a data inicial',
  pattern: () => 'Formato inválido',
};

export function getErrorMessage(errorType: string, errorParams?: any): string {
  const messageFn = errorMessages[errorType];
  return messageFn ? messageFn(errorParams) : 'Erro de validação';
}
