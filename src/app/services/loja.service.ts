import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Loja } from '../models';
import { Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LojaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/loja`;

  buscarDados(): Observable<Loja> {
    return this.http.get<Loja>(this.apiUrl);
  }

  atualizarDados(loja: Partial<Loja>): Observable<Loja> {
    return this.http.put<Loja>(this.apiUrl, loja);
  }

  buscarProfissionalPorId(id: string | number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/profissionais/${id}`).pipe(
      timeout(300),
      catchError(error => {
        console.warn('API de profissionais abstrata não está pronta ou offline. Usando fallback estático.');
        
        // Mock data
        const profissionais = [
          { id: 1, nome: 'João Silva', profissao: 'Consultor de TI', preco: 80, rating: 4.9, categoria: 'Consultoria', modalidade: 'Online', vendedor: 'Autônomo', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlmfgo6Kxn_z7ZBiZT9Uto-k4k3Bcl-sC1AqA11Vk2PtEXhgebXNzPFDh-q_EgrLXT7GTDah5udAwMFct_ZRi6beBAB4tfcfGfGp7s-4tpkxZVzOY-BtNwWaPwhaz6wCNowAWlzV3xWJOYZ6-zKlFicEAYJvby83AkBqkGBSOCEBspaif1uv_W1ZutG05Wr5AO3Mj1Q6H0_8Slh2QUPGSWtcYQb3nxBlsJSmyJQHrU3VigeNrcu6Db8zI27Q1EX8X6xK4pXudIfhI' },
          { id: 2, nome: 'Maria Oliveira', profissao: 'Professora de Inglês', preco: 120, rating: 5.0, categoria: 'Educação', modalidade: 'Online', vendedor: 'Autônomo', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw5qUrR6xy_y0L6qNbCdcNSP844riBNyfDx_n3EXjAeWOj2jL30UUZnG4j9L8JMEjjg41TOvcqybo3ibQgF5MS618nSNyMX8b7Ah3-_UZh6ndnMmI_VjUepvsQTJzH2lBZk2q0RVijJDdHmnAsqUb80SlKRUBhwh14qisDdB8e_SqtSPfc1sL86d8avzMFnYPJAcaZR4Ze_kA9oGQQ2IED73o_Ncvgb62qyEqtCnIfO6eggbnO4hSCSSV5gDb0Lb2EuXEPaTQjPco' },
          { id: 3, nome: 'Ricardo Alves', profissao: 'Eletricista Residencial', preco: 95, rating: 4.8, categoria: 'Casa', modalidade: 'Presencial', vendedor: 'Empresa', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZWy57Dkx_S9Y_fnfixVeaBiBWw9Zo745BZrmFkYW2xhHTrk7K1MMcLJ7JVyMHOK3GvicXf4EuBNMidxRzFo27kqbiS-dIrJVn0IYQUo1iHXqXEzqPREe_kC58D5iNv6fGobGGsMb9Qz5JDjVh7hw4D0CtP6CouRU-4_vkJCxqMTBWITGn4i7Ceg-x6vco2RWl4Q1iJRfelHO3MYLbJE7fD1z-rEVza5Q6SDUKu50lbCU459IBrnVb_T_sGptLzyNBK8PyCRcf2OE' },
          { id: 4, nome: 'Clínica Bem-Estar', profissao: 'Dermatologista Estética', preco: 250, rating: 4.5, categoria: 'Saúde', modalidade: 'Presencial', vendedor: 'Empresa', img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80' },
          { id: 5, nome: 'Hub Acadêmico de Inovação', profissao: 'Espaço Coworking / Hub', preco: 150, rating: 4.9, categoria: 'Espaços', modalidade: 'Presencial', vendedor: 'Empresa', img: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80' }
        ];
        
        let prof = profissionais.find(p => p.id.toString() === id.toString());
        
        if (!prof) {
            prof = profissionais[0]; // fallback to first
        }

        return of({
          id: prof.id,
          nome: prof.nome,
          img: prof.img,
          profissao: prof.profissao,
          rating: prof.rating,
          preco: prof.preco,
          servicos: [
            { id: 1, nome: 'Serviço Padrão', preco: prof.preco, duracao: 60 },
            { id: 2, nome: 'Serviço Premium', preco: prof.preco * 1.5, duracao: 90 }
          ]
        });
      })
    );
  }
}
