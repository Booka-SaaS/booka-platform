import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Serviço para upload de imagem de perfil.
 */
@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/upload`;

  /**
   * Upload de avatar do usuário.
   * @param file Arquivo de imagem (JPEG, PNG, WEBP — máx 10MB)
   */
  uploadAvatar(file: File): Observable<{ imagemUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ imagemUrl: string }>(`${this.apiUrl}/avatar`, formData);
  }
}
