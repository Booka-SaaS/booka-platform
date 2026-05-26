import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { NovaSenhaComponent } from './nova-senha.component';

describe('NovaSenhaComponent', () => {
  let component: NovaSenhaComponent;
  let fixture: ComponentFixture<NovaSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaSenhaComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovaSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
