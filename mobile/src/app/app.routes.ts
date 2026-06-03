import { Routes } from '@angular/router';
import { TabsLayoutComponent } from './components/tabs-layout/tabs-layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // ─── Área Pública (sem tab bar) ───────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-marketplace/home-marketplace.component').then(m => m.HomeMarketplaceComponent)
  },
  {
    path: 'explorar',
    loadComponent: () =>
      import('./pages/explorar/explorar.component').then(m => m.ExplorarComponent)
  },
  {
    path: 'agendar/:id',
    loadComponent: () =>
      import('./pages/agendar/agendar.component').then(m => m.AgendarComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./pages/cadastro/cadastro.component').then(m => m.CadastroComponent)
  },
  {
    path: 'recuperar-senha',
    loadComponent: () =>
      import('./pages/recuperar-senha/recuperar-senha.component').then(m => m.RecuperarSenhaComponent)
  },
  {
    path: 'nova-senha',
    loadComponent: () =>
      import('./pages/nova-senha/nova-senha.component').then(m => m.NovaSenhaComponent)
  },
  {
    path: 'onboarding',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/onboarding/onboarding.component').then(m => m.OnboardingComponent)
  },

  // ─── Área Privada com Tab Bar ─────────────────────────────────────────────
  {
    path: 'painel',
    component: TabsLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'agenda',
        loadComponent: () =>
          import('./pages/agenda/agenda.component').then(m => m.AgendaComponent)
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./pages/clientes/clientes.component').then(m => m.ClientesComponent)
      },
      {
        path: 'servicos',
        loadComponent: () =>
          import('./pages/servicos/servicos.component').then(m => m.ServicosComponent)
      },
      {
        path: 'configuracoes',
        loadComponent: () =>
          import('./pages/configuracoes/configuracoes.component').then(m => m.ConfiguracoesComponent)
      },
      {
        path: 'dados-loja',
        loadComponent: () =>
          import('./pages/dados-loja/dados-loja.component').then(m => m.DadosLojaComponent)
      },
      {
        path: 'bloqueios',
        loadComponent: () =>
          import('./pages/bloqueios/bloqueios.component').then(m => m.BloqueiosComponent)
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./pages/perfil/perfil.component').then(m => m.PerfilComponent)
      },
      {
        path: 'notificacoes',
        loadComponent: () =>
          import('./pages/notificacoes/notificacoes.component').then(m => m.NotificacoesComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Redirects de compatibilidade (rotas antigas sem /painel/)
  { path: 'dashboard', redirectTo: '/painel/dashboard', pathMatch: 'full' },
  { path: 'agenda', redirectTo: '/painel/agenda', pathMatch: 'full' },
  { path: 'clientes', redirectTo: '/painel/clientes', pathMatch: 'full' },
  { path: 'servicos', redirectTo: '/painel/servicos', pathMatch: 'full' },
  { path: 'configuracoes', redirectTo: '/painel/configuracoes', pathMatch: 'full' },
  { path: 'perfil', redirectTo: '/painel/perfil', pathMatch: 'full' },
  { path: 'notificacoes', redirectTo: '/painel/notificacoes', pathMatch: 'full' },
  { path: 'dados-loja', redirectTo: '/painel/dados-loja', pathMatch: 'full' },
  { path: 'bloqueios', redirectTo: '/painel/bloqueios', pathMatch: 'full' },

  { path: '**', redirectTo: '/' }
];