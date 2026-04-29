import { Injectable, signal } from '@angular/core';

export interface ModalState {
  isOpen: boolean;
  type: 'alert' | 'confirm' | 'success';
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private _state = signal<ModalState>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancelar'
  });

  get state() {
    return this._state;
  }

  alert(title: string, message: string, confirmText: string = 'OK', onConfirm?: () => void) {
    this._state.set({
      isOpen: true,
      type: 'alert',
      title,
      message,
      confirmText,
      cancelText: '',
      onConfirm
    });
  }

  success(title: string, message: string, confirmText: string = 'OK', onConfirm?: () => void) {
    this._state.set({
      isOpen: true,
      type: 'success',
      title,
      message,
      confirmText,
      cancelText: '',
      onConfirm
    });
  }

  confirm(title: string, message: string, onConfirm: () => void, confirmText: string = 'Confirmar', cancelText: string = 'Cancelar', onCancel?: () => void) {
    this._state.set({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    });
  }

  close() {
    this._state.update(s => ({ ...s, isOpen: false }));
  }

  handleConfirm() {
    const currentState = this._state();
    if (currentState.onConfirm) {
      currentState.onConfirm();
    }
    this.close();
  }

  handleCancel() {
    const currentState = this._state();
    if (currentState.onCancel) {
      currentState.onCancel();
    }
    this.close();
  }
}
