import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline, addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor() { addIcons({ notificationsOutline, addOutline }); }
}
