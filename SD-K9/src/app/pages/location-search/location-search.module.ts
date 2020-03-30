import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationSearchPageRoutingModule } from './location-search-routing.module';

import { LocationSearchPage } from './location-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationSearchPageRoutingModule
  ],
  declarations: [LocationSearchPage]
})
export class LocationSearchPageModule {}
