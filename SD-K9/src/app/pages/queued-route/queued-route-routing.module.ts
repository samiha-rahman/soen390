import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueuedRoutePage } from './queued-route.page';
const routes: Routes = [
  {
    path: '',
    component: QueuedRoutePage
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueuedRoutePageRoutingModule {}