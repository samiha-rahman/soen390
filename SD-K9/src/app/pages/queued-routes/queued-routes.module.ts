import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QueuedRoutesPageRoutingModule } from './queued-routes-routing.module';

import { QueuedRoutesPage } from './queued-routes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QueuedRoutesPageRoutingModule
  ],
  declarations: [QueuedRoutesPage]
})
export class QueuedRoutesPageModule {}
