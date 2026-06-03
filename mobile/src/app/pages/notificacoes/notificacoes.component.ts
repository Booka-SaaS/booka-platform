import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline, calendarOutline, personAddOutline, alertCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [RouterModule, IonContent, IonHeader, IonToolbar, IonTitle, IonIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './notificacoes.component.html',
  styleUrl: './notificacoes.component.css'
})
export class NotificacoesComponent {
  constructor() { addIcons({ notificationsOutline, calendarOutline, personAddOutline, alertCircleOutline }); }
}
