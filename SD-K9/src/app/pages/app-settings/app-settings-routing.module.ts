import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppSettings } from './app-settings.page';

const routes: Routes = [
  {
    path: '',
    component: AppSettings
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsettingsPageRoutingModule {}
