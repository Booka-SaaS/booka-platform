import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProfissionalService } from '../../services/profissional.service';
import { AgendamentoService } from '../../services/agendamento.service';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalService } from '../../services/modal.service';
import { Profissional } from '../../models';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent],
  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css'
})
export class AgendarComponent implements OnInit {
  slug: string | null = null;
  profissional: Profissional | null = null;
  step = 1;
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  servicoSelecionado: any = null;
  dataSelecionada: Date | null = null;
  horarioSelecionado: string | null = null;

  clienteNome: string = '';
  clienteEmail: string = '';
  clienteWhatsapp: string = '';

  mesAtualNome: string = '';
  diasDoMes: (number | null)[] = [];
  dataAtual: Date = new Date();
  diaSelecionado: number | null = null;
  horariosDisponiveis: string[] = [];
  
  private profissionalService = inject(ProfissionalService);
  private agendamentoService = inject(AgendamentoService);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.gerarCalendario(this.dataAtual);
    this.carregarProfissional();
  }

  carregarProfissional() {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug');
      if (this.slug) {
        this.isLoading = true;
        this.profissionalService.obterPorSlug(this.slug).subscribe({
          next: (response) => {
            this.profissional = response;
            const servicos = this.profissional.servicos ?? [];
            if (servicos.length > 0) {
              this.servicoSelecionado = servicos[0];
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Erro ao carregar profissional:', err);
            this.errorMessage = 'Profissional não encontrado.';
            this.isLoading = false;
          }
        });
      }
    });
  }

  gerarCalendario(data: Date) {
    const ano = data.getFullYear();
    const mes = data.getMonth();
    
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    this.mesAtualNome = `${nomesMeses[mes]} ${ano}`;

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    this.diasDoMes = Array(primeiroDia).fill(null);
    for (let i = 1; i <= ultimoDia; i++) {
      this.diasDoMes.push(i);
    }
  }

  mudarMes(delta: number) {
     this.dataAtual.setMonth(this.dataAtual.getMonth() + delta);
     this.gerarCalendario(this.dataAtual);
     this.diaSelecionado = null;
     this.dataSelecionada = null;
     this.horarioSelecionado = null;
     this.horariosDisponiveis = [];
  }



  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isProfissional(): boolean {
    return this.authService.getRole() === 'PROFISSIONAL';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  selecionarServico(servico: any) {
    this.servicoSelecionado = servico;
  }

  selecionarData(dia: number) {
    this.diaSelecionado = dia;
    this.dataSelecionada = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth(), dia);
    this.horarioSelecionado = null;
    
    // Buscar horários disponíveis da API
    if (this.slug && this.dataSelecionada) {
      const dataFormatada = this.dataSelecionada.toISOString().split('T')[0];
      this.profissionalService.obterDisponibilidade(this.slug, dataFormatada).subscribe({
        next: (response) => {
          this.horariosDisponiveis = response.horarios || [];
        },
        error: (err) => {
          console.error('Erro ao carregar horários:', err);
          this.horariosDisponiveis = [];
        }
      });
    }
  }

  selecionarHorario(hora: string) {
    this.horarioSelecionado = hora;
  }

  finalizarAgendamento() {
    if (!this.servicoSelecionado || !this.dataSelecionada || !this.horarioSelecionado) {
      this.modalService.alert("Atenção", "Selecione um serviço, uma data e um horário para continuar.");
      return;
    }

    if (!this.clienteNome || !this.clienteEmail || !this.clienteWhatsapp) {
      this.modalService.alert("Atenção", "Preencha seus dados (nome, email e WhatsApp) para continuar.");
      return;
    }

    this.isSaving = true;
    const dataFormatada = this.dataSelecionada.toISOString().split('T')[0];
    
    const dados = {
      lojaId: this.profissional!.id,
      servicoId: this.servicoSelecionado.id,
      inicio: `${dataFormatada}T${this.horarioSelecionado}:00.000Z`,
      cliente: {
        nome: this.clienteNome,
        email: this.clienteEmail,
        telefone: this.clienteWhatsapp
      }
    };

    this.agendamentoService.criarPublico(dados).subscribe({
      next: () => {
        this.isSaving = false;
        const msg = `Seu agendamento foi registrado com sucesso!<br><br>Enviamos uma confirmação para seu <b>e-mail</b> e para o <b>WhatsApp</b> cadastrado.`;
        this.modalService.success('Agendamento Confirmado!', msg, 'Explorar Mais', () => {
          this.router.navigate(['/explorar']);
        });
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Erro ao criar agendamento:', err);
        this.modalService.alert('Erro', 'Erro ao confirmar agendamento. Tente novamente.');
      }
    });
  }
}
