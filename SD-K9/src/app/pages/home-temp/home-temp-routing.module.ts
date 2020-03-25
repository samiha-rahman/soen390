import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeTempPage } from './home-temp.page';

const routes: Routes = [
  {
    path: '',
    component: HomeTempPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTempPageRoutingModule {}