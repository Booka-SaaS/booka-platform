import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="h-20 w-full z-[100] bg-white shadow-sm border-b border-slate-200/60 shrink-0 fixed top-0 left-0">
        <nav class="flex justify-between items-center px-8 h-full max-w-7xl mx-auto w-full font-['Inter'] antialiased tracking-tight">
            <!-- Left: Logo -->
            <a routerLink="/" class="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
                <svg class="w-8 h-8" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <rect fill="#004ac6" height="64" rx="18" width="64"></rect>
                    <g transform="translate(8, 8)">
                        <path clip-rule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="#FFFFFF" fill-rule="evenodd"></path>
                    </g>
                </svg>
                <span class="text-2xl font-black tracking-tighter text-[#004ac6]">Booka</span>
            </a>
            
            <!-- Middle: Links -->
            <div class="hidden md:flex items-center gap-8">
                <a [routerLink]="['/explorar']" routerLinkActive="text-[#004ac6] font-bold border-b-[#004ac6]" [routerLinkActiveOptions]="{exact: true}" class="text-slate-600 hover:text-[#004ac6] transition-all pb-1 border-b-2 border-transparent">Explorar</a>
                <ng-container *ngIf="isLoggedIn && isProfissional">
                    <a [routerLink]="['/dashboard']" routerLinkActive="text-[#004ac6] font-bold border-b-[#004ac6]" class="text-slate-600 hover:text-[#004ac6] transition-all pb-1 border-b-2 border-transparent">Meu Painel</a>
                    <a [routerLink]="['/agenda']" routerLinkActive="text-[#004ac6] font-bold border-b-[#004ac6]" class="text-slate-600 hover:text-[#004ac6] transition-all pb-1 border-b-2 border-transparent">Minha Agenda</a>
                </ng-container>
                <a *ngIf="isLoggedIn && !isProfissional" [routerLink]="['/meus-agendamentos']" routerLinkActive="text-[#004ac6] font-bold border-b-[#004ac6]" class="text-slate-600 hover:text-[#004ac6] transition-all pb-1 border-b-2 border-transparent">Minhas Reservas</a>
                <a *ngIf="!isLoggedIn" [routerLink]="['/cadastro']" class="text-slate-600 hover:text-[#004ac6] transition-all pb-1 border-b-2 border-transparent">Cadastre seu Negócio</a>
            </div>

            <!-- Right: Actions/Profile -->
            <div class="flex items-center gap-4">
                <ng-container *ngIf="!isLoggedIn">
                    <button [routerLink]="['/login']" class="text-slate-600 font-medium px-4 py-2 hover:text-[#004ac6] transition-colors scale-95 transition-all w-none border-none bg-transparent">Entrar</button>
                    <button [routerLink]="['/cadastro']" class="bg-[#004ac6] text-white font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-all shadow-md">Cadastrar</button>
                </ng-container>
                
                <ng-container *ngIf="isLoggedIn">
                    <div class="relative group">
                        <button class="bg-slate-100 text-slate-700 font-bold px-6 py-2.5 rounded-full hover:bg-slate-200 transition-all shadow-sm flex items-center gap-2">
                            <span class="material-symbols-outlined text-[20px]">person</span> Meu Perfil
                        </button>
                        
                        <!-- Dropdown -->
                        <div class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[110] transform origin-top-right group-hover:translate-y-1">
                            <div class="p-2 space-y-1 flex flex-col">
                                <a [routerLink]="isProfissional ? ['/dashboard'] : ['/meus-agendamentos']" class="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#004ac6] rounded-lg transition-colors cursor-pointer">
                                    <span class="material-symbols-outlined text-lg">{{ isProfissional ? 'dashboard' : 'calendar_today' }}</span>
                                    {{ isProfissional ? 'Painel de Controle' : 'Minhas Reservas' }}
                                </a>
                                <a [routerLink]="isProfissional ? ['/configuracoes'] : ['/perfil']" class="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#004ac6] rounded-lg transition-colors cursor-pointer">
                                    <span class="material-symbols-outlined text-lg">settings</span>
                                    Configurações
                                </a>
                                <a class="flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#004ac6] rounded-lg transition-colors cursor-pointer">
                                    <div class="flex items-center gap-2">
                                        <span class="material-symbols-outlined text-lg">notifications</span>
                                        Notificações
                                    </div>
                                    <span class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
                                </a>
                                <div class="h-px bg-slate-100 my-1"></div>
                                <a (click)="logout()" class="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                    <span class="material-symbols-outlined text-lg">logout</span>
                                    Sair da Conta
                                </a>
                            </div>
                        </div>
                    </div>
                </ng-container>
            </div>
        </nav>
    </header>
  `
})
export class NavbarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isProfissional(): boolean {
    return this.authService.getRole() === 'PROFISSIONAL';
  }

  logout() {
    this.modalService.confirm(
      'Sair da Conta', 
      'Tem certeza que deseja sair?', 
      () => {
        this.authService.logout();
        this.router.navigate(['/']);
      },
      'Sair'
    );
  }
}
