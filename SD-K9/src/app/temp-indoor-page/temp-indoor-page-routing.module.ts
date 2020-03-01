import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TempIndoorPagePage } from './temp-indoor-page.page';

const routes: Routes = [
  {
    path: '',
    component: TempIndoorPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TempIndoorPagePageRoutingModule {}
