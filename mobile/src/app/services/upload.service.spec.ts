import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UploadService } from './upload.service';
import { environment } from '../../environments/environment';

describe('UploadService', () => {
  let service: UploadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UploadService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UploadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve fazer upload de avatar', () => {
    const fakeFile = new File([''], 'test.png', { type: 'image/png' });
    
    service.uploadAvatar(fakeFile).subscribe(res => {
      expect(res.imagemUrl).toBe('http://fakeurl.com/avatar.png');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/upload/avatar`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush({ imagemUrl: 'http://fakeurl.com/avatar.png' });
  });
});
