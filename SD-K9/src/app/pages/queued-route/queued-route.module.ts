import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QueuedRoutePageRoutingModule } from './queued-route-routing.module';
import { QueuedRoutePage } from './queued-route.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QueuedRoutePageRoutingModule
  ],
  declarations: [QueuedRoutePage]
})
export class QueuedRoutesPageModule {}