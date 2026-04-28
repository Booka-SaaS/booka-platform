import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LojaService } from '../../services/loja.service';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent],
  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css'
})
export class AgendarComponent implements OnInit {
  idLoja: string | null = null;
  profissional: any = null;
  step = 1;

  servicoSelecionado: any = null;
  dataSelecionada: Date | null = null;
  horarioSelecionado: string | null = null;

  clienteNome: string = '';
  clienteWhatsapp: string = '';

  mesAtualNome: string = '';
  diasDoMes: (number | null)[] = [];
  dataAtual: Date = new Date();
  diaSelecionado: number | null = null;
  horariosDisponiveis: string[] = [];

  ngOnInit() {
    this.gerarCalendario(this.dataAtual);
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

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private lojaService: LojaService,
    private authService: AuthService,
    private modalService: ModalService
  ) {
    this.route.paramMap.subscribe(params => {
      this.idLoja = params.get('idLoja');
      if (this.idLoja) {
        this.lojaService.buscarProfissionalPorId(this.idLoja).subscribe(res => {
          this.profissional = res;
          if (this.profissional?.servicos?.length > 0) {
            this.servicoSelecionado = this.profissional.servicos[0];
          }
        });
      }
    });
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
    
    // Simula a busca de horários disponíveis para o dia escolhido na API
    this.horariosDisponiveis = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  }

  selecionarHorario(hora: string) {
    this.horarioSelecionado = hora;
  }

  finalizarAgendamento() {
    if (!this.servicoSelecionado || !this.dataSelecionada || !this.horarioSelecionado) {
      this.modalService.alert("Atenção", "Selecione um serviço, uma data e um horário para continuar.");
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/cadastro']);
    } else {
      this.modalService.alert('Sucesso!', 'Agendamento confirmado com sucesso!', 'Ver Agenda', () => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}
