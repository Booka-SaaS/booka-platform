import { Component } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline, home,
  calendarOutline, calendar,
  peopleOutline, people,
  cutOutline, cut,
  settingsOutline, settings
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs-layout',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet],
  templateUrl: './tabs-layout.component.html',
})
export class TabsLayoutComponent {
  constructor() {
    addIcons({
      homeOutline, home,
      calendarOutline, calendar,
      peopleOutline, people,
      cutOutline, cut,
      settingsOutline, settings
    });
  }
}
