import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationSearchPage } from './location-search.page';

const routes: Routes = [
  {
    path: '',
    component: LocationSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationSearchPageRoutingModule {}
