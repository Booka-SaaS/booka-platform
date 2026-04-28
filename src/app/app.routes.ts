import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ServicosComponent } from './pages/servicos/servicos.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { BloqueiosComponent } from './pages/bloqueios/bloqueios.component';
import { ConfiguracoesComponent } from './pages/configuracoes/configuracoes.component';
import { DadosLojaComponent } from './pages/dados-loja/dados-loja.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { NotificacoesComponent } from './pages/notificacoes/notificacoes.component';
import { LoginComponent } from './pages/login/login.component'; // Import Novo
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';
import { AgendarComponent } from './pages/agendar/agendar.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { NovaSenhaComponent } from './pages/nova-senha/nova-senha.component';
import { HomeMarketplaceComponent } from './pages/home-marketplace/home-marketplace.component';
import { ExplorarComponent } from './pages/explorar/explorar.component';
import { MeusAgendamentosComponent } from './pages/meus-agendamentos/meus-agendamentos.component';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: '', component: HomeMarketplaceComponent }, // Rota Nova livre
  { path: 'explorar', component: ExplorarComponent }, // Rota de Resultados Livre
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent }, // Rota de Login livre
  { path: 'agendar/:idLoja', component: AgendarComponent }, // Rota pública
  { path: 'servicos', component: ServicosComponent, canActivate: [authGuard] },
  { path: 'agenda', component: AgendaComponent, canActivate: [authGuard] },
  { path: 'bloqueios', component: BloqueiosComponent, canActivate: [authGuard] },
  { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [authGuard] },
  { path: 'dados-loja', component: DadosLojaComponent, canActivate: [authGuard] },
  { path: 'clientes', component: ClientesComponent, canActivate: [authGuard] },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent }, // Rota Nova livre
  { path: 'nova-senha', component: NovaSenhaComponent }, // Rota Nova livre
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'meus-agendamentos', component: MeusAgendamentosComponent, canActivate: [authGuard] }, // Reativar quando o auth estiver pronto
  { path: 'cadastro', component: CadastroComponent }, // Rota Nova livre
  { path: 'onboarding', component: OnboardingComponent, canActivate: [authGuard] }, // ROTA FINAL privada
  { path: 'notificacoes', component: NotificacoesComponent, canActivate: [authGuard] }
];