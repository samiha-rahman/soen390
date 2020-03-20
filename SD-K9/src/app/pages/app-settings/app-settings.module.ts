import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppsettingsPageRoutingModule } from './app-settings-routing.module';

import { AppSettings } from './app-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppsettingsPageRoutingModule
  ],
  declarations: [AppSettings]
})
export class AppsettingsPageModule {}
