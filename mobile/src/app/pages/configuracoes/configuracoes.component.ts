import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, storefrontOutline, lockClosedOutline, notificationsOutline, helpCircleOutline, logOutOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [RouterModule, IonContent, IonHeader, IonToolbar, IonTitle, IonIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.css'
})
export class ConfiguracoesComponent {
  constructor() {
    addIcons({ personOutline, storefrontOutline, lockClosedOutline, notificationsOutline, helpCircleOutline, logOutOutline, chevronForwardOutline });
  }
}
