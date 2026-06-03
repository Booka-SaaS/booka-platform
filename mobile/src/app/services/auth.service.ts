import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Usuario, LojaContext } from '../models';
import { StorageService } from './storage.service';

export interface AuthResponse {
  token: string;
  user: { id: string; nome: string; email: string; role: string };
}

export interface MeResponse {
  user: Usuario & { imagemUrl: string | null };
  loja: LojaContext | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly apiUrl = environment.apiUrl;

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(switchMap(async res => {
        await this.persistAuth(res);
        return res;
      }));
  }

  register(nome: string, email: string, password: string, role: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, { nome, email, password, role })
      .pipe(switchMap(async res => {
        await this.persistAuth(res);
        return res;
      }));
  }

  async logout(): Promise<void> {
    await this.clearAuth();
  }

  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/auth/me`);
  }

  updateMe(dados: { nome?: string; email?: string }): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/auth/me`, dados);
  }

  updateSenha(senhaAtual: string, novaSenha: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/auth/senha`, { senhaAtual, novaSenha });
  }

  recuperarSenha(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/recuperar-senha`, { email });
  }

  novaSenha(token: string, novaSenha: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/nova-senha`, { token, novaSenha });
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.storage.getItem('token');
    return !!token;
  }

  async getRole(): Promise<string> {
    const role = await this.storage.getItem('role');
    return role || 'CLIENTE';
  }

  async getToken(): Promise<string | null> {
    return await this.storage.getItem('token');
  }

  private async persistAuth(res: AuthResponse): Promise<void> {
    await this.storage.setItem('token', res.token);
    await this.storage.setItem('role', res.user.role);
  }

  private async clearAuth(): Promise<void> {
    await this.storage.removeItem('token');
    await this.storage.removeItem('role');
  }
}
