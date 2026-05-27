import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AgendamentoService } from '../../services/agendamento.service';
import { AuthService } from '../../services/auth.service';
import { Agendamento } from '../../models';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
    selector: 'app-meus-agendamentos',
    standalone: true,
    imports: [CommonModule, RouterModule, NavbarComponent],
    templateUrl: './meus-agendamentos.component.html'
})
export class MeusAgendamentosComponent implements OnInit {
    private agendamentoService = inject(AgendamentoService);
    private authService = inject(AuthService);
    private router = inject(Router);

    agendamentos: Agendamento[] = [];
    loading = true;
    error = false;
    cancelandoId: string | number | null = null;

    ngOnInit() {
        this.carregarAgendamentos();
    }

    carregarAgendamentos() {
        this.loading = true;
        this.error = false;
        this.agendamentoService.getMeusAgendamentos().subscribe({
            next: (res) => {
                this.agendamentos = res;
                this.loading = false;
            },
            error: (err) => {
                console.error('Erro ao carregar agendamentos:', err);
                this.error = true;
                this.loading = false;
            }
        });
    }

    isFuturo(data: string | Date | undefined): boolean {
        if (!data) {
            return false;
        }

        const dataAgendamento = new Date(data);
        const agora = new Date();
        return dataAgendamento > agora;
    }

    cancelar(id: string | number | undefined) {
        if (id === undefined || id === null) return;

        const agendamentoId = String(id);

        if (confirm('Deseja realmente cancelar este agendamento?')) {
            this.cancelandoId = id;
            this.agendamentoService.cancelar(agendamentoId).subscribe({
                next: () => {
                    const item = this.agendamentos.find(a => String(a.id) === agendamentoId);
                    if (item) item.status = 'CANCELADO';
                    this.cancelandoId = null;
                },
                error: (err) => {
                    console.error('Erro ao cancelar:', err);
                    alert('Não foi possível cancelar o agendamento no momento.');
                    this.cancelandoId = null;
                }
            });
        }
    }
}