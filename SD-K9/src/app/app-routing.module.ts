import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
  {
    path: 'bus',
    loadChildren: () => import('src/app/modals/bus/bus.module').then(m => m.BusPageModule)
  },
  {
    path: 'appsettings',
    loadChildren: () => import('src/app/modals/appsettings/appsettings.module').then(m => m.AppsettingsPageModule)
  },
  {
    path: 'outdoor',
    loadChildren: () => import('./pages/outdoor/outdoor.module').then(m => m.OutdoorPageModule)
  },
  {
    path: 'indoor',
    loadChildren: () => import('./pages/demo-indoor-nav/demo-indoor-nav.module').then(m => m.DemoIndoorNavPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
