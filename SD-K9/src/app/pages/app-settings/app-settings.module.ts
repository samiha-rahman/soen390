import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { IonicModule } from '@ionic/angular';

import { AppsettingsPageRoutingModule } from './app-settings-routing.module';

import { AppSettings } from './app-settings.page';
import { GoogleCalendarComponent } from 'src/app/components/google-calendar/google-calendar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppsettingsPageRoutingModule,
    ModalController
  ],
  declarations: [
    AppSettings,
    GoogleCalendarComponent
  ]
})
export class AppsettingsPageModule {}
