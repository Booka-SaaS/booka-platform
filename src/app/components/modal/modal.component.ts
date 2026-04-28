import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="modalService.state().isOpen" class="fixed inset-0 z-[100] flex items-center justify-center font-sans antialiased">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        (click)="handleBackdropClick()">
      </div>

      <!-- Modal Content -->
      <div 
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div class="p-6">
          <!-- Icon depending on type -->
          <div class="mb-4 flex justify-center">
            <div *ngIf="modalService.state().type === 'alert'" class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <span class="material-symbols-outlined text-2xl">info</span>
            </div>
            <div *ngIf="modalService.state().type === 'confirm'" class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <span class="material-symbols-outlined text-2xl">help</span>
            </div>
          </div>

          <h3 class="text-xl font-black text-center text-slate-900 mb-2">{{ modalService.state().title }}</h3>
          <p class="text-sm text-center text-slate-500 font-medium">{{ modalService.state().message }}</p>
        </div>

        <div class="bg-slate-50 p-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <button 
            *ngIf="modalService.state().type === 'confirm'"
            (click)="modalService.handleCancel()"
            class="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            {{ modalService.state().cancelText }}
          </button>
          
          <button 
            (click)="modalService.handleConfirm()"
            [ngClass]="modalService.state().type === 'alert' ? 'w-full bg-[#004ac6] hover:bg-blue-700' : 'bg-[#004ac6] hover:bg-blue-700'"
            class="px-5 py-2.5 rounded-xl font-bold text-white shadow-md transition-all hover:-translate-y-0.5">
            {{ modalService.state().confirmText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  modalService = inject(ModalService);

  handleBackdropClick() {
    if (this.modalService.state().type === 'alert') {
      this.modalService.handleConfirm();
    } else {
      this.modalService.handleCancel();
    }
  }
}
