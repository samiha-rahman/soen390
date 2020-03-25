import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemoIndoorNavPage } from './demo-indoor-nav.page';

const routes: Routes = [
  {
    path: '',
    component: DemoIndoorNavPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoIndoorNavPageRoutingModule {}
